import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
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
  selector: 'app-fund-preview',
  templateUrl: './fund-preview.component.html',
  styleUrls: ['./fund-preview.component.css']
})
export class FundPreviewComponent implements OnInit {

  hasFormErrors = false;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['serial_id', 'paid_amount', 'paid_by', 'paid_datetime', 'cheque_clearance_date', 'cheque_no', 'status', 'actions'];
  dataSource: FundsDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fundsResult: FundpayModel[] = [];
  fund: FundpayModel;
  allfundpay: any = [];
  Mainfund: FundModel;
  UserData: any = [];
  DonationUserData: any = [];
  SerialNumber = 1;

  constructor(
    private fundsService: FundsService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FundPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsUsersService,
    public historyService: HistorysService
  ) { }

  ngOnInit() {
    this.Mainfund = this.data.fund;
    this.fund = this.data.fund;
    this.UserData = JSON.parse(sessionStorage.getItem('user_data'))._value;
    // console.log(this.fund);
    const queryParams = new QueryParamsModel(0);
    this.dataSource = new FundsDataSource(this.fundsService);
    // First load
    this.dataSource.loadFundpay(queryParams, this.fund.id);
    this.dataSource.entitySubject.subscribe(res => {
      this.fundsResult = res;
      this.DonationUserData = res[0];
    });
  }

