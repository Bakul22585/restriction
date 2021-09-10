import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

import { LayoutUtilsVillagesService, MessageType } from 'src/app/core/villages/utils/layout-utils-villages.service';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { AttendanceService } from '../../core/attendance/services/attendance.service';
import { AttendanceDataSource } from '../../core/attendance/models/data-source/attendance.datasource';
import { UsersDataSource } from '../../core/users/models/data-source/users.datasource';
import { UsersService } from '../../core/users/services/users.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  EventData: any = [];
  ActiveEventId = 0;
  ActiveEventName = '';
  Searchevent = '';
  SerialNumber = 1;
  Invite = '0';
  Attend = '0';

  dataSource: AttendanceDataSource;
  displayedColumns = [
    'serial_id',
    'first_name',
    'last_name',
    'phone_no',
    'area_id',
    'village_id',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public attendanceService: AttendanceService,
    public _ref: ChangeDetectorRef,
    public userService: UsersService,
  ) { }

  ngOnInit() {
    this.attendanceService.GetEvent().subscribe(res => {
      this.EventData = res['data'];
      if (this.EventData.length > 0) {
        this.SetActive(this.EventData[0]);
      }
      this._ref.detectChanges();
    });

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadUserAttentionList();
        })
      )
      .subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(',', '', ''));
    this.dataSource = new AttendanceDataSource(this.attendanceService);

    this.dataSource.GetEventAttentionUserData(queryParams);
    // this.dataSource.entitySubject.subscribe(res => (this.villagesResult = res));
  }

  loadUserAttentionList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration('', '', ''),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.GetEventAttentionUserData(queryParams);
  }

  filterConfiguration(place, placeId, type): any {
    const filter: any = {};

    filter.event_id = this.ActiveEventId;

    return filter;
  }

  SetActive(event) {
    this.ActiveEventId = event.id;
    this.ActiveEventName = event.event_name;
    this.loadUserAttentionList();
    this.attendanceService.GetEventAttentionCount(event.id).subscribe(res => {
      this.Invite = res['event_invite'];
      this.Attend = res['event_attention'];
      this._ref.detectChanges();
    });
  }

  SearchEvent(event) {
    this.attendanceService.GetSearchEvent(event).subscribe(res => {
      this.EventData = res['data'];
      this._ref.detectChanges();
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
