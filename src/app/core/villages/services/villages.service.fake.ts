import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { VillageModel } from '../models/village.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';

const API_VILLAGES_URL = 'api/villages';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class VillagesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new village to the server
	createVillage(village: VillageModel): Observable<VillageModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<VillageModel>(API_VILLAGES_URL, village, { headers: httpHeaders});
	}

	// READ
	getAllVillages(): Observable<VillageModel[]> {
		return this.http.get<VillageModel[]>(API_VILLAGES_URL);
	}

	getVillageById(villageId: number): Observable<VillageModel> {
		return this.http.get<VillageModel>(API_VILLAGES_URL + `/${villageId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findVillages(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_VILLAGES_URL;
		return this.http.get<VillageModel[]>(API_VILLAGES_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the village on the server
	updateVillage(village: VillageModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_VILLAGES_URL, village, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForVillage(villages: VillageModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < villages.length; i++) {
			const _village = villages[i];
			_village.is_active = status;
			tasks$.push(this.updateVillage(_village));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the village from the server
	deleteVillage(villageId: number): Observable<VillageModel> {
		const url = `${API_VILLAGES_URL}/${villageId}`;
		return this.http.delete<VillageModel>(url);
	}

	deleteVillages(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteVillage(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
