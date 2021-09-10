import { Component, OnInit, ChangeDetectionStrategy, Output, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserModel } from 'src/app/core/users/models/user.model';
import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { UsersService } from 'src/app/core/users/services/users.service';
import { AreasService } from 'src/app/core/areas/services/areas.service';
import { VillagesService } from 'src/app/core/villages/services/villages.service';
import { RolesService } from 'src/app/core/roles/services/roles.service';
import { Router } from '@angular/router';
import { TypesUtilsService } from 'src/app/core/utils/types-utils.service';
import { MatDialog } from '@angular/material';
import * as $ from 'jquery';

import { UsersPreviewComponent } from '../../users/users-preview/users-preview.component';
@Component({
	selector: 'm-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

	password = '';
	confirmPassword = '';
	photo_str = '';
	updoinstsemeday = '';
	SiteName = '';
	userData: any = [];
	@ViewChild('f') f: NgForm;

	constructor(
		private userService: UsersService,
		private areaService: AreasService,
		private villageService: VillagesService,
		private roleService: RolesService,
		private router: Router,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsUsersService,
		public _ref: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.userData = JSON.parse(sessionStorage.getItem('user_data'))._value;
		this.userService.GetSiteSetting().subscribe(res => {
			this.updoinstsemeday = res[0]['upcoming_donation_installment_day'];
			this.SiteName = res[0]['project_name'];;
			this._ref.detectChanges();
		});
	}

	onSubmit() {
		// console.log(this.f.form.status);
		if (this.f.form.status === 'VALID') {
			if (this.password !== '' && this.confirmPassword === '') {
				this.layoutUtilsService.showActionNotification('Please enter confirm password.', 2, 3000, true, false);
			} else if (this.password === '' && this.confirmPassword !== '') {
				this.layoutUtilsService.showActionNotification('Please enter password.', 2, 3000, true, false);
			} else {
				if (this.password !== '' && this.confirmPassword !== '') {
					if (this.password !== this.confirmPassword) {
						this.layoutUtilsService.showActionNotification('Your enter password and confirm password not match.', 2, 1000, true, false);
						return false;
					}
				}
				$('body').css({ 'overflow': 'hidden' });
				$('#mainloader').removeAttr('style');
				const obj = {};
				obj['password'] = this.password;
				obj['image'] = this.photo_str;
				obj['user_id'] = this.userData.id;
				obj['updoinstsemeday'] = this.updoinstsemeday;
				obj['project_name'] = this.SiteName;
				this.userService.ChangePassword(obj).subscribe(res => {
					this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
					$('#mainloader').css({ 'display': 'none' });
					$('body').removeAttr('style');
				});
			}
		}
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			this.photo_str = file;
		}
	}

}
