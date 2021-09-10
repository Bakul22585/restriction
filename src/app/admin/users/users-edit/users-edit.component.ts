import { Component, OnInit, Inject, Output, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as _moment from 'moment';
import { CommonModule, DatePipe } from '@angular/common';

import { Subject } from 'rxjs';
import { TypesUtilsService } from 'src/app/core/utils/types-utils.service';
import { LayoutUtilsUsersService, MessageType } from 'src/app/core/users/utils/layout-utils-users.service';
import { MatDialog } from '@angular/material';
import * as $ from 'jquery';

import { UserModel } from '../../../core/users/models/user.model';
import { UsersService } from '../../../core/users/services/users.service';
import { UsersPreviewComponent } from '../users-preview/users-preview.component';
import { AreasService } from 'src/app/core/areas/services/areas.service';
import { VillagesService } from 'src/app/core/villages/services/villages.service';
import { RolesService } from 'src/app/core/roles/services/roles.service';
import { HistoryModel } from '../../../core/historys/models/history.model';
import { HistorysService } from '../../../core/historys/services/historys.service';

export class LimitFlat {
	constructor(public name: string) { }
}

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
	selector: 'app-users-edit',
	templateUrl: './users-edit.component.html',
	styleUrls: ['./users-edit.component.css'],
	providers: [
		DatePipe,
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]
})

export class UsersEditComponent implements OnInit {
	public model: any = UserModel;
	@Output() actionChange = new Subject<string>();
	public loading = false;
	public userId = 0;
	public data: any = [];
	public villages: any = [];
	public roles: any = [];
	public areas: any = [];
	hasFormErrors: boolean = false;
	viewLoading: boolean = true;
	loadingAfterSubmit: boolean = true;
	is_main = false;
	members = false;
	@ViewChild('ref') ref;

	@Input() action: string;

	userForm: FormGroup;
	errors: any = [];
	addUser: any = [];
	files: File[] = [];
	base64textString = [];
	UserImage: any = [];
	Main_MEMBER = 0;
	public main_member: any = [];
	public sub_member: any = [];
	new_user = true;
	ViewUserId = 0;
	updateuser = false;
	currentData = new Date();
	UserQrCode: any;
	Countries: any = [];
	States: any = [];
	Cities: any = [];

	constructor(
		private userService: UsersService,
		private areaService: AreasService,
		private villageService: VillagesService,
		private roleService: RolesService,
		private router: Router,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsUsersService,
		public historyService: HistorysService,
		public _ref: ChangeDetectorRef,
		private datePipe: DatePipe,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.userId = localStorage.getItem('editUserId') ? Number(localStorage.getItem('editUserId')) : 0;
		this.userService.GetCountry().subscribe(res => {
			this.Countries = res['data'];
		});
		this.createForm();
		if (Number.isNaN(this.userId)) {
			this.addUser.push({});
			this.new_user = false;
			this.updateuser = false;
			this._ref.detectChanges();
		}
		this.ViewUserId = this.userId;
		this.UserQrCode = this.userId;
		this.villageService.getAllVillages().subscribe(res => {
			this.villages = res;
		});
		this.areaService.getAllAreas().subscribe(res => {
			this.areas = res;
		});
		this.roleService.getAllRoles().subscribe(res => {
			this.roles = res;
		});

		if (this.userId > 0) {
			this.loadingAfterSubmit = true;
    		this.viewLoading = true;
			this.Main_MEMBER = this.userId;
			this.updateuser = true;
			this.model = this.userService.getUserById(this.userId).subscribe(data => {
				this.model = data;
				this.main_member.push(data);
				// this.model.birth_date = this.typesUtilsService.getDateFromString(data.birth_date_str);
				this.userForm.patchValue(data);
				console.log(data);
				if (this.model.is_main_member == 'Yes') {
					this.members = false;
				} else {
					this.members = true;
				}
				this._ref.detectChanges();
			});

			// this.GetSubMember();
			this.userService.getSubUserById(this.userId).subscribe(res => {
				this.sub_member = res;
				this.viewLoading = false;
				this._ref.detectChanges();
			});
		}
	}

	GetMainMember() {
		this.main_member = [];
		this.userService.getUserById(this.Main_MEMBER).subscribe(data => {
			this.model = data;
			this.main_member.push(data);
			this.model.birth_date = this.typesUtilsService.getDateFromString(data.birth_date_str);
			this.userForm.patchValue(data);
			if (this.model.is_main_member == 'Yes') {
				this.members = false;
			} else {
				this.members = true;
			}
	    });
	}

	GetSubMember() {
		this.userService.getSubUserById(this.Main_MEMBER).subscribe(res => {
			this.sub_member = res;
			this.viewLoading = false;
			this._ref.detectChanges();
	    });
	}

	onChkChange(event) {
		if (event.checked) {
			this.members = false;
		} else {
			this.members = true;
		}
	}

