import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { tap, debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { merge, fromEvent, ReplaySubject, Subject } from 'rxjs';
import * as $ from 'jquery';

import { SmsModel } from '../../core/sms/models/sms.model';
import { UsersService } from '../../core/users/services/users.service';
import { VillagesService } from '../../core/villages/services/villages.service';
import { AreasService } from '../../core/areas/services/areas.service';
import { SmsService } from '../../core/sms/services/sms.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css'],
  providers: [DatePipe]
})
export class SmsComponent implements OnInit {

  userData: any = [];
  AllUser: Array<any> = [];
  AllVillage: Array<any> = [];
  AllArea: Array<any> = [];
  AssignLeft: Array<any> = [];
  AssignRight: Array<any> = [];
  BackAssignRight: Array<any> = [];
  FilterData: Array<any> = [];
  FilterValue = '';

  LeftArrayIndex: any = [];
  RightArrayIndex: any = [];
  smsForm: FormGroup;
  public profile_str: string = '';
  public formate_str: string = '';
  HeadText = 'New Event';
  startdatetime = false;
  enddatetime = false;
  SelecteStartDatetime = '';
  SelecteEndDatetime = '';
  SetEndDateTime = false;
  ShowSMSEditor = false;
  smsContent = `Hello [USER_NAME]<br>You are invited to event [EVENT_NAME] which will be come at [EVENT_PLACE] on [EVENT_DATE]<br>Thanks`;
  SubmitButton = 'Submit';

  public filteredVillageMulti: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  public villageMultiFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();

