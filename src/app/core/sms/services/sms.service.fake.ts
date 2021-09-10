import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { SmsModel } from '../models/sms.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';

const API_SMS_URL = 'api/sms';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class SmsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new user to the server
	createUser(user: SmsModel): Observable<SmsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<SmsModel>(API_SMS_URL, user, { headers: httpHeaders});
	}

	// READ
	getAllUsers(): Observable<SmsModel[]> {
		return this.http.get<SmsModel[]>(API_SMS_URL);
	}
	// READ
	getAllSubUsers(): Observable<SmsModel[]> {
		const params = new HttpParams().set('is_main_member', '0');
		return this.http.get<SmsModel[]>(API_SMS_URL, { params });
	}

	// READ
	getAreaByName(areaName: string): Observable<SmsModel[]> {
		const params = new HttpParams().set('area_id', `${areaName}`);
		return this.http.get<SmsModel[]>(API_SMS_URL, { params });
	}

	// READ
	getVillageByName(villageName: string): Observable<SmsModel[]> {
		const params = new HttpParams().set('village_id', `${villageName}`);
		return this.http.get<SmsModel[]>(API_SMS_URL, { params });
	}
	// READ
	getAllMainUsers(): Observable<SmsModel[]> {
		const params = new HttpParams().set('is_main_member', '1');
		return this.http.get<SmsModel[]>(API_SMS_URL, { params });
	}

	getUserById(userId: number): Observable<SmsModel> {
		return this.http.get<SmsModel>(API_SMS_URL + `/${userId}`);
	}

	getSubUserById(main_member_id: number): Observable<SmsModel> {
		const params = new HttpParams().set('main_member_id', `${main_member_id}`);
		return this.http.get<SmsModel>(API_SMS_URL, { params });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findEvents(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_SMS_URL;
		const params = new HttpParams().set('is_active', '1');
		return this.http.get<SmsModel[]>(API_SMS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}
	// items => filtered/sorted result
	findUsersvillagewise(queryParams: QueryParamsModel, villageName: string): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_SMS_URL;
		const params = new HttpParams().set('village_id', `${villageName}`);
		return this.http.get<SmsModel[]>(API_SMS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}
	// items => filtered/sorted result
	findUsersareawise(queryParams: QueryParamsModel, areaName: string): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_SMS_URL;
		const params = new HttpParams().set('area_id', `${areaName}`);
		return this.http.get<SmsModel[]>(API_SMS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the user on the server
	updateEvent(event: SmsModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_SMS_URL, event, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForUser(users: SmsModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < users.length; i++) {
			const _user = users[i];
			_user.is_active = status;
			tasks$.push(this.updateEvent(_user));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the user from the server
	deleteEvent(eventId: number): Observable<SmsModel> {
		const url = `${API_SMS_URL}/${eventId}`;
		return this.http.delete<SmsModel>(url);
	}

	deleteUsers(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteEvent(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