	createForm() {
		this.model.birth_date = this.typesUtilsService.getDateFromString(this.model.birth_date_str);

		this.userForm = this.fb.group({
			first_name: [this.model.first_name, Validators.required],
			middle_name: [this.model.middle_name],
			last_name: [this.model.last_name, Validators.required],
			email: [this.model.email, Validators.email],
			phone_no: [this.model.phone_no, Validators.required],
			birth_date: [this.model.birth_date, Validators.required],
			gender: [this.model.gender, Validators.required],
			village_id: [this.model.village_id, Validators.required],
			role_id: [this.model.role_id, Validators.required],
			block_no: [this.model.block_no, Validators.required],
			address: [this.model.address, Validators.required],
			area_id: [this.model.area_id, Validators.required],
			country_code: [this.model.country_code, Validators.required],
			country: [this.model.country_id, Validators.required],
			city: [this.model.city, Validators.required],
			state: [this.model.state, Validators.required],
			postcode: [this.model.postcode, Validators.required],
			profile_pic: [this.model.profile_pic],
			is_main_member: [this.model.is_main_member],
			main_member_id: [this.model.main_member_id],
			is_active: [this.model.is_active],
			relation: [this.model.relation]
		});

		this.GetStates(101);
		this.GetCity(12);
		this.userForm.patchValue({ country_code : '101', country: '101', state: '12', city: '1041'});
		this._ref.detectChanges();
	}

