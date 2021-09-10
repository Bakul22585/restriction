import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { ExpencesDataSource } from '../../core/expences/models/data-source/expences.datasource';
import { ExpenceModel } from '../../core/expences/models/expence.model';
import { ExpencepayModel } from '../../core/expences/models/expencepay.model';
import { ExpencesService } from '../../core/expences/services/expences.service';
import { ExpencePayComponent } from './expence-pay/expence-pay.component';
import { ExpencePreviewComponent } from './expence-preview/expence-preview.component';
import { HistoryModel } from '../../core/historys/models/history.model';
import { HistorysService } from '../../core/historys/services/historys.service';

@Component({
  selector: 'app-expence',
  templateUrl: './expence.component.html',
  styleUrls: ['./expence.component.css']
})
export class ExpenceComponent implements OnInit {

  dataSource: ExpencesDataSource;
  displayedColumns = [
    'serial_id',
    'event_id',
    'user_id',
    'purpose',
    'actual_amount',
    'payent_by',
    'added_on',
    'status',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  // Selection
  selection = new SelectionModel<ExpenceModel>(true, []);
  usersResult: ExpenceModel[] = [];
  fundpay: any = [];
  pay_amount = 0;
  totalactual_amount = 0;
  totalpaid_amount = 0;
  totalremaining_amount = 0;
  UserData: any = [];
  SerialNumber = 1;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsUsersService,
    private translate: TranslateService,
    private router: Router,
    public expenceService: ExpencesService,
    public historyService: HistorysService
  ) { }

