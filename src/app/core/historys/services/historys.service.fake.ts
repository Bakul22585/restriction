import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HistoryModel } from '../models/history.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';

const API_HISTORYS_URL = 'api/historys';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class HistorysService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new role to the server
	createHistory(history: HistoryModel): Observable<HistoryModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<HistoryModel>(API_HISTORYS_URL, history, { headers: httpHeaders});
	}

	// READ
	getAllHistorys(): Observable<HistoryModel[]> {
		return this.http.get<HistoryModel[]>(API_HISTORYS_URL);
	}

	getHistoryById(historyId: number): Observable<HistoryModel> {
		return this.http.get<HistoryModel>(API_HISTORYS_URL + `/${historyId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findHistorys(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_HISTORYS_URL;
		return this.http.get<HistoryModel[]>(API_HISTORYS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the history on the server
	updateHistory(history: HistoryModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_HISTORYS_URL, history, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForHistory(historys: HistoryModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < historys.length; i++) {
			const _history = historys[i];
			tasks$.push(this.updateHistory(_history));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the history from the server
	deleteHistory(historyId: number): Observable<HistoryModel> {
		const url = `${API_HISTORYS_URL}/${historyId}`;
		return this.http.delete<HistoryModel>(url);
	}

	deleteHistorys(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteHistory(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