	prepareUser(): UserModel {
		const controls = this.userForm.controls;
		// console.log(this.files);
		// if (this.files.length > 0) {
		// 	const file: File = this.files[0];
		// 	const myReader: FileReader = new FileReader();
	
		// 	myReader.onloadend = (e) => {
		// 		this.UserImage.push({'profile_pic': myReader.result});
		// 	}
		// 	myReader.readAsDataURL(file);
		// }
		const _user = new UserModel();
		if (this.userId && this.new_user) {
			_user.id = this.userId;
		}
		
		// const _date = controls['birth_date'].value;
		// if (_date) {
		// 	_user.birth_date_str = this.typesUtilsService.dateFormat(_date);
		// } else {
		// 	_user.birth_date_str = '';
		// }
		_user.user_id = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
		_user.first_name = controls['first_name'].value ? controls['first_name'].value : '';
		_user.middle_name = controls['middle_name'].value ? controls['middle_name'].value : '';
		_user.last_name = controls['last_name'].value ? controls['last_name'].value : '';
		_user.email = controls['email'].value ? controls['email'].value : '';
		_user.phone_no = controls['phone_no'].value;
		_user.birth_date = new Date(this.datePipe.transform(controls['birth_date'].value, 'yyyy/MM/dd'));
		_user.gender = controls['gender'].value;
		_user.village_id = controls['village_id'].value;
		_user.role_id = controls['role_id'].value;
		_user.block_no = controls['block_no'].value;
		_user.area_id = controls['area_id'].value;
		_user.address = controls['address'].value;
		_user.city = controls['city'].value;
		_user.state = controls['state'].value;
		_user.postcode = controls['postcode'].value;
		_user.is_main_member = this.Main_MEMBER > 0 ? this.updateuser ? this.model.is_main_member : 0 : 1;
		_user.main_member_id = this.updateuser ? this.model.main_member_id : this.Main_MEMBER;
		_user.is_active = 1;
		_user.profile_pic = (this.files.length > 0) ? this.files[0] : '';
		_user.relation = controls['relation'].value ? controls['relation'].value : '';
		_user.country_code = controls['country_code'].value;
		_user.country = controls['country'].value;
		return _user;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		const controls = this.userForm.controls;
		let error = 0;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
				if (controlName === 'first_name' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please enter first name.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'last_name' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please enter last name.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'country_code' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select country code.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'phone_no' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please enter phone number.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'birth_date' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select birth date.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'gender' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select gender.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'village_id' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select village.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'role_id' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select role.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'relation' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select relation.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'block_no' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please enter block no.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'address' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please enter address.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'country' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select country.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'state' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select state.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'city' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select city.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'area_id' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please select area.', 2, 3000, true, false);
					error = 1;
					return false;
				} else if (controlName === 'postcode' && controls[controlName].status === 'INVALID' && error === 0) {
					this.layoutUtilsService.showActionNotification('Please enter post code.', 2, 3000, true, false);
					error = 1;
					return false;
				}
			});
			this.hasFormErrors = true;
			return;
		}

		const editedUser = this.prepareUser();
		// console.log(editedUser);
		if (editedUser.id > 0) {
			this.updateUser(editedUser);
		} else {
			this.createUser(editedUser);
		}
	}

	onPreview(user) {
		const userData = user;
		const dialogRef = this.dialog.open(UsersPreviewComponent, { data: { userData } });
		dialogRef.afterClosed().subscribe(res => {
			this._ref.detectChanges();
		});
	}

	updateUser(_user: UserModel) {
		$('body').css({ 'overflow': 'hidden' });
		$('#mainloader').removeAttr('style');
		this.userService.updateUser(_user).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
			if (_user.is_main_member == 1) {
				this.GetMainMember();
			}
			this.GetSubMember();
			this.files = [];
			// tslint:disable-next-line:max-line-length
			this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
			// this.router.navigate(['admin/users']);
			$('#mainloader').css({ 'display': 'none' });
			$('body').removeAttr('style');
		});
	}

	createUser(_user: UserModel) {
		this.viewLoading = true;
		this.userService.createUser(_user).subscribe(res => {
			// this.Main_MEMBER = this.Main_MEMBER > 0 ? this.Main_MEMBER : res['data'][0].id;
			// if (res['data'][0].is_main_member == 1) {
			// 	this.GetMainMember();
			// }
			// this.GetSubMember();
			if (res['success'] === '1') {
				// tslint:disable-next-line:max-line-length
				this.layoutUtilsService.showActionNotification(res['data'][0].first_name + ' ' + res['data'][0].last_name + ' register successfully.', 2, 3000, true, false);
				this.files = [];
				const index = this.addUser.length - 1;
				this.addUser.splice(index, 1);
				this.router.navigate(['admin/users']);
			} else {
				this.layoutUtilsService.showActionNotification(res['message'], 2, 3000, true, false);
			}
		});
	}

	validate(f: NgForm) {
		if (f.form.status === 'VALID') {
			return true;
		}

		this.errors = [];
		return false;
	}

	onAlertClose($user) {
		this.hasFormErrors = false;
	}

	onCancel() {
		this.router.navigate(['admin/users']);
	}

	AddUser() {
		if (this.userId > 0) {
			this.is_main = true;
		} else {
			this.is_main = false;
		}
		this.userForm.reset();
		if (this.main_member.length > 0) {
			this.userForm.patchValue(
				{ 
					last_name: this.main_member[0]['last_name'],
					village_id: this.main_member[0]['village_id'],
					block_no: this.main_member[0]['block_no'],
					address: this.main_member[0]['address'],
					area_id: this.main_member[0]['area_id'],
					city: '1041',
					state: '12',
					country: '101',
					country_code: '101',
					postcode: this.main_member[0]['postcode']
				}
			);
			// this.userForm.patchValue({ country: '101', state: '12', city: '1041' });
		}
		const relation = this.userForm.get('relation');
		const phone_no = this.userForm.get('phone_no');
		const country_code = this.userForm.get('country_code');
		if (this.userId > 0) {
			relation.setValidators([Validators.required]);
			phone_no.clearValidators();
			country_code.clearValidators();
		} else {
			relation.clearValidators();
			phone_no.setValidators([Validators.required]);
			country_code.setValidators([Validators.required]);
		}
		relation.updateValueAndValidity();
		phone_no.updateValueAndValidity();
		country_code.updateValueAndValidity();
		this.addUser.push({});
		this.new_user = false;
		this.updateuser = false;
		this._ref.detectChanges();
	}

	fillMainMemberData(user) {
		this.UserQrCode = user.id;
		if (user.is_main_member === '1') {
			this.is_main = false;
		} else {
			this.is_main = true;
		}
		this.ViewUserId = user.id;
		this.model = user;
		this.userId = user.id;
		this.new_user = true;
		this.updateuser = true;
		this.createForm();
		const relation = this.userForm.get('relation');
		const phone_no = this.userForm.get('phone_no');
		const country_code = this.userForm.get('country_code');
		if (user.is_main_member === '1') {
			this.is_main = false;
			relation.clearValidators();
			phone_no.setValidators([Validators.required]);
			country_code.setValidators([Validators.required]);
		} else {
			this.is_main = true;
			relation.setValidators([Validators.required]);
			phone_no.clearValidators();
			country_code.clearValidators();
		}
		relation.updateValueAndValidity();
		phone_no.updateValueAndValidity();
		country_code.updateValueAndValidity();
		this._ref.detectChanges();
	}

	DeleteUser(user) {
		const obj = {};
		obj['id'] = user.id;
		obj['user_id'] = JSON.parse(sessionStorage.getItem('user_data'))._value.id;
		this.userService.deleteUser(user).subscribe(res => {
			this.main_member = [];
			this.sub_member = [];
			this.ngOnInit();
		});
	}

	UpdateUserProfilePic() {
		const obj = {};
		obj['id'] = this.userId;
		obj['profile_pic'] = this.files[0];
		obj['user_id'] = this.userId;
		this.userService.UpdateUserProfilePic(obj).subscribe(res => {
			this.files = [];
			this.main_member = [];
			this.sub_member = [];
			this.ngOnInit();
		});
	}

	GetStates(country) {
		const obj = {};
		obj['country_id'] = country;
		this.userService.GetStates(obj).subscribe(res => {
			this.States = res['data'];
			this._ref.detectChanges();
		});
	}

	GetCity(state) {
		const obj = {};
		obj['state_id'] = state;
		this.userService.GetCity(obj).subscribe(res => {
			this.Cities = res['data'];
			// this.userForm.patchValue({ country: '101', state: '12', city: '1041' });
			this._ref.detectChanges();
		});
	}

	DeleteAvatar(Avatar) {
		this.addUser.splice(Avatar, 1);
	}
}
