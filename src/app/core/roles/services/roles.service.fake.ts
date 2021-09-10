import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { RoleModel } from '../models/role.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';

const API_ROLES_URL = 'api/roles';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class RolesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new role to the server
	createRole(role: RoleModel): Observable<RoleModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<RoleModel>(API_ROLES_URL, role, { headers: httpHeaders});
	}

	// READ
	getAllRoles(): Observable<RoleModel[]> {
		return this.http.get<RoleModel[]>(API_ROLES_URL);
	}

	getRoleById(roleId: number): Observable<RoleModel> {
		return this.http.get<RoleModel>(API_ROLES_URL + `/${roleId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_ROLES_URL;
		return this.http.get<RoleModel[]>(API_ROLES_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the role on the server
	updateRole(role: RoleModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_ROLES_URL, role, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForRole(roles: RoleModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < roles.length; i++) {
			const _role = roles[i];
			_role.is_active = status;
			tasks$.push(this.updateRole(_role));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<RoleModel> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<RoleModel>(url);
	}

	deleteRoles(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteRole(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
