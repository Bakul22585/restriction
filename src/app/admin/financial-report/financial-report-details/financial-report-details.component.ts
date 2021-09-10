import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { QueryParamsModel } from '../../../core/models/query-params.model';

import { UsersDataSource } from '../../../core/users/models/data-source/users.datasource';
import { UsersService } from '../../../core/users/services/users.service';
import { ApiUrlService } from '../../../core/services/api-url.service';

@Component({
  selector: 'app-financial-report-details',
  templateUrl: './financial-report-details.component.html',
  styleUrls: ['./financial-report-details.component.css']
})
export class FinancialReportDetailsComponent implements OnInit {

  dataSource: UsersDataSource;
  // tslint:disable-next-line:max-line-length
  displayedColumns = ['serial_id', 'first_name', 'last_name', 'event_name' , 'phone_no', 'donation', 'village_id', 'role_id', 'area_id'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  row: any = [];
  title = '';
  DonationUserData: any = [];
  SerialNumber = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UsersService,
    public _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.row = this.data.row;
    console.log(this.row);
    if (this.row.selection === 'user') {
      this.title = this.row.first_name + ' ' + this.row.last_name;
      this.displayedColumns = ['serial_id', 'event_name', 'desc', 'handler_name', 'place', 'actual_paid', 'remaining_amount'];
    } else if (this.row.selection === 'event') {
      this.title = this.row.event_name + ' ' + this.row.place;
      // tslint:disable-next-line:max-line-length
      this.displayedColumns = ['serial_id', 'first_name', 'last_name', 'phone_no', 'actual_paid', 'remaining_amount', 'village_id', 'role_id', 'area_id'];
    } else if (this.row.selection === 'family') {
      this.title = this.row.first_name + ' ' + this.row.last_name;
      this.displayedColumns = ['serial_id', 'event_name', 'desc', 'handler_name', 'first_name', 'place', 'actual_paid', 'remaining_amount'];
    } else if (this.row.selection === 'donation') {
      this.title = this.row.first_name + ' ' + this.row.last_name;
      this.displayedColumns = ['serial_id', 'event_name', 'desc', 'handler_name', 'place', 'actual_paid', 'remaining_amount'];
    }

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.loadReportList();
      })
    ).subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration());
    this.dataSource = new UsersDataSource(this.userService);
    this.dataSource.loadUserDetailsFinancialReport(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      // console.log(res);
      this.DonationUserData = res[0];
      this._ref.detectChanges();
    });
  }

  loadReportList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  filterConfiguration(): any {
    const filter: any = {};
    if (this.row.selection === 'user' || this.row.selection === 'donation') {
      filter.user_id = this.row.id;
    } else if (this.row.selection === 'family') {
      filter.main_member_id = this.row.id;
    } else if (this.row.selection === 'event') {
      filter.event_id = this.row.event_id;
    }

    return filter;
  }

  ReportPrint() {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ApiUrlService.URL + 'export_user_donation_details_pdf_report&queryParams=' + JSON.stringify(this.filterConfiguration());
    link.setAttribute('visibility', 'hidden');
    link.click();
    // const printContent = document.getElementById('PersonalPrintReport');
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

  PersonalDownloadXLX() {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ApiUrlService.URL + 'export_user_donation_details_report&queryParams=' + JSON.stringify(this.filterConfiguration());
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
