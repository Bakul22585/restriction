import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import * as $ from 'jquery';

import { AreasDataSource } from 'src/app/core/areas/models/data-source/areas.datasource';
import { AreaModel } from 'src/app/core/areas/models/area.model';
import { AreasService } from 'src/app/core/areas/services/areas.service';
import { HistoryModel } from '../../core/historys/models/history.model';
import { HistorysService } from '../../core/historys/services/historys.service';
import { ApiUrlService } from '../../core/services/api-url.service';

import { LayoutUtilsAreasService, MessageType } from 'src/app/core/areas/utils/layout-utils-areas.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  public model: any = AreaModel;
  public areaId = 0;
  areaForm: FormGroup;
  hasFormErrors: boolean = false;
  errors: any = [];
  // @Output() Loader = false;
  Loader = true;

  dataSource: AreasDataSource;
  displayedColumns = ['serial_id', 'area_name', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('areaname') areaname: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  // Selection
  selection = new SelectionModel<AreaModel>(true, []);
  areasResult: AreaModel[] = [];
  public image_str = '';
  SerialNumber = 1;

  constructor(
    private areasService: AreasService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsAreasService,
    private translate: TranslateService,
    private areaService: AreasService,
    private fb: FormBuilder,
    public historyService: HistorysService
  ) { }

  ngOnInit() {
    // this.areaId = localStorage.getItem("editAreaId") ? parseInt(localStorage.getItem("editAreaId")) : 0;
    this.createForm();

    // If the area changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
     - when a pagination area occurs => this.paginator.page
     - when a sort area occurs => this.sort.sortChange
     **/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadAreasList();
        })
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // tslint:disable-next-line:max-line-length
        debounceTime(150), // The area can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
        distinctUntilChanged(), // This operator will eliminate duplicate values
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadAreasList();
        })
      )
      .subscribe();

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new AreasDataSource(this.areasService);
    // First load
    this.dataSource.loadAreas(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.areasResult = res));
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.areaForm.controls;
    /** check form */
    if (this.areaForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }

    const editedArea = this.prepareArea();
    if (this.areaId > 0) {
      this.updateArea(editedArea);
    } else {
      this.createArea(editedArea);
    }
    this.areaForm.reset();
    Object.keys(controls).forEach(controlName =>
      controls[controlName].setErrors(null)
    );
  }

  loadAreasList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadAreas(queryParams);
    this.selection.clear();
  }

  /** FILTRATION */
  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterStatus && this.filterStatus.length > 0) {
      filter.is_active = +this.filterStatus;
    }

    if (this.filterType && this.filterType.length > 0) {
      filter.type = +this.filterType;
    }

    if (!isGeneralSearch) {
      return filter;
    }

    filter.area_name = searchText;

    return filter;
  }

  /** ACTIONS */
  /** Delete */
  deleteArea(_item: AreaModel) {
    const _title: string = this.translate.instant('AREAS.DELETE_AREA_SIMPLE.TITLE');
    const _description: string = this.translate.instant('AREAS.DELETE_AREA_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('AREAS.DELETE_AREA_SIMPLE.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('AREAS.DELETE_AREA_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      const _area = new AreaModel();
      _area.id = _item.id;
      _area.user_id = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
      this.areasService.deleteArea(_area).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Area';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete \'' + _item.area_name + '\' area. ';
        _history.action = 'Delete';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadAreasList();
      });
    });
  }

  deleteAreas() {
    const _title: string = this.translate.instant('AREAS.DELETE_AREA_MULTY.TITLE');
    const _description: string = this.translate.instant('AREAS.DELETE_AREA_MULTY.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('AREAS.DELETE_AREA_MULTY.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('AREAS.DELETE_AREA_MULTY.DELETE_AREA_MULTY.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.areasService.deleteAreas(idsForDeletion).subscribe(() => {
         /*  const _history = new HistoryModel();
          _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
          _history.module = 'Area';
          _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete multiple area. ';
          _history.action = 'Delete';
          _history.created_date = new Date();
          this.historyService.createHistory(_history).subscribe(responce => {
          }); */
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadAreasList();
          this.selection.clear();
        });
    });
  }

  /** Fetch */
  fetchAreas() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.area_name}`,
        id: elem.id.toString(),
        status: elem.is_active
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /** Update Status */
  updateStatusForAreas() {
    const _title = this.translate.instant('AREAS.UPDATE_STATUS.TITLE');
    const _updateMessage = this.translate.instant('AREAS.UPDATE_STATUS.MESSAGE');
    const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
    const _messages = [];

    this.selection.selected.forEach(elem => {
      _messages.push({
        text: `${elem.area_name}`,
        id: elem.id.toString(),
        status: elem.is_active,
        statusTitle: this.getItemStatusString(elem.is_active.toString()),
        statusCssClass: this.getItemCssClassByStatus(elem.is_active.toString())
      });
    });

    const dialogRef = this.layoutUtilsService.updateStatusForAreas(_title, _statuses, _messages);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.selection.clear();
        return;
      }

      this.areasService.updateStatusForArea(this.selection.selected, +res).subscribe(() => {
        const status = res === 0 ? 'Suspended' : res === 1 ? 'Active' : 'Pending';
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Area';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update area status ' + status + '.';
        _history.action = 'Update';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
        this.loadAreasList();
        this.selection.clear();
      });
    });
  }

  /** Edit */
  editArea(area: AreaModel) {
    const controls = this.areaForm.controls;
    controls['area_name'].setValue(area.area_name);
    this.areaname.nativeElement.focus();
    this.areaId = area.id;
  }

  /** SELECTION */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.areasResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.selection.selected.length === this.areasResult.length) {
      this.selection.clear();
    } else {
      this.areasResult.forEach(row => this.selection.select(row));
    }
  }

  /** UI */
  getItemCssClassByStatus(status: string = '0'): string {
    switch (status) {
      case '0':
        return 'metal';
      case '1':
        return 'success';
      case '2':
        return 'danger';
    }
    return '';
  }

  getItemStatusString(status: string = '0'): string {
    switch (status) {
      case '0':
        return 'Suspended';
      case '1':
        return 'Active';
      case '2':
        return 'Pending';
    }
    return '';
  }

  getItemCssClassByType(status: number = 0): string {
    switch (status) {
      case 0:
        return 'accent';
      case 1:
        return 'primary';
      case 2:
        return '';
    }
    return '';
  }

  getItemTypeString(status: number = 0): string {
    switch (status) {
      case 0:
        return 'Business';
      case 1:
        return 'Individual';
    }
    return '';
  }

  createForm() {
    this.areaForm = this.fb.group({
      area_name: [this.model.area_name, Validators.required],
      is_active: [this.model.is_active]
    });
  }

  prepareArea(): AreaModel {
    const controls = this.areaForm.controls;
    const _area = new AreaModel();
    _area.id = this.areaId;
    _area.user_id = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
    _area.area_name = controls['area_name'].value;
    _area.is_active = 1;
    return _area;
  }

  updateArea(_area: AreaModel) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    this.areaService.updateArea(_area).subscribe(res => {
      this.areaId = 0;
      /* Server loading imitation. Remove this on real code */
      /* const _history = new HistoryModel();
      _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
      _history.module = 'Area';
      _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update area \'' + _area.area_name + '\' . ';
      _history.action = 'Update';
      _history.created_date = new Date();
      this.historyService.createHistory(_history).subscribe(responce => {
      }); */
      this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
      this.loadAreasList();
      this.model.id = undefined;
    });
  }

  createArea(_area: AreaModel) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    this.areaService.createArea(_area).subscribe(res => {
      /* const _history = new HistoryModel();
      _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
      _history.module = 'Area';
      _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was insert area \'' + _area.area_name + '\' . ';
      _history.action = 'Insert';
      _history.created_date = new Date();
      this.historyService.createHistory(_history).subscribe(responce => {
      }); */
      this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
      this.loadAreasList();
    });
  }

  validate(f: NgForm) {
    if (f.form.status === 'VALID') {
      return true;
    }

    this.errors = [];
    return false;
  }

  onAlertClose($area) {
    this.hasFormErrors = false;
  }

  DownloadXLX() {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ApiUrlService.URL + 'export_area_xlsx';
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image_str = file;
      const ext = this.image_str['name'].split('.');
      if (ext[1] === 'xlsx') {
        $('body').css({ 'overflow': 'hidden' });
        $('#mainloader').removeAttr('style');
        const obj = {};
        obj['file'] = this.image_str;
        obj['user_id'] = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
        this.areaService.UploadAreaFile(obj).subscribe(res => {
          this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
          this.loadAreasList();
          $('#mainloader').css({ 'display': 'none' });
          $('body').removeAttr('style');
        });
      } else {
        this.layoutUtilsService.showActionNotification('Please upload only excel xlsx file', 2, 3000, true, false);
      }
    }
    $('#uploadFile').val('');
  }

  SetPagination(PageDetail) {
    // console.log(PageDetail);
    // this.SerialNumber = PageDetail.length - (PageDetail.pageIndex) * (PageDetail.pageSize);
    this.SerialNumber = (PageDetail.pageIndex) * (PageDetail.pageSize);
    if (PageDetail.pageIndex === 0) {
      this.SerialNumber = 1;
    } else {
      this.SerialNumber = this.SerialNumber + 1;
    }
    // if (PageDetail.pageIndex > 0) {
    //   this.SerialNumber = this.SerialNumber - 1;
    // } else {
    //   this.SerialNumber = PageDetail.length;
    // }
  }

}
