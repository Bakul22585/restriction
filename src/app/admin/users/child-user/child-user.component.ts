import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QueryParamsModel } from 'src/app/core/models/query-params.model';

import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

import { UsersDataSource } from 'src/app/core/users/models/data-source/users.datasource';
import { UserModel } from 'src/app/core/users/models/user.model';
import { UsersService } from 'src/app/core/users/services';

@Component({
  selector: 'app-child-user',
  templateUrl: './child-user.component.html',
  styleUrls: ['./child-user.component.css']
})
export class ChildUserComponent implements OnInit {

  dataSource: UsersDataSource;
  displayedColumns = ['serial_id', 'first_name', 'relation', 'phone_no', 'area_id'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  MainUser: any = [];
  usersResult: any = [];
  TotalUser = 0;
  SerialNumber = 1;

  constructor(
    private userService: UsersService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ChildUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.MainUser = this.data.User;
    console.log(this.MainUser);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page).pipe(
        tap(() => {
          this.loadUsersList();
        })
      ).subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(false));
    this.dataSource = new UsersDataSource(this.userService);
    // First load
    this.dataSource.loadSubUsers(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.usersResult = res));
    this.dataSource.paginatorTotalSubject.subscribe(res => {
      this.TotalUser = Number(res) + 1;
    });
  }

  loadUsersList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadSubUsers(queryParams);
  }

  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};

    filter.main_member_id = this.MainUser.id;

    return filter;
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
