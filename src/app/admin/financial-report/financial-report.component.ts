import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as _moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

import { LayoutUtilsVillagesService, MessageType } from 'src/app/core/villages/utils/layout-utils-villages.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { UserModel } from '../../core/users/models/user.model';
import { UsersDataSource } from '../../core/users/models/data-source/users.datasource';
import { UsersService } from '../../core/users/services/users.service';
import { FinancialReportDetailsComponent } from './financial-report-details/financial-report-details.component';
import { ApiUrlService } from '../../core/services/api-url.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class FinancialReportComponent implements OnInit {

  dataSource: UsersDataSource;
  // tslint:disable-next-line:max-line-length
  displayedColumns = ['serial_id', 'first_name', 'last_name', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  placeselection = '';
  fromdate = '';
  todate = new Date();
  mindonation = 1;
  maxdonation = 1;
  customerDate = '';
  donationFilter = '';
  SerialNumber = 1;

  constructor(
    public userService: UsersService,
    public _ref: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => {
          this.loadReportList();
        }))
      .subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(',', '', ''));
    this.dataSource = new UsersDataSource(this.userService);
    // First load
    // this.dataSource.loadUsersVillagewise(queryParams, '0');
    // this.dataSource.entitySubject.subscribe(res => (this.villagesResult = res));
  }

  loadReportList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration('', '', ''),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    if (this.placeselection === 'user') {
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'relation', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadUsersWiseFinancialReport(queryParams);
    } else if (this.placeselection === 'family') {
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadFamilyWiseFinancialReport(queryParams);
    } else if (this.placeselection === 'event') {
      this.displayedColumns = ['serial_id', 'event_name', 'first_name', 'last_name', 'village_id', 'phone_no', 'place', 'fund', 'expence'];
      this.dataSource.loadEventWiseFinancialReport(queryParams);
    } else if (this.placeselection === 'donation') {
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'relation', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadUsersWiseFinancialReport(queryParams);
    }
  }

  filterConfiguration(place, placeId, type): any {
    const filter: any = {};
    if (place === 'area') {
      filter.area_id = placeId;
    } else if (this.placeselection === 'donation') {
      if (place === 'user') {
        filter.user_id = 0;
      } else {
        filter.min = this.mindonation;
        filter.max = this.maxdonation;
        filter.customedate = this.customerDate;
        filter.option = this.donationFilter;
      }
    } else if (place === 'user') {
      filter.user_id = 0;
    } else {
      filter.village_id = placeId;
    }

    filter.main = type;
    return filter;
  }

  resetvalue() {
    if (this.placeselection === 'user') {
      const queryParams = new QueryParamsModel(
        this.filterConfiguration('user', '', ''),
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'relation', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadUsersWiseFinancialReport(queryParams);
    } else if (this.placeselection === 'family') {
      const queryParams = new QueryParamsModel(
        this.filterConfiguration('user', '', ''),
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadFamilyWiseFinancialReport(queryParams);
    } else if (this.placeselection === 'event') {
      const queryParams = new QueryParamsModel(
        this.filterConfiguration('user', '', ''),
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
      this.displayedColumns = ['serial_id', 'event_name', 'first_name', 'last_name', 'village_id', 'phone_no', 'place', 'fund', 'expence'];
      this.dataSource.loadEventWiseFinancialReport(queryParams);
    } else if (this.placeselection === 'donation') {
      const queryParams = new QueryParamsModel(
        this.filterConfiguration('user', '', ''),
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'relation', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadUsersWiseFinancialReport(queryParams);
    }
  }

  onSubmit() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration('', '', ''),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    if (this.placeselection === 'user') {
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'relation', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadUsersWiseFinancialReport(queryParams);
      window.scrollTo(550, 550);
    } else if (this.placeselection === 'family') {
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadFamilyWiseFinancialReport(queryParams);
      window.scrollTo(550, 550);
    } else if (this.placeselection === 'event') {
      this.displayedColumns = ['serial_id', 'event_name', 'first_name', 'last_name', 'village_id', 'phone_no', 'place', 'fund', 'expence'];
      this.dataSource.loadEventWiseFinancialReport(queryParams);
      window.scrollTo(550, 550);
    } else if (this.placeselection === 'donation') {
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'relation', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
      this.dataSource.loadUsersWiseFinancialReport(queryParams);
      window.scrollTo(550, 550);
    }
  }

  ReportPrint() {
    const link = document.createElement('a');
    link.target = '_blank';
    if (this.placeselection === 'user') {
      link.href = ApiUrlService.URL + 'export_user_finance_pdf_report&queryParams=' + JSON.stringify(this.filterConfiguration('', '', ''));
    } else if (this.placeselection === 'family') {
      // tslint:disable-next-line:max-line-length
      link.href = ApiUrlService.URL + 'export_family_donation_pdf_report&queryParams=' + JSON.stringify(this.filterConfiguration('', '', ''));
    } else if (this.placeselection === 'event') {
      link.href = ApiUrlService.URL + 'export_eventwise_pdf_report&queryParams=' + JSON.stringify(this.filterConfiguration('', '', ''));
    } else if (this.placeselection === 'donation') {
      link.href = ApiUrlService.URL + 'export_user_finance_pdf_report&queryParams=' + JSON.stringify(this.filterConfiguration('', '', ''));
    }
    link.setAttribute('visibility', 'hidden');
    link.click();
    // const printContent = document.getElementById('PrintReport');
    // const html = `<html>
    //                 <head>
    //                   <style>
    //                     .mat-table__wrapper {
    //                       width: 100 %;
    //                       overflow-x: auto;
    //                     }
    //                     .mat-table__wrapper .mat-table {
    //                       min-width: 1000px;
    //                       width: 100%;
    //                       background: #fff;
    //                       display: block;
    //                     }
    //                     .mat-table__wrapper .mat-table .mat-row {
    //                       transition: padding 0.3s ease;
    //                     }
    //                     mat-footer-row, mat-header-row, mat-row {
    //                       display: flex;
    //                       border-width: 0;
    //                       border-bottom-width: 1px;
    //                       border-style: solid;
    //                       align-items: center;
    //                       box-sizing: border-box;
    //                     }
    //                     mat-header-row {
    //                       min-height: 56px;
    //                     }
    //                     mat-row, mat-header-row, mat-footer-row, th.mat-header-cell, td.mat-cell, td.mat-footer-cell {
    //                       border-bottom-color: rgba(0,0,0,0.12);
    //                     }
    //                     .mat-table__wrapper .mat-table .mat-cell, .mat-table__wrapper .mat-table .mat-footer-cell,
    //                     .mat-table__wrapper .mat-table .mat-header-cell {
    //                       padding-right: 10px;
    //                     }
    //                     mat-cell:first-of-type, mat-footer-cell:first-of-type, mat-header-cell:first-of-type {
    //                       padding-left: 24px;
    //                     }
    //                     .mat-table__wrapper mat-cell, .mat-table__wrapper mat-header-cell {
    //                       min-height: 100%;
    //                     }
    //                     .mat-header-cell {
    //                       color: rgba(0,0,0,0.54);
    //                     }
    //                     .mat-header-cell {
    //                       font-size: 12px;
    //                       font-weight: 500;
    //                     }
    //                     mat-header-cell {
    //                       flex: 1;
    //                       display: flex;
    //                       align-items: center;
    //                       overflow: hidden;
    //                       word-wrap: break-word;
    //                       min-height: inherit;
    //                     }
    //                     .mat-cell, .mat-footer-cell {
    //                       color: rgba(0,0,0,0.87);
    //                     }
    //                     .mat-cell, .mat-footer-cell {
    //                       font-size: 14px;
    //                     }
    //                     mat-cell, mat-footer-cell, mat-header-cell {
    //                       flex: 1;
    //                       display: flex;
    //                       align-items: center;
    //                       overflow: hidden;
    //                       word-wrap: break-word;
    //                       min-height: inherit;
    //                     }
    //                     mat-footer-row, mat-row {
    //                       min-height: 48px;
    //                     }
    //                     mat-row, mat-header-row, mat-footer-row, th.mat-header-cell, td.mat-cell, td.mat-footer-cell {
    //                       border-bottom-color: rgba(0,0,0,0.12);
    //                     }
    //                     .mat-table thead, .mat-table tbody, .mat-table tfoot, mat-header-row, mat-row, mat-footer-row,
    //                     [mat-header-row], [mat-row], [mat-footer-row], .mat-table-sticky {
    //                       background: inherit;
    //                     }
    //                   </style>
    //                 </head>
    //               <body>`;
    // const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(html + printContent.innerHTML + '</body></html>');
    // WindowPrt.document.close();
    // WindowPrt.focus();
    // WindowPrt.print();
    // WindowPrt.close();
  }

  selectRow(row) {
    row['selection'] = this.placeselection;
    const dialogRef = this.dialog.open(FinancialReportDetailsComponent, { data: { row } });
  }

  DownloadXLX() {
    const link = document.createElement('a');
    link.target = '_blank';
    if (this.placeselection === 'user') {
      link.href = ApiUrlService.URL + 'export_user_finance_xlsreport';
    } else if (this.placeselection === 'family') {
      link.href = ApiUrlService.URL + 'export_family_finance_xlsreport';
    } else if (this.placeselection === 'event') {
      link.href = ApiUrlService.URL + 'export_event_finance_xlsreport';
    } else if (this.placeselection === 'donation') {
      link.href = ApiUrlService.URL + 'export_user_finance_xlsreport&queryParams=' + JSON.stringify(this.filterConfiguration('', '', ''));
    }
    link.setAttribute('visibility', 'hidden');
    link.click();
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
