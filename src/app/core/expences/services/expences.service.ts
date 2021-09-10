import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ExpenceModel } from '../models/expence.model';
import { ExpencepayModel } from './../models/expencepay.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_EXPENCES_URL = ApiUrlService.URL;

@Injectable()
export class ExpencesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new user to the server
	createExpence(expence: ExpenceModel): Observable<ExpenceModel> {
		const url = 'add_expence';
		const formData = new FormData();
		formData.append('event_id', expence.event_id);
		formData.append('user_id', expence.user_id);
		formData.append('purpose', expence.purpose);
		formData.append('actual_amount', `${expence.actual_amount}`);
		formData.append('is_installment_available', `${expence.is_installment_available}`);
		formData.append('initial_paid_amount', `${expence.initial_paid_amount}`);
		formData.append('paid_amount', `${expence.paid_amount}`);
		formData.append('month_duration', `${expence.month_duration}`);
		formData.append('paid_end_date', `${expence.paid_end_date}`);
		formData.append('payent_by', `${expence.payent_by}`);
		formData.append('cheque_clearance_date', `${expence.cheque_clearance_date}`);
		formData.append('cheque_no', `${expence.cheque_no}`);
		formData.append('pay_type', `${expence.paymentmethod}`);
		formData.append('status', `${expence.status}`);
		formData.append('remaining_amount', `${expence.remaining_amount}`);
		formData.append('backend_remaining_amount', `${expence.backend_remaining_amount}`);
		formData.append('backend_paid_amount', `${expence.backend_paid_amount}`);
		formData.append('image', expence.image);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpenceModel>(API_EXPENCES_URL + url, formData, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new user to the server
	createExpencePay(expence: ExpencepayModel): Observable<ExpencepayModel> {
		const url = 'add_expencepay';
		const formData = new FormData();
		// formData.append('event_id', expence.event_id);
		formData.append('user_id', `${expence.user_id}`);
		formData.append('expence_id', `${expence.expence_id}`);
		formData.append('paid_datetime', `${expence.paid_datetime}`);
		formData.append('paid_amount', `${expence.paid_amount}`);
		formData.append('paid_by', `${expence.paid_by}`);
		formData.append('cheque_clearance_date', `${expence.cheque_clearance_date}`);
		formData.append('cheque_no', `${expence.cheque_no}`);
		formData.append('status', `${expence.status}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpencepayModel>(API_EXPENCES_URL + url, formData, { headers: httpHeaders });
	}

	// READ
	getAllExpences(): Observable<ExpenceModel[]> {
		const url = 'get_allexpence';
		return this.http.get<ExpenceModel>(API_EXPENCES_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	// READ
	getAllExpencePays(): Observable<ExpencepayModel[]> {
		return this.http.get<ExpencepayModel[]>(API_EXPENCES_URL);
	}

	getExpenceById(expenceId: number): Observable<ExpenceModel> {
		return this.http.get<ExpenceModel>(API_EXPENCES_URL + `/${expenceId}`);
	}

	getExpencepayById(expenceId: number): Observable<ExpencepayModel> {
		const params = new HttpParams().set('expence_id', `${expenceId}`);
		return this.http.get<ExpencepayModel>(API_EXPENCES_URL, { params });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findExpences(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_expence&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<ExpenceModel[]>(API_EXPENCES_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	findExpencepay(queryParams: QueryParamsModel, expenceId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_expencepay&queryParams=' + `${JSON.stringify(queryParams)}` + '&expence_id=' + `${expenceId}`;
		return this.http.get<ExpencepayModel[]>(API_EXPENCES_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	CheckExpencepay(queryParams: QueryParamsModel, expenceId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_EXPENCES_URL;
		const params = new HttpParams().set('expence_id', `${expenceId}`).set('status', '0');
		return this.http.get<ExpenceModel[]>(API_EXPENCES_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the user on the server
	updateExpence(expence: ExpenceModel): Observable<any> {
		const url = 'update_expence';
		const formData = new FormData();
		formData.append('id', `${expence.id}`);
		formData.append('event_id', expence.event_id);
		formData.append('user_id', expence.user_id);
		formData.append('purpose', expence.purpose);
		formData.append('actual_amount', `${expence.actual_amount}`);
		formData.append('is_installment_available', `${expence.is_installment_available}`);
		formData.append('initial_paid_amount', `${expence.initial_paid_amount}`);
		formData.append('paid_amount', `${expence.paid_amount}`);
		formData.append('month_duration', `${expence.month_duration}`);
		formData.append('paid_end_date', `${expence.paid_end_date}`);
		formData.append('payent_by', `${expence.payent_by}`);
		formData.append('cheque_clearance_date', `${expence.cheque_clearance_date}`);
		formData.append('cheque_no', `${expence.cheque_no}`);
		formData.append('pay_type', `${expence.paymentmethod}`);
		formData.append('status', `${expence.status}`);
		formData.append('remaining_amount', `${expence.remaining_amount}`);
		formData.append('backend_remaining_amount', `${expence.backend_remaining_amount}`);
		formData.append('backend_paid_amount', `${expence.backend_paid_amount}`);
		formData.append('image', expence.image);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpenceModel>(API_EXPENCES_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE => PUT: update the user on the server
	updateExpencepay(expence: ExpencepayModel): Observable<any> {
		const url = 'update_expencepay';
		const formData = new FormData();
		formData.append('user_id', `${expence.user_id}`);
		formData.append('id', `${expence.id}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpencepayModel>(API_EXPENCES_URL + url, formData, { headers: httpHeaders });
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
	deleteExpence(expence): Observable<ExpenceModel> {
		const url = 'delete_expence';
		const formData = new FormData();
		formData.append('user_id', expence.user_id);
		formData.append('id', expence.id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpenceModel>(API_EXPENCES_URL + url, formData, { headers: httpHeaders });
	}

	// DELETE => delete the user from the server
	deleteExpencepay(expence): Observable<ExpencepayModel> {
		const url = 'delete_expencepay';
		const formData = new FormData();
		formData.append('user_id', expence.user_id);
		formData.append('id', expence.id);
		formData.append('expence_id', expence.expence_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpencepayModel>(API_EXPENCES_URL + url, formData, { headers: httpHeaders });
	}

	deleteExpences(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteExpence(ids[i]));
		}
		return forkJoin(tasks$);
	}

	CheckExpencepayStatus(expenceId: number): Observable<ExpencepayModel> {
		const url = 'check_expence_status';
		const formData = new FormData();
		formData.append('expence_id', `${expenceId}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ExpencepayModel>(API_EXPENCES_URL + url, formData, { headers: httpHeaders });
	}
}
