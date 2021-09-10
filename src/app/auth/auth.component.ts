import {
	Component,
	OnInit,
	Input,
	HostBinding,
	OnDestroy,
	Output,
	ChangeDetectorRef
} from '@angular/core';
import { LayoutConfigService } from '../core/services/layout-config.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { LayoutConfig } from '../config/layout';
import { Subject } from 'rxjs';
import { AuthNoticeService } from '../core/auth/auth-notice.service';
import { TranslationService } from '../core/services/translation.service';
import { UsersService } from '../core/users/services/users.service';

@Component({
	selector: 'm-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
	@HostBinding('id') id = 'm_login';
	@HostBinding('class')
	// tslint:disable-next-line:max-line-length
	classses: any = 'm-grid m-grid--hor m-grid--root m-page';

	@Input() action = 'login';
	today: number = Date.now();
	AdminData: any = [];

	constructor(
		private layoutConfigService: LayoutConfigService,
		public authNoticeService: AuthNoticeService,
		private translationService: TranslationService,
		public userService: UsersService,
		public _ref: ChangeDetectorRef,
		private router: Router
	) {
		this.userService.getUserById(1).subscribe(res => {
			this.AdminData = res;
			localStorage.setItem('project_name', res['project_name']);
			this._ref.detectChanges();
		});
	}

	ngOnInit(): void {
		// set login layout to blank
		this.layoutConfigService.setModel(new LayoutConfig({ content: { skin: '' } }), true);

		this.translationService.getSelectedLanguage().subscribe(lang => {
			if (lang) {
				setTimeout(() => this.translationService.setLanguage(lang));
			}
		});

		const URL_ARRAY = this.router.url.split('/');
		if (URL_ARRAY[1] === 'resetpassword') {
			this.action = 'reset-password';
		}
	}

	ngOnDestroy(): void {
		// reset back to fluid
		this.layoutConfigService.reloadSavedConfig();
	}

	register() {
		this.action = 'register';
	}
}
