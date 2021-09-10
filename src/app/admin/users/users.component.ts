import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

import { UsersDataSource } from 'src/app/core/users/models/data-source/users.datasource';
import { UserModel } from 'src/app/core/users/models/user.model';
import { UsersService } from 'src/app/core/users/services';
import { HistoryModel } from '../../core/historys/models/history.model';
import { HistorysService } from '../../core/historys/services/historys.service';
import { ChildUserComponent } from './child-user/child-user.component';

import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dataSource: UsersDataSource;
  displayedColumns = ['select', 'serial_id', 'first_name', 'last_name', 'phone_no', 'village_id', 'role_id', 'area_id', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  // Selection
  selection = new SelectionModel<UserModel>(true, []);
  usersResult: Array<any> = [];
  usermember: any = [];
  SerialNumber = 1;
  is_delete = 0;
  UserICards: any = [];
  ShowUserCard = false;
  ProjectName = localStorage.getItem('project_name');

  constructor(
      private usersService: UsersService,
      public dialog: MatDialog,
      public snackBar: MatSnackBar,
      private layoutUtilsService: LayoutUtilsUsersService,
      private translate: TranslateService,
      private router: Router,
      public historyService: HistorysService,
      public _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
     - when a pagination user occurs => this.paginator.page
     - when a sort user occurs => this.sort.sortChange
     **/
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => {
              this.loadUsersList();
            })
        )
        .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
        .pipe(
            // tslint:disable-next-line:max-line-length
            debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
            distinctUntilChanged(), // This operator will eliminate duplicate values
            tap(() => {
              this.paginator.pageIndex = 0;
              this.loadUsersList();
            })
        )
        .subscribe();

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new UsersDataSource(this.usersService);
    // First load
    this.dataSource.loadUsers(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.usersResult = res));
    this.usersService.getAllSubUsers().subscribe(res => {
      this.usermember = res;
    });
  }

  loadUsersList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
        this.filterConfiguration(true),
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
    );
    this.dataSource.loadUsers(queryParams);
    this.usersService.SearchSubUsers(queryParams).subscribe(res => {
      this.usermember = new Array(Number(res['totalmember']));
    });
    this.selection.clear();
  }

  /** FILTRATION */
  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    /* if (this.filterStatus && this.filterStatus.length > 0) {
      filter.is_active = +this.filterStatus;
    } */

    if (this.filterType && this.filterType.length > 0) {
      filter.type = +this.filterType;
    }

    if (!isGeneralSearch) {
      return filter;
    }

    if (this.filterStatus === 'first_name') {
      filter.first_name = searchText;
    } else if (this.filterStatus === 'last_name') {
      filter.last_name = searchText;
    } else if (this.filterStatus === 'phone') {
      filter.phone_no = searchText;
    } else if (this.filterStatus === 'village') {
      filter.village_id = searchText;
    } else if (this.filterStatus === 'role') {
      filter.role_id = searchText;
    } else if (this.filterStatus === 'area') {
      filter.area_id = searchText;
    } else {
      filter.first_name = searchText;
      filter.last_name = searchText;
      filter.phone_no = searchText;
      filter.village_id = searchText;
      filter.role_id = searchText;
      filter.area_id = searchText;
      filter.all = 1;
    }

    return filter;
  }

  /** ACTIONS */
  /** Delete */
  deleteUser(_item: UserModel) {
    this.is_delete = 1;
    const _title: string = this.translate.instant('USERS.DELETE_USER_SIMPLE.TITLE');
    const _description: string = this.translate.instant('USERS.DELETE_USER_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('USERS.DELETE_USER_SIMPLE.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('USERS.DELETE_USER_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      this.is_delete = 0;
      if (!res) {
        return;
      }
      const obj = {};
      obj['id'] = _item.id;
      obj['user_id'] = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
      this.usersService.deleteUser(obj).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'User';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete \'' + _item.first_name + ' ' + _item.last_name + '\' profile.';
        _history.action = 'Delete';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadUsersList();
      });
    });
  }

  deleteUsers() {
    const _title: string = this.translate.instant('USERS.DELETE_USER_MULTY.TITLE');
    const _description: string = this.translate.instant('USERS.DELETE_USER_MULTY.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('USERS.DELETE_USER_MULTY.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('USERS.DELETE_USER_MULTY.DELETE_USER_MULTY.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.usersService
          .deleteUsers(idsForDeletion)
          .subscribe(() => {
            /* const _history = new HistoryModel();
            _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
            _history.module = 'User';
            _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete multiple user profile.';
            _history.action = 'Delete';
            _history.created_date = new Date();
            this.historyService.createHistory(_history).subscribe(responce => {
            }); */
            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
            this.loadUsersList();
            this.selection.clear();
          });
    });
  }

  /** Fetch */
  fetchUsers() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.first_name}, ${elem.last_name}`,
        id: elem.id.toString(),
        status: elem.is_active
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /** Update Status */
  updateStatusForUsers() {
    const _title = this.translate.instant('USERS.UPDATE_STATUS.TITLE');
    const _updateMessage = this.translate.instant('USERS.UPDATE_STATUS.MESSAGE');
    const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
    const _messages = [];

    this.selection.selected.forEach(elem => {
      _messages.push({
        text: `${elem.first_name}, ${elem.last_name}`,
        id: elem.id.toString(),
        status: elem.is_active,
        statusTitle: this.getItemStatusString(elem.is_active.toString()),
        statusCssClass: this.getItemCssClassByStatus(elem.is_active.toString())
      });
    });

    const dialogRef = this.layoutUtilsService.updateStatusForUsers(_title, _statuses, _messages);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.selection.clear();
        return;
      }

      this.usersService.updateStatusForUser(this.selection.selected, +res).subscribe(() => {
        const status = res === 0 ? 'Suspended' : res === 1 ? 'Active' : 'Pending';
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'User';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update user status ' + status + '.';
        _history.action = 'Update';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
        this.loadUsersList();
        this.selection.clear();
      });
    });
  }

  addUser() {
    const newUser = new UserModel();
    newUser.clear(); // Set all defaults fields
    this.editUser(newUser);
  }

  /** Edit */
  editUser(user: UserModel) {
    let saveMessageTranslateParam = 'USERS.EDIT.';
    saveMessageTranslateParam += user.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = user.id > 0 ? MessageType.Update : MessageType.Create;
    localStorage.removeItem('editUserId');
    if (user.id != 0) {
      localStorage.setItem('editUserId', '' + user.id);
    }

    user.id > 0 ? this.router.navigate(['admin/users/addedit', user.id]) : this.router.navigate(['admin/users/addedit']);
  }

  /** SELECTION */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.usersResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.selection.selected.length === this.usersResult.length) {
      this.selection.clear();
    } else {
      this.usersResult.forEach(row => this.selection.select(row));
    }
  }

  ShowChildUser(User) {
    if (this.is_delete === 0) {
      const dialogRef = this.dialog.open(ChildUserComponent, { data: { User } });
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

  PrintCard() {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    const ids = [];
    this.selection.selected.forEach(elem => {
      ids.push(elem.id);
    });
    this.usersService.GetPrintUser(ids.toString()).subscribe(res => {
      this.UserICards = res['data'];
      this._ref.detectChanges();
      setTimeout(() => {
        this.MultipleICardPrint();
        this.UserICards = [];
        this._ref.detectChanges();
      }, 1000);
      // setTimeout(() => {
      //   console.log('hide card');
      // }, 1200);
    });
  }

  MultipleICardPrint() {
    const printContent = document.getElementById('printcard');
    if (printContent === null) {
      this.ShowUserCard = true;
      // this.MultipleICardPrint();
      this._ref.detectChanges();
      return false;
    }
    const html = `<html>
                    <head>
                      <style>
                        body {
                          background-color: #ffffff;
                          font-family: 'sans-serif';
                          color: #575962;
                        }
                        .id-card-holder {
                            width: 233px;
                            padding: 4px;
                            margin: 0 auto;
                            background-color: #1f1f1f;
                            border-radius: 5px;
                            position: relative;
                        }
                        .id-card-holder:after {
                            content: '';
                            width: 7px;
                            display: block;
                            background-color: #0a0a0a;
                            height: 100px;
                            position: absolute;
                            top: 105px;
                            border-radius: 0 5px 5px 0;
                        }
                        .id-card-holder:before {
                            content: '';
                            width: 7px;
                            display: block;
                            background-color: #0a0a0a;
                            height: 100px;
                            position: absolute;
                            top: 105px;
                            left: 236px;
                            border-radius: 5px 0 0 5px;
                        }
                        .id-card {
                            background-color: #fff;
                            padding: 10px;
                            border-radius: 10px;
                            text-align: center;
                            box-shadow: 0 0 1.5px 0px #b9b9b9;
                        }
                        .id-card img {
                            margin: 0 auto;
                        }
                        .header {
                            font: 1.5em sans-serif;
                            text-align: center;
                        }
                        .photo img {
                            width: 80px;
                            margin-top: 15px;
                            text-align: center;
                        }
                        h2 {
                            font-size: 15px;
                            margin: 5px 0;
                            font-weight: 500;
                            line-height: 1.2;
                            color: inherit;
                            font-family: 'sans-serif';
                        }
                        h3 {
                            font-size: 12px;
                            margin: 2.5px 0;
                            font-weight: 300;
                        }
                        .qr-code img {
                            width: 50px;
                        }
                        p {
                            font-size: 12px;
                            margin: 2px;
                            font-family: 'sans-serif';
                            font-weight: 300;
                        }
                        .p-footer {
                            font-size: 11px;
                            margin: 1.5px;
                        }
                        .id-card-hook {
                            background-color: #000;
                            width: 70px;
                            margin: 0 auto;
                            height: 15px;
                            border-radius: 5px 5px 0 0;
                        }
                        .id-card-hook:after {
                            content: '';
                            background-color: #d7d6d3;
                            width: 47px;
                            height: 6px;
                            display: block;
                            margin: 0px auto;
                            position: relative;
                            top: 6px;
                            border-radius: 4px;
                        }
                        .user-detail {
                            margin-top: 0px;
                            margin-bottom: .5rem;
                            font-family: 'sans-serif';
                            display: inline-block;
                            flex: 0 0 50%;
                            top: -10px;
                            position: relative;
                            width: 100%;
                            // min-height: 1px;
                            // padding-right: 15px;
                            // padding-left: 15px;
                            font-weight: 300;
                            max-width: 71%;
                            text-align: left;
                        }
                        .col-md-3 {
                          width: 25%;
                          float: left;
                          position: relative;
                          min-height: 1px;
                          padding-right: 15px;
                          padding-left: 15px;
                          box-sizing: border-box;
                          display: block;
                          margin-top: 5px;
                        }
                        @media print {
                          .page-break {
                            page-break-before: always;
                          }
                        }
                      </style>
                    </head>
                  <body>`;
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(html + printContent.innerHTML + '</body></html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    $('#mainloader').css({ 'display': 'none' });
    $('body').removeAttr('style');
  }
}

