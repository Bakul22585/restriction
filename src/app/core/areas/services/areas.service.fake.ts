import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AreaModel } from '../models/area.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';

const API_AREAS_URL = 'api/areas';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class AreasService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new area to the server
	createArea(area: AreaModel): Observable<AreaModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<AreaModel>(API_AREAS_URL, area, { headers: httpHeaders});
	}

	// READ
	getAllAreas(): Observable<AreaModel[]> {
		return this.http.get<AreaModel[]>(API_AREAS_URL);
	}

	getAreaById(areaId: number): Observable<AreaModel> {
		return this.http.get<AreaModel>(API_AREAS_URL + `/${areaId}`);
	}

	getAreaByName(areaName: string): Observable<AreaModel> {
		const params = new HttpParams().set('area_name', `${areaName}`);
		return this.http.get<AreaModel>(API_AREAS_URL, { params });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findAreas(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_AREAS_URL;
		return this.http.get<AreaModel[]>(API_AREAS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['is_active', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the area on the server
	updateArea(area: AreaModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_AREAS_URL, area, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForArea(areas: AreaModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < areas.length; i++) {
			const _area = areas[i];
			_area.is_active = status;
			tasks$.push(this.updateArea(_area));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the area from the server
	deleteArea(areaId: number): Observable<AreaModel> {
		const url = `${API_AREAS_URL}/${areaId}`;
		return this.http.delete<AreaModel>(url);
	}

	deleteAreas(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteArea(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
