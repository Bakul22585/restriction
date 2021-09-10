import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { SmsService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class SmsDataSource extends BaseDataSource {
	constructor(private smsService: SmsService) {
		super();
	}

	loadEvents(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.smsService.findEvents(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadUsersVillagewise(
		queryParams: QueryParamsModel,
		villageName: string
	) {
		this.loadingSubject.next(true);
		this.smsService.findUsersvillagewise(queryParams, villageName).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadUsersAreawise(
		queryParams: QueryParamsModel,
		areaName: string
	) {
		this.loadingSubject.next(true);
		this.smsService.findUsersareawise(queryParams, areaName).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	GetEventInviteUserList(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.smsService.GetEventInviteUserList(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
