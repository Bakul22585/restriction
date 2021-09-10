import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ExpencesService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class ExpencesDataSource extends BaseDataSource {
	constructor(private expencesService: ExpencesService) {
		super();
	}

	loadExpences(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.expencesService.findExpences(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	loadExpencepay(
		queryParams: QueryParamsModel,
		expenceId: number
	) {
		this.loadingSubject.next(true);
		this.expencesService.findExpencepay(queryParams, expenceId).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	CheckExpencepay(
		queryParams: QueryParamsModel,
		expenceId: number
	) {
		this.loadingSubject.next(true);
		this.expencesService.CheckExpencepay(queryParams, expenceId).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
