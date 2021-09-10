import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RoleModel } from '../models/role.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_ROLES_URL = ApiUrlService.URL;

@Injectable()
export class RolesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new role to the server
	createRole(role: RoleModel): Observable<RoleModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'add_role';
		const formData = new FormData();
		formData.append('roles_name', role.roles_name);
		formData.append('user_id', role.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<RoleModel>(API_ROLES_URL + url, formData, { headers: httpHeaders});
	}

	// READ
	getAllRoles(): Observable<RoleModel> {
		const url = 'get_allrole';
		return this.http.get<RoleModel>(API_ROLES_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getRoleById(roleId: number): Observable<RoleModel> {
		return this.http.get<RoleModel>(API_ROLES_URL + `/${roleId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const url = 'get_role&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<RoleModel[]>(API_ROLES_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	// UPDATE => PUT: update the role on the server
	updateRole(role: RoleModel): Observable<any> {
		const url = 'edit_role';
		const formData = new FormData();
		formData.append('roles_name', role.roles_name);
		formData.append('user_id', role.user_id);
		formData.append('id', `${role.id}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<RoleModel>(API_ROLES_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE Status
	updateStatusForRole(roles: RoleModel[], status: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = {
			rolesForUpdate: roles,
			newStatus: status
		};
		const url = API_ROLES_URL + '/updateStatus';
		return this.http.put(url, body, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(role: RoleModel): Observable<RoleModel> {
		const url = 'delete_role';
		const formData = new FormData();
		formData.append('id', `${role.id}`);
		formData.append('user_id', role.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<RoleModel>(API_ROLES_URL + url, formData, { headers: httpHeaders });
	}

	deleteRoles(ids: number[] = []): Observable<any> {
		const url = API_ROLES_URL + '/deleteRoles';
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = { roleIdsForDelete: ids };
		return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
	}

	UploadRoleFile(role): Observable<any> {
		const url = 'import_role_data';
		const formData = new FormData();
		formData.append('file', role.file);
		formData.append('user_id', role.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<RoleModel>(API_ROLES_URL + url, formData, { headers: httpHeaders });
	}
}
