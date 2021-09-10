import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';

import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { SpinnerButtonOptions } from '../../content/partials/content/general/spinner-button/button-options.interface';

import { VillagesService } from 'src/app/core/villages/services';
import { AreasService } from '../../core/areas/services/areas.service';
import { UsersService } from '../../core/users/services/users.service';
import { ApiUrlService } from '../../core/services/api-url.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {

  placeselection = 'all';
  selectedvillage = '';
  selectedarea = '';
  minage = '';
  maxage = '';
  mindonation = '';
  maxdonation = '';
  villages: any = [];
  text = '';
  area: any = [];

  spinner: SpinnerButtonOptions = {
    active: false,
    spinnerSize: 18,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false
  };

  constructor(
    private villageService: VillagesService,
    public areaService: AreasService,
    public userService: UsersService,
    private layoutUtilsService: LayoutUtilsUsersService,
    public _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.villageService.getAllVillages().subscribe(res => {
      this.villages = res;
    });
    this.areaService.getAllAreas().subscribe(res => {
      this.area = res;
    });
  }

  onSubmit() {
    if (this.text !== '') {
      this.spinner.active = true;
      $('body').css({ 'overflow': 'hidden' });
      $('#mainloader').removeAttr('style');
      const obj = {};
      obj['selectedvillage'] = this.selectedvillage !== null ? this.selectedvillage : '';
      obj['selectedarea'] = this.selectedarea !== null ? this.selectedarea : '';
      obj['minage'] = this.minage !== null ? this.minage : '';
      obj['maxage'] = this.maxage !== null ? this.maxage : '';
      obj['mindonation'] = this.mindonation !== null ? this.mindonation : '';
      obj['maxdonation'] = this.maxdonation !== null ? this.maxdonation : '';
      obj['text'] = this.text !== null ? this.text : '';

      this.userService.SendUserWiseCustomMessage(obj).subscribe(res => {
        this.resetvalue();
        this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
        this.spinner.active = false;
        this._ref.detectChanges();
        $('#mainloader').css({ 'display': 'none' });
        $('body').removeAttr('style');
      });
    } else {
      this.layoutUtilsService.showActionNotification('Please enter message content.', 2, 3000, true, false);
    }
  }

  resetvalue() {
    this.selectedvillage = '';
    this.selectedarea = '';
    this.minage = '';
    this.maxage = '';
    this.mindonation = '';
    this.maxdonation = '';
    this.text = '';
  }

}
