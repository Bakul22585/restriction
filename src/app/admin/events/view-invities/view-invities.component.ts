import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatSnackBar,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTableDataSource
} from '@angular/material';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { SmsDataSource } from '../../../core/sms/models/data-source/sms.datasource';
import { SmsService } from '../../../core/sms/services/sms.service';

@Component({
  selector: 'app-view-invities',
  templateUrl: './view-invities.component.html',
  styleUrls: ['./view-invities.component.css']
})
export class ViewInvitiesComponent implements OnInit {

  dataSource: SmsDataSource;
  displayedColumns: string[] = ['serial_id', 'first_name', 'address', 'phone_no', 'village_id', 'area_id', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  EventData: any = [];
  UserData: any = [];
  SerialNumber = 1;

  constructor(
		public dialogRef: MatDialogRef<ViewInvitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private smsService: SmsService
	) { }

  ngOnInit() {
    this.EventData = this.data.EventData;
    this.UserData = JSON.parse(sessionStorage.getItem('user_data'))._value;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).pipe(
        tap(() => {
          this.loadInviteUsersList();
        })
      ).subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new SmsDataSource(this.smsService);
    // First load
    this.dataSource.GetEventInviteUserList(queryParams);
  }

  loadInviteUsersList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.GetEventInviteUserList(queryParams);
  }

  /** FILTRATION */
  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    filter.id = this.EventData.id;

    return filter;
  }

  deleteUser(user) {
    const obj = {};
    obj['id'] = this.EventData.id;
    obj['invite_user_id'] = user.id;
    obj['user_id'] = this.UserData.id;

    this.smsService.DeleteEventInviteUser(obj).subscribe(res => {
      if (res['success'] === '1') {
        this.loadInviteUsersList();
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
