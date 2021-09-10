import {
	Component,
	OnInit,
	Output,
	Input,
	ViewChild,
	OnDestroy,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	HostBinding
} from '@angular/core';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthNoticeService } from '../../core/auth/auth-notice.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as objectPath from 'object-path';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerButtonOptions } from '../../content/partials/content/general/spinner-button/button-options.interface';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { TokenStorage } from '../../core/auth/token-storage.service';
import { LayoutUtilsUsersService } from '../../core/users/utils/layout-utils-users.service';
import { ApiUrlService } from '../../core/services/api-url.service';

@Component({
	selector: 'm-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
	public model: any = { email: 'admin@gmail.com', password: '1234' };
	@HostBinding('class') classes: string = 'm-login__signin';
	@Output() actionChange = new Subject<string>();
	public loading = false;

	@Input() action: string;

	@ViewChild('f') f: NgForm;
	errors: any = [];

	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'primary',
		spinnerColor: 'accent',
		fullWidth: false
	};

	constructor(
		private authService: AuthenticationService,
		private router: Router,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef,
		public session: SessionStorageService,
		public http: HttpClient,
		private tokenStorage: TokenStorage,
		private layoutUtilsService: LayoutUtilsUsersService,
	) {}

	submit() {
		this.spinner.active = true;
		if (this.validate(this.f)) {
			const formData = new FormData();
			// formData.append('op', 'login_user');
			formData.append('email', this.model.email);
			formData.append('password', this.model.password);
			this.http.post(ApiUrlService.URL + 'login_user', formData).subscribe(res => {
				if (res['success'] === '1') {
					this.session.set('user_data', res['data']);
					const credential = Object.assign({
						accessToken: 'access-token-' + Math.random(),
						refreshToken: 'access-token-' + Math.random(),
						roles: ['ADMIN'],
					});
					this.authService.saveAccessData(credential);
					this.router.navigate(['admin/dashboard']);
				} else {
					this.layoutUtilsService.showActionNotification(res['message'], 2, 5000, true, false);
				}
				this.spinner.active = false;
				this.cdr.detectChanges();
			});
			// this.authService.login(this.model).subscribe(response => {
			// 	console.log(response);
			// 	if (typeof response !== 'undefined') {
			// 		this.session.set('user_data', response);
			// 		this.router.navigate(['admin/dashboard']);
			// 	} else {
			// 		this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'error');
			// 	}
			// 	this.spinner.active = false;
			// 	this.cdr.detectChanges();
			// });
		}
	}

	ngOnInit(): void {
		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = ''; // `Use account
			// <strong>admin@demo.com</strong> and password
			// <strong>demo</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'success');
		}
	}

	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
	}

	validate(f: NgForm) {
		if (f.form.status === 'VALID') {
			return true;
		}

		this.errors = [];
		if (objectPath.get(f, 'form.controls.email.errors.email')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.INVALID', {name: this.translate.instant('AUTH.INPUT.EMAIL')}));
		}
		if (objectPath.get(f, 'form.controls.email.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.REQUIRED', {name: this.translate.instant('AUTH.INPUT.EMAIL')}));
		}

		if (objectPath.get(f, 'form.controls.password.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.INVALID', {name: this.translate.instant('AUTH.INPUT.PASSWORD')}));
		}
		if (objectPath.get(f, 'form.controls.password.errors.minlength')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.MIN_LENGTH', {name: this.translate.instant('AUTH.INPUT.PASSWORD')}));
		}

		if (this.errors.length > 0) {
			this.authNoticeService.setNotice(this.errors.join('<br/>'), 'error');
			this.spinner.active = false;
		}

		return false;
	}

	forgotPasswordPage(event: Event) {
		this.action = 'forgot-password';
		this.actionChange.next(this.action);
	}

	register(event: Event) {
		this.action = 'register';
		this.actionChange.next(this.action);
	}
}