  constructor(
    public userService: UsersService,
    public villageService: VillagesService,
    public areaService: AreasService,
    public _ref: ChangeDetectorRef,
    private fb: FormBuilder,
    public smsService: SmsService,
    public router: Router,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.createForm();
    this.userData = JSON.parse(sessionStorage.getItem('user_data'))._value;
    if (JSON.parse(localStorage.getItem('EventData')) !== null) {
      this.SubmitButton = 'Save changes';
      this.smsForm.patchValue(JSON.parse(localStorage.getItem('EventData')));
      const data = JSON.parse(localStorage.getItem('EventData'));
      if (data.event_end_datetime !== '') {
        this.SetEndDateTime = true;
      }

      if (data.invite_user !== '' ) {
        this.userService.getInviteUser(data.invite_user).subscribe(res => {
          const InviteUser: any = res;
          InviteUser.forEach(element => {
            this.AssignRight.push(element);
            this.BackAssignRight.push(element);
          });
          this.CheckAssignUser();
        });
      }
    }

    this.userService.getAllUsers().subscribe(res => {
      const data = res;
      data.forEach(element => {
        this.AllUser.push(element);
        this.AssignLeft.push(element);
      });

      if (this.AssignRight.length > 0) {
        for (let index = this.AssignLeft.length - 1; index > -1; index--) {
          if (this.FindAssignLeftUser(this.AssignLeft[index].id) !== undefined) {
            this.AssignLeft.splice(index, 1);
          }
        }
      }
      this._ref.detectChanges();
    });

    // this.villageService.getAllVillages().subscribe(res => {
    //   const data = res;
    //   data.forEach(element => {
    //     this.AllVillage.push(element);
    //   });
    // });

    // this.areaService.getAllAreas().subscribe(res => {
    //   const data = res;
    //   data.forEach(element => {
    //     this.AllArea.push(element);
    //   });
    // });

    this.filteredVillageMulti.next(this.AllVillage.slice());
    this.villageMultiFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterBanksMulti();
    });
  }

  FindAssignLeftUser(id) {
    return this.AssignRight.find(user => user.id === id);
  }
  createForm() {
    this.smsForm = this.fb.group({
      event_name: ['', Validators.required],
      description: ['', Validators.required],
      handler_id: ['', Validators.required],
      profile: ['', Validators.required],
      event_start_datetime: ['', Validators.required],
      event_end_datetime: [''],
      place: ['', Validators.required],
      formate_str: ['', Validators.required],
      sms: [this.smsContent, Validators.required],
    });
  }

  private filterBanksMulti() {
    if (!this.AllVillage) {
      return;
    }
    // get the search keyword
    let search = this.villageMultiFilterCtrl.value;
    if (!search) {
      this.filteredVillageMulti.next(this.AllVillage.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredVillageMulti.next(
      this.AllVillage.filter(village => village.village_name.toLowerCase().indexOf(search) > -1)
    );
    this._ref.detectChanges();
  }

  SetLeftArrayIndex(user) {
    const userData = this.LeftArrayIndex.filter(userid => userid === user);
    if (userData.length === 0) {
      this.LeftArrayIndex.push(user);
    } else {
      for (let index = 0; index < this.LeftArrayIndex.length; index++) {
        if (this.LeftArrayIndex[index] === user) {
          this.LeftArrayIndex.splice(index, 1);
        }
      }
    }
  }

  SetRightArrayIndex(index) {
    const userData = this.RightArrayIndex.filter(user => user === index);
    if (userData.length === 0) {
      this.RightArrayIndex.push(index);
    } else {
      for (let i = 0; i < this.RightArrayIndex.length; i++) {
        if (this.RightArrayIndex[i] === index) {
          this.RightArrayIndex.splice(i, 1);
        }
      }
    }
  }

  MoveRight() {
    // console.log(this.AssignLeft);
    if (this.AssignLeft.length > this.LeftArrayIndex.length) {
      for (let index = 0; index < this.LeftArrayIndex.length; index++) {
        const UserData = this.AssignLeft.filter(UserId => UserId.id === this.LeftArrayIndex[index]);
        this.AssignRight.push(UserData[0]);
        this.BackAssignRight.push(UserData[0]);
        for (let i = this.AssignLeft.length - 1; i >= 0; i--) {
          if (this.AssignLeft[i].id === UserData[0].id) {
            this.AssignLeft.splice(i, 1);
          }
        }
        // this.AssignLeft.splice(this.LeftArrayIndex, 1);
      }
      // this.AssignRight.push(this.AssignLeft[this.LeftArrayIndex]);
      // this.BackAssignRight.push(this.AssignLeft[this.LeftArrayIndex]);
      // this.AssignLeft.splice(this.LeftArrayIndex, 1);
      this.LeftArrayIndex = [];
    }
  }

  MoveLeft() {
    // console.log(this.AssignRight);
    if (this.AssignRight.length > this.RightArrayIndex.length) {
      for (let index = 0; index < this.RightArrayIndex.length; index++) {
        const userData = this.AssignRight.filter(user => user.id === this.RightArrayIndex[index]);
        this.AssignLeft.push(userData[0]);
        for (let i = this.AssignRight.length - 1; i >= 0; i--) {
          if (this.AssignRight[i].id === userData[0].id) {
            this.AssignRight.splice(i, 1);
            this.BackAssignRight.splice(i, 1);
          }
        }
        // this.AssignRight.splice(this.RightArrayIndex, 1);
        // this.BackAssignRight.splice(this.RightArrayIndex, 1);
      }
      // this.AssignLeft.push(this.AssignRight[this.RightArrayIndex]);
      // this.AssignRight.splice(this.RightArrayIndex, 1);
      // this.BackAssignRight.splice(this.RightArrayIndex, 1);
      this.RightArrayIndex = [];
    }
  }

  MoveAllRight() {
    // console.log(this.AssignLeft.length);
    for (let index = this.AssignLeft.length - 1; index >= 0; index--) {
      // console.log(this.AssignLeft[index]);
      this.AssignRight.push(this.AssignLeft[index]);
      this.BackAssignRight.push(this.AssignLeft[index]);
      this.AssignLeft.splice(index, 1);
    }
    this.LeftArrayIndex = [];
  }

  MoveAllLeft() {
    // console.log(this.AssignRight);
    for (let index = this.AssignRight.length - 1; index >= 0; index--) {
      this.AssignLeft.push(this.AssignRight[index]);
      this.AssignRight.splice(index, 1);
      this.BackAssignRight.splice(index, 1);
    }
    this.RightArrayIndex = [];
  }

  GetAreaName(name) {
    const obj = {};
    obj['ids'] = name;
    obj['select_user'] = JSON.stringify(this.AssignRight);
    this.userService.getAreaByName(obj).subscribe(res => {
      const data = res;
      this.AssignLeft = [];
      // this.AssignRight = [];
      data.forEach(element => {
        this.AssignLeft.push(element);
      });
      this._ref.detectChanges();
    });
  }

  GetVillageName(name) {
    if (this.FilterValue === 'village') {
      const obj = {};
      obj['ids'] = name;
      obj['select_user'] = JSON.stringify(this.AssignRight);
      this.userService.getVillageByName(obj).subscribe(res => {
        const data = res;
        this.AssignLeft = [];
        // this.AssignRight = [];
        data.forEach(element => {
          this.AssignLeft.push(element);
        });
        this._ref.detectChanges();
      });
    } else {
      this.GetAreaName(name);
    }
  }

  submit() {
    const constrols = this.smsForm.controls;
    // console.log(constrols);
    const _sms = new SmsModel();
    if (JSON.parse(localStorage.getItem('EventData')) !== null) {
      _sms.id = JSON.parse(localStorage.getItem('EventData')).id;
    }
    // console.log(new Date(this.datePipe.transform(constrols['start_datetime'].value, 'yyyy/MM/dd h:mm:ss a')));
    // return false;
    _sms.user_id = this.userData.id;
    _sms.name = constrols['event_name'].value;
    _sms.desc = constrols['description'].value;
    _sms.handler_name = constrols['handler_id'].value;
    _sms.start_datetime = constrols['event_start_datetime'].value;
    _sms.end_datetime = constrols['event_end_datetime'].value;
    _sms.place = constrols['place'].value;
    _sms.sms = constrols['sms'].value;
    _sms.assign_user = this.AssignRight;
    _sms.profile_pic = this.profile_str;
    _sms.patrika_formate = this.formate_str;
    _sms.is_active = 1;
    /* console.log(constrols);
    console.log(this.AssignLeft); */
    $('body').css({ 'overflow': 'hidden' });
    $('#mainloader').removeAttr('style');
    if (JSON.parse(localStorage.getItem('EventData')) !== null) {
      this.smsService.updateEvent(_sms).subscribe(res => {
        localStorage.removeItem('EventData');
        $('#mainloader').css({ 'display': 'none' });
        $('body').removeAttr('style');
        this.router.navigate(['/admin/events']);
      });
    } else {
      this.smsService.createUser(_sms).subscribe(res => {
        localStorage.removeItem('EventData');
        $('#mainloader').css({ 'display': 'none' });
        $('body').removeAttr('style');
        this.router.navigate(['/admin/events']);
      });
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profile_str = file;
    }
  }

  onFileChangeFormate(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formate_str = file;
    }
  }

  GetFilterValue(data) {
    this.FilterData = [];
    this.FilterValue = data;
    if (data === 'village') {
      this.villageService.getAllVillages().subscribe(res => {
        const resdata: any = res;
        resdata.forEach(element => {
          const obj = {};
          obj['id'] = element.id;
          obj['name'] = element.village_name;
          this.FilterData.push(obj);
        });
      });
    }

    if (data === 'area') {
      this.areaService.getAllAreas().subscribe(res => {
        const resdata: any = res;
        resdata.forEach(element => {
          const obj = {};
          obj['id'] = element.id;
          obj['name'] = element.area_name;
          this.FilterData.push(obj);
        });
      });
    }
  }

  onCustomDateChange(selectdatetime) {
    this.startdatetime = false;
    this.SelecteStartDatetime = formatDate(selectdatetime.value, 'dd/MM/yyyy hh:mm a', 'en-US', '+0530');
    this.smsForm.patchValue({event_start_datetime: this.SelecteStartDatetime});
  }

  onEndDateChange(selectdatetime) {
    this.enddatetime = false;
    this.SelecteEndDatetime = formatDate(selectdatetime.value, 'dd/MM/yyyy hh:mm a', 'en-US', '+0530');
    this.smsForm.patchValue({event_end_datetime: this.SelecteEndDatetime});
  }

  SetEndDatTimeView() {
    this.SetEndDateTime = true;
    this.enddatetime = true;
  }

  OnCloseDateTimePicker() {
    this.startdatetime = false;
  }

  SearchAssignLeftUser(User) {
    const obj = {};
    obj['name'] = User.target.value;
    obj['assign_user'] = this.AssignRight;
    this.smsService.SerachUser(obj).subscribe(res => {
      const data: any = res;
      this.AssignLeft = [];
      data.forEach(element => {
        this.AssignLeft.push(element);
      });
      this._ref.detectChanges();
    });
    this.AssignLeft.filter(user => user.first_name === User.target.value);
    // this.FindAssignLeftUser(User.target.value);
  }

  SearchAssignRightUser(User) {
    this.AssignRight = this.BackAssignRight;
    if (User.target.value !== '') {
      this.AssignRight = this.AssignRight.filter(user => user.first_name === User.target.value);
    }
  }

  AddShortCode(code) {
    const text = this.smsForm.controls['sms'].value + ' ' + code;
    this.smsContent = text;
    this.smsForm.patchValue({sms : text});
  }

  EventPage() {
    this.router.navigate(['/admin/events']);
  }

  CheckLeftArraySelectUser(userId) {
    const userData = this.LeftArrayIndex.filter(user => user === userId);
    if (userData.length > 0) {
      return true;
    }
  }

  CheckRightArraySelectUser(userId) {
    const userData = this.RightArrayIndex.filter(user => user === userId);
    if (userData.length > 0) {
      return true;
    }
  }

  CheckAssignUser() {
    for (let index = this.AssignLeft.length - 1; index > -1; index--) {
      if (this.FindAssignLeftUser(this.AssignLeft[index].id) !== undefined) {
        this.AssignLeft.splice(index, 1);
      }
    }
  }
}
