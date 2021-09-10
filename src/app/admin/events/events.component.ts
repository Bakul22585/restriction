import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { SmsModel } from '../../core/sms/models/sms.model';
import { SmsDataSource } from '../../core/sms/models/data-source/sms.datasource';
import { SmsService } from '../../core/sms/services/sms.service';
import { ViewInvitiesComponent } from './view-invities/view-invities.component';
import { PreviewEventImageComponent } from './preview-event-image/preview-event-image.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  dataSource: SmsDataSource;
  displayedColumns = [
    'serial_id',
    'name',
    'handler_name',
    'start_datetime',
    'place',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  // Selection
  selection = new SelectionModel<SmsModel>(true, []);
  usersResult: SmsModel[] = [];
  SerialNumber = 1;

  constructor(
    public smsService: SmsService,
    public router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    localStorage.removeItem('EventData');
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadFundsList();
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
          this.loadFundsList();
        })
      )
      .subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new SmsDataSource(this.smsService);
    // First load
    this.dataSource.loadEvents(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.usersResult = res;
    });
  }

  loadFundsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadEvents(queryParams);
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

    filter.all = searchText;

    return filter;
  }

  addEvent() {
    this.router.navigate(['/admin/AddEditEvent']);
  }

  EventEdit(EventData) {
    localStorage.setItem('EventData', JSON.stringify(EventData));
    this.router.navigate(['/admin/AddEditEvent']);
  }

  EventDelete(EventData) {
    const obj = {};
    obj['id'] = EventData.id;
    obj['user_id'] = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
    this.smsService.deleteEvent(obj).subscribe(res => {
      this.loadFundsList();
    });
  }

  viewInvities(EventData) {
    const dialogRef = this.dialog.open(ViewInvitiesComponent, { data: { EventData } });
    dialogRef.afterClosed().subscribe(res => {
      this.loadFundsList();
      if (!res) {
        return;
      }
    });
  }

  viewImage(EventData) {
    const dialogRef = this.dialog.open(PreviewEventImageComponent, { data: { EventData } });
    dialogRef.afterClosed().subscribe(res => {
      this.loadFundsList();
      if (!res) {
        return;
      }
    });
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
