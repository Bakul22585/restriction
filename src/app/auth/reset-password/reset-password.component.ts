import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { NgForm } from '@angular/forms';
import * as objectPath from 'object-path';
import { AuthNoticeService } from '../../core/auth/auth-notice.service';
import { SpinnerButtonOptions } from '../../content/partials/content/general/spinner-button/button-options.interface';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { LayoutUtilsUsersService } from '../../core/users/utils/layout-utils-users.service';
import { ApiUrlService } from '../../core/services/api-url.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public model: any = { email: '' };
  @Input() action: string;
  @Output() actionChange = new Subject<string>();
  public loading = false;

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
    public authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    public http: HttpClient,
    private layoutUtilsService: LayoutUtilsUsersService,
    public _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  loginPage(event: Event) {
    event.preventDefault();
    this.action = 'login';
    this.actionChange.next(this.action);
  }

  submit() {
    this.spinner.active = true;
    if (this.validate(this.f)) {
      const formData = new FormData();
      formData.append('password', this.model.password);
      this.http.post(ApiUrlService.URL + 'reset_password', formData).subscribe(res => {
        if (res['success'] === '1') {
          this.action = 'login';
          this.actionChange.next(this.action);
        }
        this.layoutUtilsService.showActionNotification(res['message'], 2, 5000, true, false);
        this.spinner.active = false;
        this._ref.detectChanges();
      });
    } else {
      this.spinner.active = false;
    }
  }

  validate(f: NgForm) {
    if (this.model.password !== this.model.cpassword) {
      f.form.controls.cpassword.setErrors({ 'required': true });
    }

    if (f.form.status === 'VALID') {
      return true;
    }

    return false;
  }

}
