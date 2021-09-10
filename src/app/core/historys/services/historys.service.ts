import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HistoryModel } from '../models/history.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_ROLES_URL = ApiUrlService.URL;

@Injectable()
export class HistorysService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new role to the server
	createRole(role: HistoryModel): Observable<HistoryModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<HistoryModel>(API_ROLES_URL, role, { headers: httpHeaders});
	}

	// READ
	getAllRoles(): Observable<HistoryModel[]> {
		return this.http.get<HistoryModel[]>(API_ROLES_URL);
	}

	getRoleById(roleId: number): Observable<HistoryModel> {
		return this.http.get<HistoryModel>(API_ROLES_URL + `/${roleId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = API_ROLES_URL + '/find';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params:  httpParams
		});
	}

	// UPDATE => PUT: update the role on the server
	updateRole(role: HistoryModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_ROLES_URL, role, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForRole(roles: HistoryModel[], status: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = {
			rolesForUpdate: roles,
			newStatus: status
		};
		const url = API_ROLES_URL + '/updateStatus';
		return this.http.put(url, body, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<HistoryModel> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<HistoryModel>(url);
	}

	deleteRoles(ids: number[] = []): Observable<any> {
		const url = API_ROLES_URL + '/deleteRoles';
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = { roleIdsForDelete: ids };
		return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
	}

	findHistorys(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_history&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<HistoryModel[]>(API_ROLES_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}
}