  ngOnInit() {
    this.UserData = JSON.parse(sessionStorage.getItem('user_data'))._value;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
     - when a pagination user occurs => this.paginator.page
     - when a sort user occurs => this.sort.sortChange
     **/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadExpencesList();
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
          this.loadExpencesList();
        })
      )
      .subscribe();

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new ExpencesDataSource(this.expenceService);
    // First load
    this.dataSource.loadExpences(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.usersResult = res;
      this.totalactual_amount = 0;
      this.totalpaid_amount = 0;
      this.totalremaining_amount = 0;
      if (res.length > 0) {
        // this.totalactual_amount = res[0]['total_actual_amount'];
        this.totalpaid_amount = res[0]['total_paid_amount'];
        // this.totalremaining_amount = res[0]['total_remaining_amount'];
      }
      // for (let index = 0; index < this.usersResult.length; index++) {
      //   const element = this.usersResult[index];
      //   this.totalactual_amount = Number(this.totalactual_amount) + Number(element.actual_amount);
      //   this.totalpaid_amount = Number(this.totalpaid_amount) + Number(element.paid_amount);
      //   this.totalremaining_amount = Number(this.totalremaining_amount) + Number(element.remaining_amount);
      // }
    });
  }

  loadExpencesList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadExpences(queryParams);
    this.selection.clear();
  }

  /** FILTRATION */
  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterStatus && this.filterStatus.length > 0) {
      filter.status = +this.filterStatus;
    }

    if (this.filterType && this.filterType.length > 0) {
      filter.type = +this.filterType;
    }

    if (!isGeneralSearch) {
      return filter;
    }

    filter.event_id = searchText;
    filter.user_id = searchText;

    return filter;
  }

  deleteFund(_item: ExpenceModel) {
    const _title: string = this.translate.instant('EXPENCE.DELETE_EXPENCE_SIMPLE.TITLE');
    const _description: string = this.translate.instant('EXPENCE.DELETE_EXPENCE_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('EXPENCE.DELETE_EXPENCE_SIMPLE.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('EXPENCE.DELETE_EXPENCE_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      const obj = {};
      obj['id'] = _item.id;
      obj['user_id'] = _item.user_id;
      this.expenceService.deleteExpence(obj).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Expence';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete \'' + _item.event_id + '\' expence.';
        _history.action = 'Delete';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadExpencesList();
      });
    });
  }

  deleteFunds() {
    const _title: string = this.translate.instant('EXPENCE.DELETE_EXPENCE_MULTY.TITLE');
    const _description: string = this.translate.instant('EXPENCE.DELETE_EXPENCE_MULTY.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('EXPENCE.DELETE_EXPENCE_MULTY.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('EXPENCE.DELETE_EXPENCE_MULTY.DELETE_EXPENCE_MULTY.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.expenceService.deleteExpences(idsForDeletion).subscribe(() => {
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Expence';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was delete multiple expences.';
        _history.action = 'Delete';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadExpencesList();
        this.selection.clear();
      });
    });
  }

  /** Fetch */
  fetchFunds() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.month_duration} Month duration in finish ${elem.initial_paid_amount} amount`
        /* id: elem.id.toString(),
        status: elem.status */
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /** Update Status */
  updateStatusForFunds() {
    const _title = this.translate.instant('EXPENCE.UPDATE_STATUS.TITLE');
    const _updateMessage = this.translate.instant('EXPENCE.UPDATE_STATUS.MESSAGE');
    const _statuses = [{ value: 2, text: 'Pending' }, { value: 0, text: 'Remaining' }, { value: 1, text: 'Completed' }];
    const _messages = [];
    const _fund = [];
    const _chnagefund = [];

    this.selection.selected.forEach(elem => {
      _messages.push({
        text: `${elem.event_id}, ${elem.user_id}`,
        id: elem.id.toString(),
        status: elem.status,
        statusTitle: this.getItemStatusString(elem.status),
        statusCssClass: this.getItemCssClassByStatus(elem.status)
      });
      _fund.push(elem);
    });

    const dialogRef = this.layoutUtilsService.updateStatusForUsers(_title, _statuses, _messages);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.selection.clear();
        return;
      }
      _fund.forEach(element => {
        // console.log(element);
        const _newfund = new ExpenceModel();
        _newfund.id = element.id;
        _newfund.event_id = element.event_id;
        _newfund.user_id = element.user_id;
        _newfund.purpose = element.purpose;
        _newfund.payent_by = element.payent_by;
        _newfund.status = res;
        if (res == 1) {
          _newfund.actual_amount = element.paid_amount;
          _newfund.paid_amount = element.paid_amount;
          _newfund.remaining_amount = 0;
          _newfund.paid_end_date = new Date();
          _newfund.is_installment_available = false;
          _newfund.month_duration = 0;
        } else {
          _newfund.actual_amount = element.actual_amount;
          _newfund.paid_amount = element.paid_amount;
          _newfund.remaining_amount = element.remaining_amount;
          _newfund.paid_end_date = element.paid_end_date;
          _newfund.is_installment_available = element.is_installment_available;
          _newfund.month_duration = element.month_duration;
        }
        this.expenceService.updateExpence(_newfund).subscribe(responce => {
          this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
          this.loadExpencesList();
          this.selection.clear();
        });
      });
      // console.log(res);
      // console.log(_fund);
      this.expenceService.updateStatusForExpence(_chnagefund, +res).subscribe(() => {
        const status = res === 0 ? 'Remaining' : res === 1 ? 'Completed' : 'Pending';
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Expence';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username + ' was update expence status '+status+'.';
        _history.action = 'Update';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
        this.loadExpencesList();
        this.selection.clear();
      });
    });
  }

  addFund() {
    const newExpence = new ExpenceModel();
    newExpence.clear(); // Set all defaults fields
    this.editFund(newExpence);
  }

  /** Edit */
  editFund(fund: ExpenceModel) {
    let saveMessageTranslateParam = 'EXPENCE.EDIT.';
    saveMessageTranslateParam += fund.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = fund.id > 0 ? MessageType.Update : MessageType.Create;
    localStorage.removeItem('editExpenceId');
    if (fund.id !== 0) {
      localStorage.setItem('editExpenceId', '' + fund.id);
    }

    fund.id > 0 ? this.router.navigate(['admin/expence/addedit', fund.id]) : this.router.navigate(['admin/expence/addedit']);
  }

  previewFund(fund: ExpenceModel) {
    let saveMessageTranslateParam = 'EXPENCE.EDIT.';
    saveMessageTranslateParam += fund.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = fund.id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ExpencePreviewComponent, { data: { fund } });
    dialogRef.afterClosed().subscribe(res => {
      this.loadExpencesList();
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, false);
      this.loadExpencesList();
    });
  }

  payFund(fund: ExpenceModel) {
    let saveMessageTranslateParam = 'EXPENCE.EDIT.';
    saveMessageTranslateParam += fund.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = fund.id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ExpencePayComponent, { data: { fund } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, false);
      this.loadExpencesList();
    });
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

  /** UI */
  getItemCssClassByStatus(status: number = 0): string {
    switch (status) {
      case 0:
        return 'metal';
      case 1:
        return 'success';
      case 2:
        return 'danger';
    }
    return '';
  }

  getItemStatusString(status: number = 0): string {
    switch (status) {
      case 0:
        return 'Remaining';
      case 1:
        return 'Completed';
      case 2:
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

  getItemPayentByTypeString(status): string {
    const type = Number(status);
    switch (type) {
      case 1:
        return 'Cash';
      case 2:
        return 'Cheque';
    }
    return '';
  }

  getItemStatusStering(status) {
    const type = Number(status);
    switch (type) {
      case 0:
        return 'Remaining';
      case 1:
        return 'Completed';
      case 2:
        return 'Pending';
    }
    return '';
  }

  remaining_amount(user) {
    /* this.pay_amount = 0;
    this.fundsService.getFundpayById(user.id).subscribe(res => {
      this.fundpay = res;
    });

    for (let index = 0; index < this.fundpay.length; index++) {
      this.pay_amount = this.pay_amount + this.fundpay[index].paid_amount;
    } */
    return user.actual_amount;
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
