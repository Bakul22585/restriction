import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';

import { FundsDataSource } from 'src/app/core/funds/models/data-source/funds.datasource';
import { FundpayModel } from 'src/app/core/funds/models/fundpay.model';
import { FundModel } from '../../../core/funds/models/fund.model';
import { FundsService } from 'src/app/core/funds/services';
import { HistoryModel } from '../../../core/historys/models/history.model';
import { HistorysService } from '../../../core/historys/services/historys.service';

@Component({
  selector: 'app-fund-receipt',
  templateUrl: './fund-receipt.component.html',
  styleUrls: ['./fund-receipt.component.css']
})
export class FundReceiptComponent implements OnInit {

  hasFormErrors = false;
  dataSource: FundsDataSource;
  displayedColumns: string[] = [
  'event_name',
  'user_name',
  'purpose',
  'actual_amount',
  'pay_amount',
  'paid_amount',
  'remaining_amount',
  'payment_by',
  'paid_end_date',
  'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  fundsResult: FundpayModel[] = [];
  fund: any = [];
  allfundpay: any = [];
  Mainfund: FundModel;
  UserData: any = [];
  DonationUserData: any = [];

  constructor(
    private fundsService: FundsService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FundReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsUsersService,
    public historyService: HistorysService,
    public _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.Mainfund = this.data.fund;
    console.log(this.data);
    this.fund = this.data.rese.data;
    this.UserData = JSON.parse(sessionStorage.getItem('user_data'))._value;
    // console.log(this.fund);
    const queryParams = new QueryParamsModel(0);
    this.dataSource = new FundsDataSource(this.fundsService);
    // First load
    this.dataSource.loadPrintFundpay(queryParams, this.fund.id);
    this.dataSource.entitySubject.subscribe(res => {
      // console.log(res);
      this.fundsResult = res;
      this.DonationUserData = res[0];
      this._ref.detectChanges();
    });
  }

  loadFundsList() {
    const queryParams = new QueryParamsModel(0);
    this.dataSource.loadPrintFundpay(queryParams, this.fund.id);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  getItemPayentByTypeString(status): string {
    // const type = Number(status);
    switch (status) {
      case '1':
        return 'Cash';
      case '2':
        return 'Cheque';
    }
    return '';
  }

  ReceiptPrint() {
    const printContent = document.getElementById('ReceiptPrint');
    const html = `<html>
                    <head>
                      <style>
                        .mat-table__wrapper {
                          width: 100 %;
                          overflow-x: auto;
                        }
                        .mat-table__wrapper .mat-table {
                          min-width: 1000px;
                          width: 100%;
                          background: #fff;
                          display: block;
                          font-family: Roboto, "Helvetica Neue", sans-serif;
                        }
                        .mat-table__wrapper .mat-table .mat-row {
                          transition: padding 0.3s ease;
                        }
                        mat-footer-row, mat-header-row, mat-row {
                          display: flex;
                          border-width: 0;
                          border-bottom-width: 1px;
                          border-style: solid;
                          align-items: center;
                          box-sizing: border-box;
                        }
                        mat-header-row {
                          min-height: 56px;
                        }
                        mat-row, mat-header-row, mat-footer-row, th.mat-header-cell, td.mat-cell, td.mat-footer-cell {
                          border-bottom-color: rgba(0,0,0,0.12);
                        }
                        .mat-table thead, .mat-table tbody, .mat-table tfoot, mat-header-row, mat-row, mat-footer-row,
                        [mat-header-row], [mat-row], [mat-footer-row], .mat-table-sticky {
                          background: inherit;
                        }
                        .mat-table__wrapper .mat-table .mat-cell, .mat-table__wrapper .mat-table .mat-footer-cell,
                        .mat-table__wrapper .mat-table .mat-header-cell {
                          padding-right: 10px;
                        }
                        mat-cell:first-of-type, mat-footer-cell:first-of-type, mat-header-cell:first-of-type {
                          padding-left: 24px;
                        }
                        .mat-table__wrapper mat-cell, .mat-table__wrapper mat-header-cell {
                          min-height: 100%;
                        }
                        .mat-header-cell {
                          color: rgba(0,0,0,0.54);
                        }
                        .mat-header-cell {
                          font-size: 12px;
                          font-weight: 500;
                        }
                        mat-header-cell {
                          flex: 1;
                          display: flex;
                          align-items: center;
                          overflow: hidden;
                          word-wrap: break-word;
                          min-height: inherit;
                        }
                        .mat-sort-header-container {
                            display: flex;
                            cursor: pointer;
                            align-items: center;
                        }
                        button, html [type="button"], [type="reset"], [type="submit"] {
                            -webkit-appearance: button;
                        }
                        .mat-sort-header-button {
                            border: none;
                            background: 0 0;
                            display: flex;
                            align-items: center;
                            padding: 0;
                            cursor: inherit;
                            outline: 0;
                            font: inherit;
                            color: currentColor;
                        }
                        .mat-sort-header-arrow, [dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow {
                            margin: 0 0 0 6px;
                        }
                        .mat-sort-header-arrow {
                            height: 12px;
                            width: 12px;
                            min-width: 12px;
                            position: relative;
                            display: flex;
                            opacity: 0;
                        }
                        .mat-sort-header-arrow {
                            color: #757575;
                        }
                        .mat-cell, .mat-footer-cell {
                          color: rgba(0,0,0,0.87);
                        }
                        .mat-cell, .mat-footer-cell {
                          font-size: 14px;
                        }
                        mat-cell, mat-footer-cell, mat-header-cell {
                          flex: 1;
                          display: flex;
                          align-items: center;
                          overflow: hidden;
                          word-wrap: break-word;
                          min-height: inherit;
                        }
                        mat-footer-row, mat-row {
                          min-height: 48px;
                        }
                        mat-row, mat-header-row, mat-footer-row, th.mat-header-cell, td.mat-cell, td.mat-footer-cell {
                          border-bottom-color: rgba(0,0,0,0.12);
                        }
                        .mat-table thead, .mat-table tbody, .mat-table tfoot, mat-header-row, mat-row, mat-footer-row,
                        [mat-header-row], [mat-row], [mat-footer-row], .mat-table-sticky {
                          background: inherit;
                        }
                        .red {
                            color: red;
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
}
