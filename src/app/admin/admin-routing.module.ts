import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {NgxPermissionsGuard} from 'ngx-permissions';
import {ActionComponent} from './header/action/action.component';
import {ProfileComponent} from './header/profile/profile.component';
import {ErrorPageComponent} from '../content/layout/snippets/error-page/error-page.component';
import {EventsComponent} from './events/events.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { AreasComponent } from './areas/areas.component';
import { RolesComponent } from './roles/roles.component';
import { VillagesComponent } from './villages/villages.component';
import { FundComponent } from './fund/fund.component';
import { FundEditComponent } from './fund/fund-edit/fund-edit.component';
import { ExpenceComponent } from './expence/expence.component';
import { ExpenceEditComponent } from './expence/expence-edit/expence-edit.component';
import { HistoryComponent } from './history/history.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { SmsComponent } from './sms/sms.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { RestoreDonationDataComponent } from './restore-donation-data/restore-donation-data.component';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['ADMIN', 'USER'],
                except: ['GUEST'],
                redirectTo: '/login'
            }
        },
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'header/actions',
                component: ActionComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'users/addedit/:id',
                component: UsersEditComponent
            },
            {
                path: 'users/addedit',
                component: UsersEditComponent
            },
            {
                path: 'events',
                component: EventsComponent
            },
            {
                path: 'areas',
                component: AreasComponent
            },
            {
                path: 'roles',
                component: RolesComponent
            },
            {
                path: 'villages',
                component: VillagesComponent
            },
            {
                path: 'fund',
                component: FundComponent
            },
            {
                path: 'fund/addedit',
                component: FundEditComponent
            },
            {
                path: 'fund/addedit/:id',
                component: FundEditComponent
            },
            {
                path: 'expence',
                component: ExpenceComponent
            },
            {
                path: 'expence/addedit',
                component: ExpenceEditComponent
            },
            {
                path: 'expence/addedit/:id',
                component: ExpenceEditComponent
            },
            {
                path: 'history',
                component: HistoryComponent
            },
            {
                path: 'report',
                component: ReportComponent
            },
            {
                path: 'financial_report',
                component: FinancialReportComponent
            },
            {
                path: 'AddEditEvent',
                component: SmsComponent
            },
            {
                path: 'send_message',
                component: SendMessageComponent
            },
            {
                path: 'restore_data',
                component: RestoreDonationDataComponent
            },
            {
                path: 'attendance',
                component: AttendanceComponent
            }
        ]
    },
    {
        path: 'login',
        canActivate: [NgxPermissionsGuard],
        loadChildren: '../auth/auth.module#AuthModule',
        data: {
            permissions: {
                except: 'ADMIN'
            }
        },
    },
    {
        path: '404',
        component: ErrorPageComponent
    },
    {
        path: 'error/:type',
        component: ErrorPageComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