  loadFundsList() {
    const queryParams = new QueryParamsModel(0);
    this.dataSource.loadFundpay(queryParams, this.fund.id);
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

  ClearCheque(user) {
    const _title: string = this.translate.instant('FUND.CONFIRM_FUND_SIMPLE.TITLE');
    const _description: string = this.translate.instant('FUND.CONFIRM_FUND_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('FUND.CONFIRM_FUND_SIMPLE.WAIT_DESCRIPTION');
    const _confirmMessage = this.translate.instant('FUND.CONFIRM_FUND_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.confirmElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(confirm => {
      if (!confirm) {
        this.loadFundsList();
        return;
      }
      this.fundsService.CheckFunpayStatus(user.fund_id).subscribe(res => {
        this.allfundpay = res['data'];
        const _fundpay = new FundpayModel();
        _fundpay.id = user.id;
        _fundpay.fund_id = user.fund_id;
        _fundpay.user_id = user.user_id;
        _fundpay.paid_amount = user.paid_amount;
        _fundpay.paid_datetime = user.paid_datetime;
        _fundpay.paid_by = user.paid_by;
        _fundpay.status = 1;
        _fundpay.cheque_clearance_date = user.cheque_clearance_date;
        _fundpay.cheque_no = user.cheque_no;
        // _fundpay.photo = user.photo;
        // console.log(_fundpay);
        this.fundsService.updateFundpay(_fundpay).subscribe(payres => {
          // if (this.allfundpay.length === 1) {
          const _fund = new FundModel();
          _fund.id = this.Mainfund.id;

          let remaining = 0;
          let paidamount = 0;
          remaining = Number(this.Mainfund.remaining_amount) - Number(user.paid_amount);
          paidamount = Number(this.Mainfund.paid_amount) + Number(user.paid_amount);

          _fund.event_id = this.Mainfund.event_id;
          _fund.user_id = this.Mainfund.user_id;
          _fund.purpose = this.Mainfund.purpose;
          _fund.actual_amount = this.Mainfund.actual_amount;
          _fund.is_installment_available = this.Mainfund.is_installment_available;
          _fund.initial_paid_amount = this.Mainfund.initial_paid_amount;
          _fund.paid_amount = paidamount;
          _fund.month_duration = this.Mainfund.month_duration;
          _fund.paid_end_date = this.Mainfund.paid_end_date;
          _fund.payent_by = this.Mainfund.payent_by;
          _fund.cheque_clearance_date = this.Mainfund.cheque_clearance_date;
          _fund.cheque_no = this.Mainfund.cheque_no;
          _fund.paymentmethod = this.Mainfund.paymentmethod;
          _fund.status = remaining > 0 ? 0 : 1;
          _fund.remaining_amount = remaining;
          _fund.backend_paid_amount = this.Mainfund.backend_paid_amount;
          _fund.backend_remaining_amount = this.Mainfund.backend_remaining_amount;
          _fund.cheque_clear = 1;
          // console.log(_fund);
          this.fundsService.updateFund(_fund).subscribe(responce => {
            this.loadFundsList();
          });
          // }
          this.loadFundsList();
        });

        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Fund';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username +
          ' was approve cheque fund amount ' + user.paid_amount + ' for ' + this.Mainfund.event_id + ' cheque no ' + user.cheque_no + '.';
        _history.action = 'Update';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
      });
    });
  }

  deleteFund(_item: FundpayModel) {
    const _title: string = this.translate.instant('FUND.DELETE_FUND_SIMPLE.TITLE');
    const _description: string = this.translate.instant('FUND.DELETE_FUND_SIMPLE.DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('FUND.DELETE_FUND_SIMPLE.WAIT_DESCRIPTION');
    const _deleteMessage = this.translate.instant('FUND.DELETE_FUND_SIMPLE.MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      const obj = {};
      obj['id'] = _item.id;
      obj['fund_id'] = this.fund.id;
      obj['user_id'] = _item.user_id;
      this.fundsService.deleteFundpay(obj).subscribe(() => {
        let backendremaining = 0;
        let backendpaidamount = 0;
        backendremaining = Number(this.Mainfund.backend_remaining_amount) + Number(_item.paid_amount);
        backendpaidamount = Number(this.Mainfund.backend_paid_amount) - Number(_item.paid_amount);

        const _fund = new FundModel();
        _fund.id = this.Mainfund.id;
        _fund.event_id = this.Mainfund.event_id;
        _fund.user_id = this.Mainfund.user_id;
        _fund.purpose = this.Mainfund.purpose;
        _fund.actual_amount = this.Mainfund.actual_amount;
        _fund.is_installment_available = this.Mainfund.is_installment_available;
        _fund.initial_paid_amount = this.Mainfund.initial_paid_amount;
        _fund.paid_amount = this.Mainfund.paid_amount;
        _fund.month_duration = this.Mainfund.month_duration;
        _fund.paid_end_date = this.Mainfund.paid_end_date;
        _fund.payent_by = this.Mainfund.payent_by;
        _fund.cheque_clearance_date = this.Mainfund.cheque_clearance_date;
        _fund.cheque_no = this.Mainfund.cheque_no;
        _fund.paymentmethod = this.Mainfund.paymentmethod;
        _fund.status = this.Mainfund.remaining_amount > 0 ? 0 : 1;
        _fund.remaining_amount = this.Mainfund.remaining_amount;
        _fund.backend_remaining_amount = backendremaining;
        _fund.backend_paid_amount = backendpaidamount;
        _fund.cheque_clear = 0;

        this.fundsService.updateFund(_fund).subscribe(responce => {
          this.loadFundsList();
        });
        /* const _history = new HistoryModel();
        _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
        _history.module = 'Fund';
        _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username +
      ' was reject cheque fund amount ' + _item.paid_amount + ' for ' + this.Mainfund.event_id + ' and cheque no ' + _item.cheque_no + '.';
        _history.action = 'Delete';
        _history.created_date = new Date();
        this.historyService.createHistory(_history).subscribe(responce => {
        }); */
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadFundsList();
      });
    });
  }

  ReceiptPrint() {
    const printContent = document.getElementById('printreceipt');
    const html = `<html>
                    <head>
                      <style>
                        table {
                          border-collapse: collapse;
                          width: 100%;
                        }
                        .mat-table {
                          font-family: Roboto, "Helvetica Neue", sans-serif;
                          background: #fff;
                          border-spacing: 0;
                        }
                        tr.mat-header-row {
                          height: 56px;
                        }
                        td.mat-cell:first-of-type, td.mat-footer-cell:first-of-type, th.mat-header-cell:first-of-type {
                          padding-left: 24px;
                        }
                        td.mat-cell, td.mat-footer-cell, th.mat-header-cell {
                          padding: 0;
                          border-bottom-width: 1px;
                          border-bottom-style: solid;
                        }
                        th.mat-header-cell {
                          text-align: left;
                        }
                        mat-row, mat-header-row, mat-footer-row, th.mat-header-cell, td.mat-cell, td.mat-footer-cell {
                          border-bottom-color: rgba(0,0,0,0.12);
                        }
                        .mat-header-cell {
                          color: rgba(0,0,0,0.54);
                        }
                        .mat-header-cell {
                          font-size: 12px;
                          font-weight: 500;
                        }
                        tr.mat-footer-row, tr.mat-row {
                          height: 48px;
                        }
                        td.mat-cell:first-of-type, td.mat-footer-cell:first-of-type, th.mat-header-cell:first-of-type {
                          padding-left: 24px;
                        }
                        td.mat-cell, td.mat-footer-cell, th.mat-header-cell {
                          padding: 0;
                          border-bottom-width: 1px;
                          border-bottom-style: solid;
                        }
                        mat-row, mat-header-row, mat-footer-row, th.mat-header-cell, td.mat-cell, td.mat-footer-cell {
                          border-bottom-color: rgba(0,0,0,0.12);
                        }
                        .mat-cell, .mat-footer-cell {
                          color: rgba(0,0,0,0.87);
                        }
                        .mat-cell, .mat-footer-cell {
                          font-size: 14px;
                        }
                        .margin-bottom {
                          margin-bottom: 5px;
                        }
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
                        th.mat-header-cell:last-of-type, td.mat-cell:last-of-type {
                          display: none;
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
