import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { FundModel } from '../models/fund.model';
import { FundpayModel } from '../models/fundpay.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';

const API_FUNDS_URL = 'api/funds';
const APT_FUNDPAY_URL = 'api/fundpay';
// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class FundsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new user to the server
	createFund(fund: FundModel): Observable<FundModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundModel>(API_FUNDS_URL, fund, { headers: httpHeaders});
	}

	// CREATE =>  POST: add a new user to the server
	createFundPay(fund: FundpayModel): Observable<FundpayModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<FundpayModel>(APT_FUNDPAY_URL, fund, { headers: httpHeaders});
	}

	// READ
	getAllFunds(): Observable<FundModel[]> {
		return this.http.get<FundModel[]>(API_FUNDS_URL);
	}

	// READ
	getAllFundPays(): Observable<FundpayModel[]> {
		return this.http.get<FundpayModel[]>(APT_FUNDPAY_URL);
	}

	getFundById(fundId: number): Observable<FundModel> {
		return this.http.get<FundModel>(API_FUNDS_URL + `/${fundId}`);
	}

	getFundpayById(fundId: number): Observable<FundpayModel> {
		const params = new HttpParams().set('fund_id', `${fundId}`);
		return this.http.get<FundpayModel>(APT_FUNDPAY_URL, { params });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findFunds(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_FUNDS_URL;
		return this.http.get<FundModel[]>(API_FUNDS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}

	findFundpay(queryParams: QueryParamsModel, fundId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_FUNDS_URL;
		const params = new HttpParams().set('fund_id', `${fundId}`);
		return this.http.get<FundModel[]>(APT_FUNDPAY_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams);
				return of(result);
			})
		);
	}

	CheckFundpay(queryParams: QueryParamsModel, fundId: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_FUNDS_URL;
		const params = new HttpParams().set('fund_id', `${fundId}`).set('status', '0');
		return this.http.get<FundModel[]>(APT_FUNDPAY_URL, { params }).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the user on the server
	updateFund(fund: FundModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_FUNDS_URL, fund, { headers: httpHeader });
	}

	// UPDATE => PUT: update the user on the server
	updateFundpay(fund: FundpayModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_FUNDS_URL, fund, { headers: httpHeader });
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
	deleteFund(fundId: number): Observable<FundModel> {
		const url = `${API_FUNDS_URL}/${fundId}`;
		return this.http.delete<FundModel>(url);
	}

	// DELETE => delete the user from the server
	deleteFundpay(fundId: number): Observable<FundpayModel> {
		const url = `${APT_FUNDPAY_URL}/${fundId}`;
		return this.http.delete<FundpayModel>(url);
	}

	deleteFunds(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteFund(ids[i]));
		}
		return forkJoin(tasks$);
	}

	CheckFunpayStatus(fundId: number): Observable < FundpayModel > {
		const params = new HttpParams().set('fund_id', `${fundId}`).set('status', '0');
		return this.http.get<FundpayModel>(APT_FUNDPAY_URL, { params });
	}
}
