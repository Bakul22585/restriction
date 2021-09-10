import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {OverlayModule} from '@angular/cdk/overlay';
import {
    GestureConfig, MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule,
    MatTooltipModule, MatSelectModule, MatCheckboxModule, MatTableModule, MatIconModule, MatPaginatorModule,
    MatMenuModule, MatDatepickerModule, MatDialogModule, MatSnackBarModule, MatSortModule, MatInputModule,
    MatNativeDateModule, MatButtonModule, MatCardModule, MAT_DIALOG_DEFAULT_OPTIONS, MatAutocompleteModule, MatRadioModule,
    MatFormFieldModule, MatButtonToggleModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import 'hammerjs';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {AngularEditorModule} from '@kolkov/angular-editor';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ngfModule, ngf } from 'angular-file';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AngularWebStorageModule } from 'angular-web-storage';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxEditorModule } from 'ngx-editor';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {NgxPermissionsModule} from 'ngx-permissions';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { ChartsModule } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SpinnerButtonModule } from './content/partials/content/general/spinner-button/spinner-button.module';

import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {AdminComponent} from './admin/admin.component';
import {FakeApiService} from './fake-api/fake-api.service';
import {CoreModule} from './core/core.module';
import {AuthenticationModule} from './core/auth/authentication.module';
import {AclService} from './core/services/acl.service';
import {LayoutConfigService} from './core/services/layout-config.service';
import {LayoutConfigStorageService} from './core/services/layout-config-storage.service';
import {LayoutRefService} from './core/services/layout/layout-ref.service';
import {MenuConfigService} from './core/services/menu-config.service';
import {PageConfigService} from './core/services/page-config.service';
import {UserService} from './core/services/user.service';
import {UtilsService} from './core/services/utils.service';
import {ClassInitService} from './core/services/class-init.service';
import {MessengerService} from './core/services/messenger.service';
import {ClipboardService} from './core/services/clipboard.sevice';
import {LogsService} from './core/services/logs.service';
import {QuickSearchService} from './core/services/quick-search.service';
import {DataTableService} from './core/services/datatable.service';
import {SplashScreenService} from './core/services/splash-screen.service';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {SubheaderService} from './core/services/layout/subheader.service';
import {HeaderService} from './core/services/layout/header.service';
import {MenuHorizontalService} from './core/services/layout/menu-horizontal.service';
import {MenuAsideService} from './core/services/layout/menu-aside.service';
import {AppRoutingModule} from './app-routing.module';
import {ActionComponent} from './admin/header/action/action.component';
import {ProfileComponent} from './admin/header/profile/profile.component';
import {ErrorPageComponent} from './content/layout/snippets/error-page/error-page.component';
import {PartialsModule} from './content/partials/partials.module';
import {AdminRoutingModule} from './admin/admin-routing.module';
import {ListTimelineModule} from './content/partials/layout/quick-sidebar/list-timeline/list-timeline.module';
import {WidgetChartsModule} from './content/partials/content/widgets/charts/widget-charts.module';
import {HeaderComponent} from './content/layout/header/header.component';
import {FooterComponent} from './content/layout/footer/footer.component';
import {SubheaderComponent} from './content/layout/subheader/subheader.component';
import {BrandComponent} from './content/layout/header/brand/brand.component';
import {TopbarComponent} from './content/layout/header/topbar/topbar.component';
import {UserProfileComponent} from './content/layout/header/topbar/user-profile/user-profile.component';
import {SearchDropdownComponent} from './content/layout/header/topbar/search-dropdown/search-dropdown.component';
import {NotificationComponent} from './content/layout/header/topbar/notification/notification.component';
import {QuickActionComponent} from './content/layout/header/topbar/quick-action/quick-action.component';
import {LanguageSelectorComponent} from './content/layout/header/topbar/language-selector/language-selector.component';
import {AsideLeftComponent} from './content/layout/aside/aside-left.component';
import {MenuSectionComponent} from './content/layout/aside/menu-section/menu-section.component';
import {MenuHorizontalComponent} from './content/layout/header/menu-horizontal/menu-horizontal.component';
import {AsideRightComponent} from './content/layout/aside/aside-right/aside-right.component';
import {SearchDefaultComponent} from './content/layout/header/topbar/search-default/search-default.component';
import {HeaderSearchComponent} from './content/layout/header/header-search/header-search.component';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import { EventsComponent } from './admin/events/events.component';
import {AlertComponent} from './content/_shared/alert/alert.component';
import {EventsService} from './core/events/services/events.service';
import {LayoutUtilsService} from './core/events/utils/layout-utils.service';
import {ActionNotificationComponent} from './content/_shared/action-natification/action-notification.component';
import {DeleteEntityDialogComponent} from './content/_shared/delete-entity-dialog/delete-entity-dialog.component';
import {FetchEntityDialogComponent} from './content/_shared/fetch-entity-dialog/fetch-entity-dialog.component';
import {UpdateStatusDialogComponent} from './content/_shared/update-status-dialog/update-status-dialog.component';
import {TypesUtilsService} from './core/utils/types-utils.service';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import { UsersComponent } from './admin/users/users.component';
import { QRCodeModule } from 'angularx-qrcode';
import { UsersService } from './core/users/services/users.service';
import { LayoutUtilsUsersService } from './core/users/utils/layout-utils-users.service';
import { HttpUtilsService } from './core/utils/http-utils.service';
import { UsersEditComponent } from './admin/users/users-edit/users-edit.component';

