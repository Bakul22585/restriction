import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import * as $ from 'jquery';

import { RolesDataSource } from 'src/app/core/roles/models/data-source/roles.datasource';
import { RoleModel } from 'src/app/core/roles/models/role.model';
import { RolesService } from 'src/app/core/roles/services';
import { HistoryModel } from '../../core/historys/models/history.model';
import { HistorysService } from '../../core/historys/services/historys.service';
import { ApiUrlService } from '../../core/services/api-url.service';

import { LayoutUtilsRolesService, MessageType } from 'src/app/core/roles/utils/layout-utils-roles.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  public model: any = RoleModel;
  public roleId = 0;
  roleForm: FormGroup;
  hasFormErrors: boolean = false;
  errors: any = [];

  dataSource: RolesDataSource;
  displayedColumns = ['serial_id', 'role_name', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('rolename') rolename: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  image_str = '';
  SerialNumber = 1;
  // Selection
  selection = new SelectionModel<RoleModel>(true, []);
  rolesResult: RoleModel[] = [];

  constructor(
    private rolesService: RolesService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsRolesService,
    private translate: TranslateService,
    private roleService: RolesService,
    private fb: FormBuilder,
    public historyService: HistorysService
  ) { }

  ngOnInit() {
    // this.roleId = localStorage.getItem("editRoleId") ? parseInt(localStorage.getItem("editRoleId")) : 0;
    this.createForm();

    // If the role changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
     - when a pagination role occurs => this.paginator.page
     - when a sort role occurs => this.sort.sortChange
     **/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadRolesList();
        })
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // tslint:disable-next-line:max-line-length
        debounceTime(150), // The role can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
        distinctUntilChanged(), // This operator will eliminate duplicate values
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadRolesList();
        })
      )
      .subscribe();

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new RolesDataSource(this.rolesService);
    // First load
    this.dataSource.loadRoles(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.rolesResult = res));
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.roleForm.controls;
    /** check form */
    if (this.roleForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }

    const editedRole = this.prepareRole();
    if (this.roleId > 0) {
      this.updateRole(editedRole);
    } else {
      this.createRole(editedRole);
    }
    this.roleForm.reset();
    Object.keys(controls).forEach(controlName =>
      controls[controlName].setErrors(null)
    );
  }

  loadRolesList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadRoles(queryParams);
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

    filter.role_name = searchText;

    return filter;
  }

  /** ACTIONS */
  /** Delete */
  deleteRole(_item: RoleModel) {
    const _title: string = this.translate.instant('ROLES.DELETE_ROLE_SIMPLE.TITLE');
    const _description: string = this.translate.instant('ROLES.DELETE_ROLE_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('ROLES.DELETE_ROLE_SIMPLE.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('ROLES.DELETE_ROLE_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      const _role = new RoleModel();
      _role.id = _item.id;
      _role.user_id = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
      this.rolesService.deleteRole(_role).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Role';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete ' + _item.role_name + ' role.';
        _history.action = 'Delete';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadRolesList();
      });
    });
  }

  deleteRoles() {
    const _title: string = this.translate.instant('ROLES.DELETE_ROLE_MULTY.TITLE');
    const _description: string = this.translate.instant('ROLES.DELETE_ROLE_MULTY.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('ROLES.DELETE_ROLE_MULTY.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('ROLES.DELETE_ROLE_MULTY.DELETE_ROLE_MULTY.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.rolesService.deleteRoles(idsForDeletion).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Role';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete multiple role. ';
        _history.action = 'Delete';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadRolesList();
        this.selection.clear();
      });
    });
  }

  /** Fetch */
  fetchRoles() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.roles_name}`,
        id: elem.id.toString(),
        status: elem.is_active
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /** Update Status */
  updateStatusForRoles() {
    const _title = this.translate.instant('ROLES.UPDATE_STATUS.TITLE');
    const _updateMessage = this.translate.instant('ROLES.UPDATE_STATUS.MESSAGE');
    const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
    const _messages = [];

    this.selection.selected.forEach(elem => {
      _messages.push({
        text: `${elem.roles_name}`,
        id: elem.id.toString(),
        status: elem.is_active,
        statusTitle: this.getItemStatusString(elem.is_active.toString()),
        statusCssClass: this.getItemCssClassByStatus(elem.is_active.toString())
      });
    });

    const dialogRef = this.layoutUtilsService.updateStatusForRoles(_title, _statuses, _messages);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.selection.clear();
        return;
      }

      this.rolesService.updateStatusForRole(this.selection.selected, +res).subscribe(() => {
        const status = res === 0 ? 'Suspended' : res === 1 ? 'Active' : 'Pending';
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Role';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update role status ' + status + '.';
        _history.action = 'Update';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
        this.loadRolesList();
        this.selection.clear();
      });
    });
  }

  /** Edit */
  editRole(role: RoleModel) {
    console.log(role);
    const controls = this.roleForm.controls;
    controls['role_name'].setValue(role.roles_name);
    this.rolename.nativeElement.focus();
    this.roleId = role.id;
  }

  /** SELECTION */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.rolesResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.selection.selected.length === this.rolesResult.length) {
      this.selection.clear();
    } else {
      this.rolesResult.forEach(row => this.selection.select(row));
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
    this.roleForm = this.fb.group({
      role_name: [this.model.role_name, Validators.required],
      is_active: [this.model.is_active]
    });
  }

  prepareRole(): RoleModel {
    const controls = this.roleForm.controls;
    const _role = new RoleModel();
    _role.id = this.roleId;
    _role.roles_name = controls['role_name'].value;
    _role.user_id = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
    _role.is_active = 1;
    return _role;
  }

  updateRole(_role: RoleModel) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    this.roleService.updateRole(_role).subscribe(res => {
      /* Server loading imitation. Remove this on real code */
      /* const _history = new HistoryModel();
      _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
      _history.module = 'Role';
      _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update role \'' + _role.role_name + '\' . ';
      _history.action = 'Update';
      _history.created_date = new Date();
      this.historyService.createHistory(_history).subscribe(responce => {
      }); */
      this.layoutUtilsService.showActionNotification(res['message'], MessageType.Delete);
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
      this.loadRolesList();
      this.model.id = undefined;
      this.roleId = 0;
    });
  }

  createRole(_role: RoleModel) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    this.roleService.createRole(_role).subscribe(res => {
      /* const _history = new HistoryModel();
      _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
      _history.module = 'Role';
      _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was insert role \'' + _role.role_name + '\' . ';
      _history.action = 'Insert';
      _history.created_date = new Date();
      this.historyService.createHistory(_history).subscribe(responce => {
      }); */
      this.layoutUtilsService.showActionNotification(res['message'], MessageType.Delete);
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
      this.loadRolesList();
    });
  }

  validate(f: NgForm) {
    if (f.form.status === 'VALID') {
      return true;
    }

    this.errors = [];
    return false;
  }

  onAlertClose($role) {
    this.hasFormErrors = false;
  }

  DownloadXLX() {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ApiUrlService.URL + 'export_role_xlsx';
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
        this.rolesService.UploadRoleFile(obj).subscribe(res => {
          this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
          this.loadRolesList();
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
