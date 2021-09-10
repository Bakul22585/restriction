import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { FundsDataSource } from 'src/app/core/funds/models/data-source/funds.datasource';
import { FundModel } from 'src/app/core/funds/models/fund.model';
import { FundsService } from 'src/app/core/funds/services';
import { UsersDataSource } from 'src/app/core/users/models/data-source/users.datasource';
import { UsersService } from 'src/app/core/users/services';

@Component({
  selector: 'app-restore-donation-data',
  templateUrl: './restore-donation-data.component.html',
  styleUrls: ['./restore-donation-data.component.css']
})
export class RestoreDonationDataComponent implements OnInit {

  dataSource: FundsDataSource;
  displayedColumns = [
    'serial_id',
    'event_id',
    'user_id',
    'purpose',
    'actual_amount',
    'paid_amount',
    'remaining_amount',
    'payent_by',
    'paid_end_date',
    'status',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  UserdataSource: UsersDataSource;
  UserdisplayedColumns = ['serial_id', 'first_name', 'last_name', 'phone_no', 'village_id', 'role_id', 'area_id', 'actions'];
  @ViewChild(MatPaginator) Userpaginator: MatPaginator;
  @ViewChild(MatSort) Usersort: MatSort;
  // Filter fields
  // @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus = '';
  filterType = '';
  UserData: any = [];
  SerialNumber = 1;

  constructor(
    private fundsService: FundsService,
    private usersService: UsersService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsUsersService,
    private translate: TranslateService,
    private router: Router,
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
          this.loadFundsList();
        })
      )
      .subscribe();

    // Filtration, bind to searchInput
    // fromEvent(this.searchInput.nativeElement, 'keyup')
    //   .pipe(
    //     // tslint:disable-next-line:max-line-length
    //     debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
    //     distinctUntilChanged(), // This operator will eliminate duplicate values
    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.loadFundsList();
    //     })
    //   )
    //   .subscribe();

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new FundsDataSource(this.fundsService);
    // First load
    this.dataSource.loadDeleteFunds(queryParams);

    const userqueryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.UserdataSource = new UsersDataSource(this.usersService);
    // First load
    this.UserdataSource.loadDeleteUsers(userqueryParams);
    // this.dataSource.entitySubject.subscribe(res => {});
  }

  loadFundsList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadDeleteFunds(queryParams);
  }

  UserloadFundsList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.UserdataSource.loadDeleteUsers(queryParams);
  }

  /** FILTRATION */
  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    // const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterStatus && this.filterStatus.length > 0) {
      filter.status = +this.filterStatus;
    }

    if (this.filterType && this.filterType.length > 0) {
      filter.type = +this.filterType;
    }

    if (!isGeneralSearch) {
      return filter;
    }

    // filter.event_id = searchText;
    // filter.user_id = searchText;

    return filter;
  }

  RestoreDonation(Donation) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    const obj = {};
    obj['fund_id'] = Donation.id;
    obj['user_id'] = Donation.user_id;

    this.fundsService.RestoreDonation(obj).subscribe(res => {
      this.layoutUtilsService.showActionNotification(res['message'], 0, 3000, true, false);
      if (res['success'] === '1') {
        this.loadFundsList();
      }
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
    });
  }

  RestoreUser(User) {
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    const obj = {};
    obj['user_id'] = User.id;

    this.usersService.RestoreUser(obj).subscribe(res => {
      this.layoutUtilsService.showActionNotification(res['message'], 0, 3000, true, false);
      if (res['success'] === '1') {
        this.UserloadFundsList();
      }
      $('#mainloader').css({ 'display': 'none' });
      $('body').removeAttr('style');
    });
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