import { AreasComponent } from './admin/areas/areas.component';
import { LayoutUtilsAreasService } from './core/areas/utils/layout-utils-areas.service';
import { AreasService } from './core/areas/services/areas.service';
import { RolesComponent } from './admin/roles/roles.component';
import { VillagesComponent } from './admin/villages/villages.component';
import { RolesService } from './core/roles/services/roles.service';
import { VillagesService } from './core/villages/services';
import { LayoutUtilsRolesService } from './core/roles/utils/layout-utils-roles.service';
import { LayoutUtilsVillagesService } from './core/villages/utils/layout-utils-villages.service';
import { UsersPreviewComponent } from './admin/users/users-preview/users-preview.component';
import { FundComponent } from './admin/fund/fund.component';
import { FundEditComponent } from './admin/fund/fund-edit/fund-edit.component';
import { FundsService } from './core/funds/services/funds.service';
import { FundPreviewComponent } from './admin/fund/fund-preview/fund-preview.component';
import { FundPayComponent } from './admin/fund/fund-pay/fund-pay.component';

import { NumberDirective } from './numbers-only.directive';
import { ExpenceComponent } from './admin/expence/expence.component';
import { ExpenceEditComponent } from './admin/expence/expence-edit/expence-edit.component';
import { ExpencePayComponent } from './admin/expence/expence-pay/expence-pay.component';
import { ExpencePreviewComponent } from './admin/expence/expence-preview/expence-preview.component';
import { ExpencesService } from './core/expences/services/expences.service';
import { HistoryComponent } from './admin/history/history.component';
import { HistorysService } from './core/historys/services/historys.service';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ConfirmEntityDialogComponent } from './content/_shared/confirm-entity-dialog/confirm-entity-dialog.component';
import { ReportComponent } from './admin/report/report.component';
import { FinancialReportComponent } from './admin/financial-report/financial-report.component';
import { SmsComponent } from './admin/sms/sms.component';
import { SmsService } from './core/sms/services/sms.service';
import { ViewInvitiesComponent } from './admin/events/view-invities/view-invities.component';
import { PreviewEventImageComponent } from './admin/events/preview-event-image/preview-event-image.component';
import { FinancialReportDetailsComponent } from './admin/financial-report/financial-report-details/financial-report-details.component';
import { DashboardService } from './core/dashboard/services/dashboard.service';
import { FundReceiptComponent } from './admin/fund/fund-receipt/fund-receipt.component';
import { ChildUserComponent } from './admin/users/child-user/child-user.component';
import { SendMessageComponent } from './admin/send-message/send-message.component';
import { RestoreDonationDataComponent } from './admin/restore-donation-data/restore-donation-data.component';
import { AttendanceComponent } from './admin/attendance/attendance.component';
import { AttendanceService } from './core/attendance/services/attendance.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
    align: 'left',
    allowNegative: true,
    decimal: '.',
    precision: 2,
    prefix: '₹ ',
    suffix: '',
    thousands: ','
};
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ActionComponent,
    ProfileComponent,
    ErrorPageComponent,

    HeaderComponent,
    FooterComponent,
    SubheaderComponent,
    BrandComponent,

    /* topbar components */
    TopbarComponent,
    UserProfileComponent,
    SearchDropdownComponent,
    NotificationComponent,
    QuickActionComponent,
    LanguageSelectorComponent,
    AlertComponent,

    /* aside left menu components */
    AsideLeftComponent,
    MenuSectionComponent,

    /* horizontal menu components */
    MenuHorizontalComponent,

    /* aside right component */
    AsideRightComponent,
    SearchDefaultComponent,
    HeaderSearchComponent,
    EventsComponent,

    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    ConfirmEntityDialogComponent,
    UsersComponent,
    UsersEditComponent,
    AreasComponent,
    RolesComponent,
    VillagesComponent,
    UsersPreviewComponent,
    FundComponent,
    FundEditComponent,
    FundPreviewComponent,
    FundPayComponent,
    NumberDirective,
    ExpenceComponent,
    ExpenceEditComponent,
    ExpencePayComponent,
    ExpencePreviewComponent,
    HistoryComponent,
    DashboardComponent,
    ConfirmEntityDialogComponent,
    ReportComponent,
    FinancialReportComponent,
    SmsComponent,
    ViewInvitiesComponent,
    PreviewEventImageComponent,
    FinancialReportDetailsComponent,
    FundReceiptComponent,
    ChildUserComponent,
    SendMessageComponent,
    RestoreDonationDataComponent,
    AttendanceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    AdminRoutingModule,
    HttpClientModule,
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService)
      : [],
    CoreModule,
    OverlayModule,
    AuthenticationModule,
    NgxPermissionsModule.forRoot(),
    NgbModule,
    TranslateModule.forRoot(),
    MatProgressSpinnerModule,
    AngularEditorModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    ListTimelineModule,
    WidgetChartsModule,

    /* Layout Modules */
    MatProgressBarModule,
    PerfectScrollbarModule,
    MatTabsModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSortModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MaterialFileInputModule,
    MatAutocompleteModule,
    QRCodeModule,
    MatRadioModule,
    MatDatepickerModule,
    MaterialFileInputModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ngfModule,
    LoadingBarModule.forRoot(),
    UiSwitchModule,
    CurrencyMaskModule,
    AngularWebStorageModule,
    NgSelectModule,
    DlDateTimePickerDateModule,
    NgxEditorModule,
    ChartsModule,
    MatButtonToggleModule,
    BsDatepickerModule.forRoot(),
    SpinnerButtonModule,
    /* OwlDateTimeModule,
    OwlNativeDateTimeModule, */
  ],
  providers: [
    AclService,
    LayoutConfigService,
    LayoutConfigStorageService,
    LayoutRefService,
    MenuConfigService,
    PageConfigService,
    UtilsService,
    ClassInitService,
    MessengerService,
    ClipboardService,
    LogsService,
    QuickSearchService,
    DataTableService,
    SplashScreenService,
    MatDatepickerModule,

    UsersService,
    EventsService,
    AreasService,
    RolesService,
    VillagesService,
    HttpUtilsService,
    LayoutUtilsService,
    TypesUtilsService,

    UsersService,
    FundsService,
    LayoutUtilsUsersService,
    LayoutUtilsAreasService,
    LayoutUtilsVillagesService,
    LayoutUtilsRolesService,
    ExpencesService,
    HistorysService,
    SmsService,
    DashboardService,
    AttendanceService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'm-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    },

    /* template services */
    SubheaderService,
    HeaderService,
    MenuHorizontalService,
    MenuAsideService,
    DatePipe,
    { provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    ConfirmEntityDialogComponent,
    UsersEditComponent,
    UsersPreviewComponent,
    FundEditComponent,
    FundPreviewComponent,
    FundPayComponent,
    ExpenceEditComponent,
    ExpencePreviewComponent,
    ExpencePayComponent,
    ViewInvitiesComponent,
    PreviewEventImageComponent,
    FinancialReportDetailsComponent,
    FundReceiptComponent,
    ChildUserComponent,
  ]
})
export class AppModule {}
