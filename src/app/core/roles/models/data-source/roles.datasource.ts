import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { RolesService } from '../../services/index';
import { QueryParamsModel } from '../query-models/query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-models/query-results.model';

export class RolesDataSource extends BaseDataSource {
	constructor(private rolesService: RolesService) {
		super();
	}

	loadRoles(
		queryParams: QueryParamsModel
	) {
		this.loadingSubject.next(true);
		this.rolesService.findRoles(queryParams).pipe(
			tap(res => {
				this.entitySubject.next(res.items);
				this.paginatorTotalSubject.next(res.totalCount);
			}),
			catchError(err => of(new QueryResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
