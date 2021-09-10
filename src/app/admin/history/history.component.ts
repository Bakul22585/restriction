import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { LayoutUtilsRolesService, MessageType } from 'src/app/core/roles/utils/layout-utils-roles.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { HistorysDataSource } from '../../core/historys/models/data-source/historys.datasource';
import { HistoryModel } from './../../core/historys/models/history.model';
import { HistorysService } from './../../core/historys/services/historys.service';
import { ApiUrlService } from '../../core/services/api-url.service';



@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public model: any = HistoryModel;
  hasFormErrors: boolean = false;
  errors: any = [];

  dataSource: HistorysDataSource;
  displayedColumns = ['serial_id', 'user_id', 'module', 'description', 'action', 'added_on'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  // Selection
  selection = new SelectionModel<HistoryModel>(true, []);
  historysResult: HistoryModel[] = [];
  SerialNumber = 1;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsRolesService,
    private translate: TranslateService,
    private historyService: HistorysService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // If the role changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
     - when a pagination role occurs => this.paginator.page
     - when a sort role occurs => this.sort.sortChange
     **/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadHistorysList();
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
          this.loadHistorysList();
        })
      )
      .subscribe();

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new HistorysDataSource(this.historyService);
    // First load
    this.dataSource.loadHistorys(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.historysResult = res));
  }

  loadHistorysList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadHistorys(queryParams);
    this.selection.clear();
  }

  /** FILTRATION */
  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (!isGeneralSearch) {
      return filter;
    }

    if (this.filterStatus === 'User Name') {
      filter.user_name = searchText;
    } else if (this.filterStatus === 'Module') {
      filter.module = searchText;
    } else if (this.filterStatus === 'Description') {
      filter.description = searchText;
    } else if (this.filterStatus === 'Action') {
      filter.action = searchText;
    } else {
      filter.all = searchText;
    }

    return filter;
  }

  ReportPrint() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ApiUrlService.URL + 'export_history_pdf&queryParams=' + JSON.stringify(queryParams);
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
    //                     .main_member {
    //                       background-color: #d3d3d3;
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
    //                     .mat-sort-header-container {
    //                         display: flex;
    //                         cursor: pointer;
    //                         align-items: center;
    //                     }
    //                     button, html [type="button"], [type="reset"], [type="submit"] {
    //                         -webkit-appearance: button;
    //                     }
    //                     .mat-sort-header-button {
    //                         border: none;
    //                         background: 0 0;
    //                         display: flex;
    //                         align-items: center;
    //                         padding: 0;
    //                         cursor: inherit;
    //                         outline: 0;
    //                         font: inherit;
    //                         color: currentColor;
    //                     }
    //                     .mat-sort-header-arrow, [dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow {
    //                         margin: 0 0 0 6px;
    //                     }
    //                     .mat-sort-header-arrow {
    //                         height: 12px;
    //                         width: 12px;
    //                         min-width: 12px;
    //                         position: relative;
    //                         display: flex;
    //                         opacity: 0;
    //                     }
    //                     .mat-sort-header-arrow {
    //                         color: #757575;
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

  DownloadXLX() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ApiUrlService.URL + 'export_history_xlsreport&queryParams=' + JSON.stringify(queryParams);
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
