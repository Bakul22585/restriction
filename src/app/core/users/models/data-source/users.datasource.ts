import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { UsersService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class UsersDataSource extends BaseDataSource {
	constructor(private usersService: UsersService) {
		super();
	}

	loadUsers(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.usersService.findUsers(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadDeleteUsers(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.usersService.GetDeleteUsers(queryParams).pipe(
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
		this.usersService.findUsersvillagewise(queryParams, villageName).pipe(
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
		this.usersService.findUsersareawise(queryParams, areaName).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	findUsersvillagewiseMain(
		queryParams: QueryParamsModel,
		villageName: string,
		Type: number
	) {
		this.loadingSubject.next(true);
		this.usersService.findUsersvillagewiseMain(queryParams, villageName, Type).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	findUsersareawiseMain(
		queryParams: QueryParamsModel,
		areaName: string,
		Type: number
	) {
		this.loadingSubject.next(true);
		this.usersService.findUsersareawiseMain(queryParams, areaName, Type).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadUsersWiseFinancialReport(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.usersService.GetUsersWiseFinancialReport(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadFamilyWiseFinancialReport(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.usersService.GetFamilyWiseFinancialReport(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadEventWiseFinancialReport(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.usersService.GetEventWiseFinancialReport(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadUserDetailsFinancialReport(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.usersService.GetUserDetailsFinancialReport(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadSubUsers(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.usersService.findSubUsers(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
