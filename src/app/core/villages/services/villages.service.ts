import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { VillageModel } from '../models/village.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_VILLAGES_URL = ApiUrlService.URL;

@Injectable()
export class VillagesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new village to the server
	createVillage(village: VillageModel): Observable<VillageModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'add_village';
		const formData = new FormData();
		formData.append('village_name', village.village_name);
		formData.append('user_id', village.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<VillageModel>(API_VILLAGES_URL + url, formData, { headers: httpHeaders});
	}

	// READ
	getAllVillages(): Observable<VillageModel> {
		const url = 'get_allvillage';
		return this.http.get<VillageModel>(API_VILLAGES_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
		/* return this.http.get<VillageModel[]>(API_VILLAGES_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		); */
	}

	getVillageById(villageId: number): Observable<VillageModel> {
		return this.http.get<VillageModel>(API_VILLAGES_URL + `/${villageId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findVillages(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'get_village&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<VillageModel[]>(API_VILLAGES_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	// UPDATE => PUT: update the village on the server
	updateVillage(village: VillageModel): Observable<any> {
		const url = 'edit_village';
		const formData = new FormData();
		formData.append('village_name', village.village_name);
		formData.append('user_id', village.user_id);
		formData.append('id', `${village.id}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<VillageModel>(API_VILLAGES_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE Status
	updateStatusForVillage(villages: VillageModel[], status: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = {
			villagesForUpdate: villages,
			newStatus: status
		};
		const url = API_VILLAGES_URL + '/updateStatus';
		return this.http.put(url, body, { headers: httpHeaders });
	}

	// DELETE => delete the village from the server
	deleteVillage(village: VillageModel): Observable<VillageModel> {
		const url = 'delete_village';
		const formData = new FormData();
		formData.append('id', `${village.id}`);
		formData.append('user_id', village.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<VillageModel>(API_VILLAGES_URL + url, formData, { headers: httpHeaders });
	}

	deleteVillages(ids: number[] = []): Observable<any> {
		const url = API_VILLAGES_URL + '/deleteVillages';
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = { villageIdsForDelete: ids };
		return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
	}

	UploadVillageFile(village): Observable<any> {
		const url = 'import_village_data';
		const formData = new FormData();
		formData.append('file', village.file);
		formData.append('user_id', village.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<VillageModel>(API_VILLAGES_URL + url, formData, { headers: httpHeaders });
	}
}
