import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ExpenceModel } from '../models/expence.model';
import { ExpencepayModel } from '../models/expencepay.model';

const API_EXPENCES_URL = 'api/expence';
const APT_EXPENCEPAY_URL = 'api/expencepay';
// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class ExpencesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new user to the server
	createExpence(expence: ExpenceModel): Observable<ExpenceModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpenceModel>(API_EXPENCES_URL, expence, { headers: httpHeaders});
	}

	// CREATE =>  POST: add a new user to the server
	createExpencePay(expence: ExpencepayModel): Observable<ExpencepayModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpencepayModel>(APT_EXPENCEPAY_URL, expence, { headers: httpHeaders});
	}

	// READ
	getAllExpences(): Observable<ExpenceModel[]> {
		return this.http.get<ExpenceModel[]>(API_EXPENCES_URL);
	}

	// READ
	getAllExpencePays(): Observable<ExpencepayModel[]> {
		return this.http.get<ExpencepayModel[]>(APT_EXPENCEPAY_URL);
	}

	getExpenceById(expenceId: number): Observable<ExpenceModel> {
		return this.http.get<ExpenceModel>(API_EXPENCES_URL + `/${expenceId}`);
	}

	getExpencepayById(expenceId: number): Observable<ExpencepayModel> {
		const params = new HttpParams().set('expence_id', `${expenceId}`);
		return this.http.get<ExpencepayModel>(APT_EXPENCEPAY_URL, { params });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findExpences(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_EXPENCES_URL;
		return this.http.get<ExpenceModel[]>(API_EXPENCES_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}

	findExpencepay(queryParams: QueryParamsModel, expenceId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_EXPENCES_URL;
		const params = new HttpParams().set('expence_id', `${expenceId}`);
		return this.http.get<ExpencepayModel[]>(APT_EXPENCEPAY_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams);
				return of(result);
			})
		);
	}

	CheckExpencepay(queryParams: QueryParamsModel, expenceId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_EXPENCES_URL;
		const params = new HttpParams().set('expence_id', `${expenceId}`).set('status', '0');
		return this.http.get<ExpenceModel[]>(APT_EXPENCEPAY_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the user on the server
	updateExpence(expence: ExpenceModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_EXPENCES_URL, expence, { headers: httpHeader });
	}

	// UPDATE => PUT: update the user on the server
	updateExpencepay(expence: ExpencepayModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_EXPENCES_URL, expence, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForExpence(expences: ExpenceModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < expences.length; i++) {
			const _expence = expences[i];
			tasks$.push(this.updateExpence(_expence));
		}
		return forkJoin(tasks$);
	}

	// UPDATE Status
	updateStatusForExpencepay(expences: ExpencepayModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < expences.length; i++) {
			const _expence = expences[i];
			tasks$.push(this.updateExpencepay(_expence));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the user from the server
	deleteExpence(expenceId: number): Observable<ExpenceModel> {
		const url = `${API_EXPENCES_URL}/${expenceId}`;
		return this.http.delete<ExpenceModel>(url);
	}

	// DELETE => delete the user from the server
	deleteExpencepay(expenceId: number): Observable<ExpencepayModel> {
		const url = `${APT_EXPENCEPAY_URL}/${expenceId}`;
		return this.http.delete<ExpencepayModel>(url);
	}

	deleteExpences(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteExpence(ids[i]));
		}
		return forkJoin(tasks$);
	}

	CheckExpencepayStatus(expenceId: number): Observable < ExpencepayModel > {
		const params = new HttpParams().set('expence_id', `${expenceId}`).set('status', '0');
		return this.http.get<ExpencepayModel>(APT_EXPENCEPAY_URL, { params });
	}
}
