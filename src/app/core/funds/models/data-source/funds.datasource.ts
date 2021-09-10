import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { FundsService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class FundsDataSource extends BaseDataSource {
	constructor(private fundsService: FundsService) {
		super();
	}

	loadFunds(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.fundsService.findFunds(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadFundpay(
		queryParams: QueryParamsModel,
		fundId: number
	) {
		this.loadingSubject.next(true);
		this.fundsService.findFundpay(queryParams, fundId).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	CheckFundpay(
		queryParams: QueryParamsModel,
		fundId: number
	) {
		this.loadingSubject.next(true);
		this.fundsService.CheckFundpay(queryParams, fundId).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadPrintFundpay(
		queryParams: QueryParamsModel,
		fundId: number
	) {
		this.loadingSubject.next(true);
		this.fundsService.findPrintFundpay(queryParams, fundId).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadDeleteFunds(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.fundsService.GetDeleteFunds(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
