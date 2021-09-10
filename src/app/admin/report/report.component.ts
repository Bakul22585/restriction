import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as _moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

import { LayoutUtilsVillagesService, MessageType } from 'src/app/core/villages/utils/layout-utils-villages.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { VillagesDataSource } from 'src/app/core/villages/models/data-source/villages.datasource';
import { VillageModel } from 'src/app/core/villages/models/village.model';
import { VillagesService } from 'src/app/core/villages/services';
import { HistoryModel } from '../../core/historys/models/history.model';
import { HistorysService } from '../../core/historys/services/historys.service';
import { AreasService } from '../../core/areas/services/areas.service';
import { UserModel } from '../../core/users/models/user.model';
import { UsersDataSource } from '../../core/users/models/data-source/users.datasource';
import { UsersService } from '../../core/users/services/users.service';
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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ReportComponent implements OnInit {

  public model: any = VillageModel;
  public villageId = 0;
  villageForm: FormGroup;
  hasFormErrors = false;
  isMobile = false;
  errors: any = [];

  dataSource: UsersDataSource;
  displayedColumns = [
    'serial_id',
    'first_name',
    'last_name',
    'relation',
    'phone_no',
    'village_id',
    'role_id',
    'area_id'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Selection
  selection = new SelectionModel<VillageModel>(true, []);
  villagesResult: VillageModel[] = [];

  villages: any = [];
  selectedvillage: any;
  selectedarea: any;
  area: any = [];
  placeselection = '';
  fromdate = '';
  todate = new Date();
  ReportType = '';
  minage: number;
  maxage: number;
  SerialNumber = 1;
  surname = '';

  public villageMultiFilterCtrl: FormControl = new FormControl();

  constructor(
    private villagesService: VillagesService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsVillagesService,
    private translate: TranslateService,
    private villageService: VillagesService,
    private fb: FormBuilder,
    public historyService: HistorysService,
    public areaService: AreasService,
    public userService: UsersService,
    public _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {

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

    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(',', '', ''));
    this.dataSource = new UsersDataSource(this.userService);
    // First load
    this.dataSource.loadUsersVillagewise(queryParams, '0');
    this.dataSource.entitySubject.subscribe(res => (this.villagesResult = res));

    this.villageService.getAllVillages().subscribe(res => {
      this.villages = res;
    });
    this.areaService.getAllAreas().subscribe(res => {
      this.area = res;
    });
  }

  onSubmit() {
    // console.log(this.placeselection, this.selectedvillage, this.selectedarea, this.fromdate, this.todate);
    if (this.placeselection === 'Village') {
      if (this.ReportType === 'family') {
        const queryParamsAll = new QueryParamsModel(
          this.filterConfiguration('village', this.selectedvillage, 0),
          this.sort.direction,
          this.sort.active,
          this.paginator.pageIndex,
          this.paginator.pageSize
        );
        this.dataSource.loadUsersVillagewise(queryParamsAll, this.selectedvillage);
        this.dataSource.entitySubject.subscribe(res => {
          window.scrollTo(550, 550);
          this._ref.detectChanges();
        });
      } else {
        const queryParamsMain = new QueryParamsModel(
          this.filterConfiguration('village', this.selectedvillage, 1),
          this.sort.direction,
          this.sort.active,
          this.paginator.pageIndex,
          this.paginator.pageSize
        );
        this.dataSource.findUsersvillagewiseMain(queryParamsMain, this.selectedvillage, 1);
        this.dataSource.entitySubject.subscribe(res => {
          window.scrollTo(550, 550);
          this._ref.detectChanges();
        });
        this._ref.detectChanges();
      }
    } else if (this.placeselection === 'Area') {
      if (this.ReportType === 'family') {
        const queryParamsAll = new QueryParamsModel(
          this.filterConfiguration('area', this.selectedarea, 0),
          this.sort.direction,
          this.sort.active,
          this.paginator.pageIndex,
          this.paginator.pageSize
        );
        this.dataSource.loadUsersAreawise(queryParamsAll, this.selectedarea);
        this.dataSource.entitySubject.subscribe(res => {
          window.scrollTo(550, 550);
          this._ref.detectChanges();
        });
        this._ref.detectChanges();
      } else {
        const queryParamsMain = new QueryParamsModel(
          this.filterConfiguration('area', this.selectedarea, 1),
          this.sort.direction,
          this.sort.active,
          this.paginator.pageIndex,
          this.paginator.pageSize
        );
        this.dataSource.findUsersareawiseMain(queryParamsMain, this.selectedarea, 1);
        this.dataSource.entitySubject.subscribe(res => {
          window.scrollTo(550, 550);
          this._ref.detectChanges();
        });
        this._ref.detectChanges();
      }
    }
  }

  loadVillagesList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration('', '', ''),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadUsersVillagewise(queryParams, 'rajkot');
    this.selection.clear();
  }

  /** FILTRATION */
  filterConfiguration(place, placeId, type): any {
    const filter: any = {};
    if (this.placeselection === 'Area') {
      filter.area_id = this.selectedarea;
    } else {
      filter.village_id = this.selectedvillage;
    }

    if (this.ReportType === 'age') {
      filter.min_age = this.minage;
      filter.max_age = this.maxage;
    }

    if (this.ReportType === 'main') {
      filter.main = type;
    }

    if (this.surname !== '') {
      filter.surname = this.surname;
    }

    return filter;
  }

  resetvalue() {
    this.selectedvillage = '0';
    this.selectedarea = '0';
    this.surname = '';
    const queryParamsAll = new QueryParamsModel(
      this.filterConfiguration('', '', ''),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadUsersVillagewise(queryParamsAll, '0');
  }

  ReportPrint() {
    const main_member = (this.ReportType === 'family') ? 0 : 1;
    const link = document.createElement('a');
    link.target = '_blank';
    // tslint:disable-next-line:max-line-length
    link.href = ApiUrlService.URL + 'export_member_pdfreport&queryParams=' + JSON.stringify(this.filterConfiguration(this.placeselection.toLowerCase(), '', main_member));
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  DownloadXLX() {
    const village_family = this.filterConfiguration('village', this.selectedvillage, 0);
    const village = this.filterConfiguration('village', this.selectedvillage, 1);
    const area_family = this.filterConfiguration('area', this.selectedarea, 0);
    const area = this.filterConfiguration('area', this.selectedarea, 1);
    const link = document.createElement('a');
    link.target = '_blank';
    if (this.placeselection === 'Village') {
      if (this.ReportType === 'family') {
        link.href = ApiUrlService.URL + 'export_member_xlxreport&queryParams=' + JSON.stringify(village_family);
      } else {
        link.href = ApiUrlService.URL + 'export_member_xlxreport&queryParams=' + JSON.stringify(village);
      }
    } else if (this.placeselection === 'Area') {
      if (this.ReportType === 'family') {
        link.href = ApiUrlService.URL + 'export_member_xlxreport&queryParams=' + JSON.stringify(area_family);
      } else {
        link.href = ApiUrlService.URL + 'export_member_xlxreport&queryParams=' + JSON.stringify(area);
      }
    } else {
      // tslint:disable-next-line:max-line-length
      link.href = ApiUrlService.URL + 'export_member_xlxreport&queryParams={"filter":{"village_id":""},"sortOrder":"desc","sortField":"","pageNumber":0,"pageSize":10}';
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

  GetSurnameWiseUser(Surname) {
    this.selectedvillage = '';
    this.selectedarea = '';
    const queryParamsAll = new QueryParamsModel(
      this.filterConfiguration('', '', ''),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadUsersVillagewise(queryParamsAll, '0');
    // this.dataSource.entitySubject.subscribe(res => (this.villagesResult = res));
  }

  GetVillage(village) {
    this.selectedvillage = village.toString();
  }

  GetArea(area) {
    this.selectedarea = area.toString();
  }
}
