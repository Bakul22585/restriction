import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AttendanceService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class AttendanceDataSource extends BaseDataSource {
	constructor(private attendanceService: AttendanceService) {
		super();
	}

	loadAreas(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.attendanceService.findAreas(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}

	GetEventAttentionUserData(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.attendanceService.GetEventAttentionUsers(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
