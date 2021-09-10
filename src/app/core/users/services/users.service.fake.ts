import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { UserModel } from '../models/user.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';

const API_USERS_URL = 'api/users';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class UsersService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new user to the server
	createUser(user: UserModel): Observable<UserModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<UserModel>(API_USERS_URL, user, { headers: httpHeaders});
	}

	// READ
	getAllUsers(): Observable<UserModel[]> {
		return this.http.get<UserModel[]>(API_USERS_URL);
	}
	// READ
	getAllSubUsers(): Observable<UserModel[]> {
		const params = new HttpParams().set('is_main_member', '0');
		return this.http.get<UserModel[]>(API_USERS_URL, { params });
	}

	// READ
	getAreaByName(areaName: string): Observable<UserModel[]> {
		const params = new HttpParams().set('area_id', `${areaName}`);
		return this.http.get<UserModel[]>(API_USERS_URL, { params });
	}

	// READ
	getVillageByName(villageName: string): Observable<UserModel[]> {
		const params = new HttpParams().set('village_id', `${villageName}`);
		return this.http.get<UserModel[]>(API_USERS_URL, { params });
	}
	// READ
	getAllMainUsers(): Observable<UserModel[]> {
		const params = new HttpParams().set('is_main_member', '1');
		return this.http.get<UserModel[]>(API_USERS_URL, { params });
	}

	getUserById(userId: number): Observable<UserModel> {
		return this.http.get<UserModel>(API_USERS_URL + `/${userId}`);
	}

	getSubUserById(main_member_id: number): Observable<UserModel> {
		const params = new HttpParams().set('main_member_id', `${main_member_id}`);
		return this.http.get<UserModel>(API_USERS_URL, { params });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_USERS_URL;
		const params = new HttpParams().set('is_main_member', '1');
		return this.http.get<UserModel[]>(API_USERS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}
	// items => filtered/sorted result
	findUsersvillagewise(queryParams: QueryParamsModel, villageName: string): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_USERS_URL;
		const params = new HttpParams().set('village_id', `${villageName}`);
		return this.http.get<UserModel[]>(API_USERS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}

	findUsersvillagewiseMain(queryParams: QueryParamsModel, villageName: string, Type: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_USERS_URL;
		const params = new HttpParams().set('village_id', `${villageName}`).set('is_main_member', `${Type}`);
		return this.http.get<UserModel[]>(API_USERS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}
	// items => filtered/sorted result
	findUsersareawiseMain(queryParams: QueryParamsModel, areaName: string, Type: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_USERS_URL;
		const params = new HttpParams().set('area_id', `${areaName}`).set('is_main_member', `${Type}`);
		return this.http.get<UserModel[]>(API_USERS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}

	findUsersareawise(queryParams: QueryParamsModel, areaName: string): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_USERS_URL;
		const params = new HttpParams().set('area_id', `${areaName}`);
		return this.http.get<UserModel[]>(API_USERS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}

	// UPDATE => PUT: update the user on the server
	updateUser(user: UserModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_USERS_URL, user, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForUser(users: UserModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < users.length; i++) {
			const _user = users[i];
			_user.is_active = status;
			tasks$.push(this.updateUser(_user));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the user from the server
	deleteUser(userId: number): Observable<UserModel> {
		const url = `${API_USERS_URL}/${userId}`;
		return this.http.delete<UserModel>(url);
	}

	deleteUsers(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteUser(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
