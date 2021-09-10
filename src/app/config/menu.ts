// tslint:disable-next-line:no-shadowed-variable
import { ConfigModel } from '../core/interfaces/config';

// tslint:disable-next-line:no-shadowed-variable
export class MenuConfig implements ConfigModel {
public config: any = {};

	constructor() {
		this.config = {
			header: {
				self: {},
				items: [
				]
			},
			aside: {
				self: {},
				items: [
					{
						title: 'Dashboard',
						desc: 'Some description goes here',
						root: true,
						icon: 'flaticon-line-graph',
						page: '/admin/dashboard',
						translate: 'MENU.DASHBOARD'
					},
					{
						title: 'Users',
						desc: 'Users',
						root: true,
						icon: 'flaticon-users',
						page: '/admin/users',
						translate: 'MENU.USERS'
					},
					{
						title: 'Events',
						desc: 'Events',
						root: true,
						icon: 'flaticon-event-calendar-symbol',
						page: '/admin/events',
						translate: 'MENU.EVENTS'
					},
					{
						title: 'Donation',
						desc: 'Donation',
						root: true,
						icon: 'flaticon-gift',
						page: '/admin/fund',
						translate: 'MENU.FUND'
					},
					{
						title: 'Expense',
						desc: 'Expense',
						root: true,
						icon: '	flaticon-piggy-bank',
						page: '/admin/expence',
						translate: 'MENU.EXPENCE'
					},
					{
						title: 'Admin',
						desc: 'Admin',
						root: true,
						icon: 'flaticon-cogwheel-2',
						translate: 'MENU.ADMIN',
						submenu: [
							{
								title: 'Areas',
								desc: 'Areas',
								root: true,
								icon: 'flaticon-placeholder',
								page: '/admin/areas',
								translate: 'MENU.AREAS'
							},
							{
								title: 'Roles',
								desc: 'Roles',
								root: true,
								icon: 'flaticon-map',
								page: '/admin/roles',
								translate: 'MENU.ROLES'
							},
							{
								title: 'Villages',
								desc: 'Villages',
								root: true,
								icon: 'flaticon-map-location',
								page: '/admin/villages',
								translate: 'MENU.VILLAGES'
							},
							{
								title: 'Restore Data',
								desc: 'Restore Data',
								root: true,
								icon: 'flaticon-delete-1',
								page: '/admin/restore_data',
								translate: 'MENU.RESTORE_DATA'
							},
							{
								title: 'Attendance',
								desc: 'Attendance',
								root: true,
								icon: 'flaticon-list-3',
								page: '/admin/attendance',
								translate: 'MENU.ATTENDANCE'
							}

						]
					},
					{
						title: 'Report',
						desc: 'Report',
						root: true,
						icon: 'flaticon-graph',
						page: '/admin/report',
						translate: 'MENU.REPORT',
						submenu: [
							{
								title: 'User Report',
								desc: 'Member',
								root: true,
								icon: 'flaticon-diagram',
								page: '/admin/report',
								translate: 'MENU.MEMBER_REPORT'
							},
							{
								title: 'Financial Report',
								desc: 'Financial Report',
								root: true,
								icon: 'flaticon-graphic-2',
								page: '/admin/financial_report',
								translate: 'MENU.FINANCIAL_REPORT'
							}
						]
					},
					/* {
						title: 'Sms',
						desc: 'Sms',
						root: true,
						icon: 'flaticon-notepad',
						page: '/admin/sms',
						translate: 'MENU.SMS'
					}, */
					{
						title: 'History',
						desc: 'History',
						root: true,
						icon: 'flaticon-notepad',
						page: '/admin/history',
						translate: 'MENU.HISTORY'
					},
					{
						title: 'Send Message',
						desc: 'Send Message',
						root: true,
						icon: 'fas fa-paper-plane',
						page: '/admin/send_message',
						translate: 'MENU.SEND_MESSAGE'
					},
				]
			}
		}
	}
}
