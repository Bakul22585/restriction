import { QuickSearchDb } from './fake-db/quick-search';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { AuthFakeDb } from './fake-db/auth';
import { MessengerDb } from './fake-db/messenger';
import { LogsDb } from './fake-db/logs';
import { CarsDb } from './fake-db/cars';
import {EventsTable} from './fake-db/events.table';
import { UsersTable } from './fake-db/users.table';
import { AreasTable } from './fake-db/areas.table';
import { RolesTable } from './fake-db/roles.table';
import { VillagesTable } from './fake-db/villages.table';
import { FundTable } from './fake-db/fund.table';
import { FundpayTable } from './fake-db/fund_pay.table';
import { ExpenceTable } from './fake-db/expence.table';
import { ExpencepayTable } from './fake-db/expence_pay.table';
import { HistorysTable } from './fake-db/historys.table';
import { SmsTable } from './fake-db/sms.table';
// import { ECommerceDataContext } from './fake-db/e-commerce-db/_e-commerce.data-context';

@Injectable()
export class FakeApiService implements InMemoryDbService {
	constructor() {}

	createDb(): {} | Observable<{}> {
		return {
			// login and account
			login: AuthFakeDb.users,
			refresh: AuthFakeDb.tokens,
			register: AuthFakeDb.users,
			// messenger
			messenger: MessengerDb.messages,

			// logs
			logs: LogsDb.logs,
			quick_search: QuickSearchDb.quickSearchHtml,
			// data-table
			cars: CarsDb.cars,

			events: EventsTable.events,

			users: UsersTable.users,

			areas: AreasTable.areas,

			roles: RolesTable.roles,

			villages: VillagesTable.villages,
			funds: FundTable.funds,
			fundpay: FundpayTable.fundspay,
			expence: ExpenceTable.expence,
			expencepay: ExpencepayTable.expencepay,
			historys: HistorysTable.historys,
			sms: SmsTable.sms,
		};
	}
}
