import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FundModel } from '../models/fund.model';
import { FundpayModel } from '../models/fundpay.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_FUNDS_URL = ApiUrlService.URL;

@Injectable()
export class FundsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new user to the server
	createFund(fund: FundModel): Observable<FundModel> {
		const url = 'add_fund';
		const formData = new FormData();
		formData.append('event_id', fund.event_id);
		formData.append('user_id', fund.user_id);
		formData.append('purpose', fund.purpose);
		formData.append('actual_amount', `${fund.actual_amount}`);
		formData.append('is_installment_available', `${fund.is_installment_available}`);
		formData.append('initial_paid_amount', `${fund.initial_paid_amount}`);
		formData.append('paid_amount', `${fund.paid_amount}`);
		formData.append('month_duration', `${fund.month_duration}`);
		formData.append('paid_end_date', `${fund.paid_end_date}`);
		formData.append('payent_by', `${fund.payent_by}`);
		formData.append('cheque_clearance_date', `${fund.cheque_clearance_date}`);
		formData.append('cheque_no', `${fund.cheque_no}`);
		formData.append('pay_type', `${fund.paymentmethod}`);
		formData.append('status', `${fund.status}`);
		formData.append('remaining_amount', `${fund.remaining_amount}`);
		formData.append('backend_remaining_amount', `${fund.backend_remaining_amount}`);
		formData.append('backend_paid_amount', `${fund.backend_paid_amount}`);
		formData.append('image', fund.image);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new user to the server
	createFundPay(fund: FundpayModel): Observable<FundpayModel> {
		const url = 'add_fundpay';
		const formData = new FormData();
		formData.append('event_id', fund.event_id);
		formData.append('user_id', fund.user_id);
		formData.append('fund_id', `${fund.fund_id}`);
		formData.append('paid_datetime', `${fund.paid_datetime}`);
		formData.append('paid_amount', `${fund.paid_amount}`);
		formData.append('paid_by', `${fund.paid_by}`);
		formData.append('cheque_clearance_date', `${fund.cheque_clearance_date}`);
		formData.append('cheque_no', `${fund.cheque_no}`);
		formData.append('status', `${fund.status}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundpayModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	// READ
	getAllFunds(): Observable<FundModel[]> {
		const url = 'get_allfund';
		return this.http.get<FundModel>(API_FUNDS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	// READ
	getAllFundPays(): Observable<FundpayModel[]> {
		return this.http.get<FundpayModel[]>(API_FUNDS_URL);
	}

	getFundById(fundId: number): Observable<FundModel> {
		return this.http.get<FundModel>(API_FUNDS_URL + `/${fundId}`);
	}

	getFundpayById(fundId: number): Observable<FundpayModel> {
		const params = new HttpParams().set('fund_id', `${fundId}`);
		return this.http.get<FundpayModel>(API_FUNDS_URL, { params });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findFunds(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		/* const url = API_FUNDS_URL;
		return this.http.get<FundModel[]>(API_FUNDS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		); */

		const url = 'get_fund&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<FundModel[]>(API_FUNDS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	findFundpay(queryParams: QueryParamsModel, fundId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_fundpay&queryParams=' + `${JSON.stringify(queryParams)}` + '&fund_id=' + `${fundId}`;
		return this.http.get<FundModel[]>(API_FUNDS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	findPrintFundpay(queryParams: QueryParamsModel, fundId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'print_fundpaydata&queryParams=' + `${JSON.stringify(queryParams)}` + '&fund_id=' + `${fundId}`;
		return this.http.get<FundModel[]>(API_FUNDS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	CheckFundpay(queryParams: QueryParamsModel, fundId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_FUNDS_URL;
		const params = new HttpParams().set('fund_id', `${fundId}`).set('status', '0');
		return this.http.get<FundModel[]>(API_FUNDS_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the user on the server
	updateFund(fund: FundModel): Observable<any> {
		const url = 'update_fund';
		const formData = new FormData();
		formData.append('id', `${fund.id}`);
		formData.append('event_id', fund.event_id);
		formData.append('user_id', fund.user_id);
		formData.append('purpose', fund.purpose);
		formData.append('actual_amount', `${fund.actual_amount}`);
		formData.append('is_installment_available', `${fund.is_installment_available}`);
		formData.append('initial_paid_amount', `${fund.initial_paid_amount}`);
		formData.append('paid_amount', `${fund.paid_amount}`);
		formData.append('month_duration', `${fund.month_duration}`);
		formData.append('paid_end_date', `${fund.paid_end_date}`);
		formData.append('payent_by', `${fund.payent_by}`);
		formData.append('cheque_clearance_date', `${fund.cheque_clearance_date}`);
		formData.append('cheque_no', `${fund.cheque_no}`);
		formData.append('pay_type', `${fund.paymentmethod}`);
		formData.append('status', `${fund.status}`);
		formData.append('remaining_amount', `${fund.remaining_amount}`);
		formData.append('backend_remaining_amount', `${fund.backend_remaining_amount}`);
		formData.append('backend_paid_amount', `${fund.backend_paid_amount}`);
		formData.append('image', fund.image);
		formData.append('cheque_clear', fund.cheque_clear);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE => PUT: update the user on the server
	updateFundpay(fund: FundpayModel): Observable<any> {
		const url = 'update_fundpay';
		const formData = new FormData();
		formData.append('user_id', fund.user_id);
		formData.append('id', `${fund.id}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundpayModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE Status
	updateStatusForFund(funds: FundModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < funds.length; i++) {
			const _fund = funds[i];
			tasks$.push(this.updateFund(_fund));
		}
		return forkJoin(tasks$);
	}

	// UPDATE Status
	updateStatusForFundpay(funds: FundpayModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < funds.length; i++) {
			const _fund = funds[i];
			tasks$.push(this.updateFundpay(_fund));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the user from the server
	deleteFund(fund): Observable<FundModel> {
		const url = 'delete_fund';
		const formData = new FormData();
		formData.append('user_id', fund.user_id);
		formData.append('id', fund.id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	// DELETE => delete the user from the server
	deleteFundpay(fund): Observable<FundpayModel> {
		const url = 'delete_fundpay';
		const formData = new FormData();
		formData.append('user_id', fund.user_id);
		formData.append('id', fund.id);
		formData.append('fund_id', fund.fund_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundpayModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	deleteFunds(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteFund(ids[i]));
		}
		return forkJoin(tasks$);
	}

	CheckFunpayStatus(fundId: number): Observable<FundpayModel> {
		const url = 'check_fund_status';
		const formData = new FormData();
		formData.append('fund_id', `${fundId}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundpayModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	GetDeleteFunds(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const url = 'get_deletefund&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<FundModel[]>(API_FUNDS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	RestoreDonation(obj) {
		const url = 'restore_donation';
		const formData = new FormData();
		formData.append('id', obj.fund_id);
		formData.append('user_id', obj.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundpayModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}

	CloseTransaction(obj) {
		const url = 'donation_transaction_close';
		const formData = new FormData();
		formData.append('id', obj.fund_id);
		formData.append('user_id', obj.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundpayModel>(API_FUNDS_URL + url, formData, { headers: httpHeaders });
	}
}
