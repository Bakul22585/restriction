import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import * as $ from 'jquery';

import { VillagesDataSource } from 'src/app/core/villages/models/data-source/villages.datasource';
import { VillageModel } from 'src/app/core/villages/models/village.model';
import { VillagesService } from 'src/app/core/villages/services';
import { HistoryModel } from '../../core/historys/models/history.model';
import { HistorysService } from '../../core/historys/services/historys.service';
import { ApiUrlService } from '../../core/services/api-url.service';

import { LayoutUtilsVillagesService, MessageType } from 'src/app/core/villages/utils/layout-utils-villages.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

@Component({
  selector: 'app-villages',
  templateUrl: './villages.component.html',
  styleUrls: ['./villages.component.css']
})
export class VillagesComponent implements OnInit {

  public model: any = VillageModel;
  public villageId = 0;
  villageForm: FormGroup;
  hasFormErrors: boolean = false;
  errors: any = [];

  dataSource: VillagesDataSource;
  displayedColumns = ['serial_id', 'village_name', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('villagename') villagename: ElementRef;

  filterStatus: string = '';
  filterType: string = '';
  image_str = '';
  // Selection
  selection = new SelectionModel<VillageModel>(true, []);
  villagesResult: VillageModel[] = [];
  SerialNumber = 1;

  constructor(
    private villagesService: VillagesService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsVillagesService,
    private translate: TranslateService,
    private villageService: VillagesService,
    private fb: FormBuilder,
    public historyService: HistorysService
  ) { }

  ngOnInit() {
    // this.villageId = localStorage.getItem("editVillageId") ? parseInt(localStorage.getItem("editVillageId")) : 0;
    this.createForm();

    // If the village changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
     - when a pagination village occurs => this.paginator.page
     - when a sort village occurs => this.sort.sortChange
     **/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadVillagesList();
        })
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // tslint:disable-next-line:max-line-length
        debounceTime(150), // The village can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
        distinctUntilChanged(), // This operator will eliminate duplicate values
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadVillagesList();
        })
      )
      .subscribe();

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new VillagesDataSource(this.villagesService);
    // First load
    this.dataSource.loadVillages(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.villagesResult = res));
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.villageForm.controls;
    /** check form */
    if (this.villageForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }

    const editedVillage = this.prepareVillage();
    if (this.villageId > 0) {
      this.updateVillage(editedVillage);
    } else {
      this.createVillage(editedVillage);
    }
    this.villageForm.reset();
    Object.keys(controls).forEach(controlName =>
      controls[controlName].setErrors(null)
    );
  }

  loadVillagesList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadVillages(queryParams);
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

    filter.village_name = searchText;

    return filter;
  }

  /** ACTIONS */
  /** Delete */
  deleteVillage(_item: VillageModel) {
    const _title: string = this.translate.instant('VILLAGES.DELETE_VILLAGE_SIMPLE.TITLE');
    const _description: string = this.translate.instant('VILLAGES.DELETE_VILLAGE_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('VILLAGES.DELETE_VILLAGE_SIMPLE.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('VILLAGES.DELETE_VILLAGE_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      const _obj = new VillageModel();
      _obj.user_id = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
      _obj.id = _item.id;
      this.villagesService.deleteVillage(_obj).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Village';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete ' + _item.village_name + ' village.';
        _history.action = 'Detele';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadVillagesList();
      });
    });
  }

  deleteVillages() {
    const _title: string = this.translate.instant('VILLAGES.DELETE_VILLAGE_MULTY.TITLE');
    const _description: string = this.translate.instant('VILLAGES.DELETE_VILLAGE_MULTY.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('VILLAGES.DELETE_VILLAGE_MULTY.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('VILLAGES.DELETE_VILLAGE_MULTY.DELETE_VILLAGE_MULTY.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.villagesService.deleteVillages(idsForDeletion).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Village';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete multiple village.';
        _history.action = 'Detele';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadVillagesList();
        this.selection.clear();
      });
    });
  }

  /** Fetch */
  fetchVillages() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.village_name}`,
        id: elem.id.toString(),
        status: elem.is_active
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /** Update Status */
  updateStatusForVillages() {
    const _title = this.translate.instant('VILLAGES.UPDATE_STATUS.TITLE');
    const _updateMessage = this.translate.instant('VILLAGES.UPDATE_STATUS.MESSAGE');
    const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
    const _messages = [];

    this.selection.selected.forEach(elem => {
      _messages.push({
        text: `${elem.village_name}`,
        id: elem.id.toString(),
        status: elem.is_active,
        statusTitle: this.getItemStatusString(elem.is_active.toString()),
        statusCssClass: this.getItemCssClassByStatus(elem.is_active.toString())
      });
    });

    const dialogRef = this.layoutUtilsService.updateStatusForVillages(_title, _statuses, _messages);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.selection.clear();
        return;
      }

      this.villagesService.updateStatusForVillage(this.selection.selected, +res).subscribe(() => {
        const status = res === 0 ? 'Suspended' : res === 1 ? 'Active' : 'Pending';
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Village';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update village status ' + status + '.';
        _history.action = 'Update';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
        this.loadVillagesList();
        this.selection.clear();
      });
    });
  }

  /** Edit */
  editVillage(village: VillageModel) {
    const controls = this.villageForm.controls;
    controls['village_name'].setValue(village.village_name);
    this.villagename.nativeElement.focus();
    this.villageId = village.id;
  }

  /** SELECTION */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.villagesResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.selection.selected.length === this.villagesResult.length) {
      this.selection.clear();
    } else {
      this.villagesResult.forEach(row => this.selection.select(row));
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
    this.villageForm = this.fb.group({
      village_name: [this.model.village_name, Validators.required],
      is_active: [this.model.is_active]
    });
  }

  prepareVillage(): VillageModel {
    const controls = this.villageForm.controls;
    const _village = new VillageModel();
    _village.id = this.villageId;
    _village.village_name = controls['village_name'].value;
    _village.user_id = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
    _village.is_active = 1;
    return _village;
  }

  updateVillage(_village: VillageModel) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    this.villageService.updateVillage(_village).subscribe(res => {
      this.villageId = 0;
      /* Server loading imitation. Remove this on real code */
      /* const _history = new HistoryModel();
      _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
      _history.module = 'Village';
      _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update village \'' + _village.village_name + '\' . ';
      _history.action = 'Update';
      _history.created_date = new Date();
      this.historyService.createHistory(_history).subscribe(responce => {
      }); */
      this.layoutUtilsService.showActionNotification(res['message'], MessageType.Delete);
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
      this.loadVillagesList();
      this.model.id = undefined;
    });
  }

  createVillage(_village: VillageModel) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    this.villageService.createVillage(_village).subscribe(res => {
      /* const _history = new HistoryModel();
      _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
      _history.module = 'Village';
      _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was insert village \'' + _village.village_name + '\' . ';
      _history.action = 'Insert';
      _history.created_date = new Date();
      this.historyService.createHistory(_history).subscribe(responce => {
      }); */
      this.layoutUtilsService.showActionNotification(res['message'], MessageType.Delete);
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
      this.loadVillagesList();
    });
  }

  validate(f: NgForm) {
    if (f.form.status === 'VALID') {
      return true;
    }

    this.errors = [];
    return false;
  }

  onAlertClose($village) {
    this.hasFormErrors = false;
  }

  DownloadXLX() {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ApiUrlService.URL + 'export_village_xlsx';
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
        this.villageService.UploadVillageFile(obj).subscribe(res => {
          this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
          this.loadVillagesList();
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
