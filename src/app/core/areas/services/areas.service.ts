import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AreaModel } from '../models/area.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_AREAS_URL = ApiUrlService.URL;

@Injectable()
export class AreasService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new area to the server
	createArea(area: AreaModel): Observable<AreaModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'add_area';
		const formData = new FormData();
		formData.append('area_name', area.area_name);
		formData.append('user_id', area.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<AreaModel>(API_AREAS_URL + url, formData, { headers: httpHeaders});
	}

	// READ
	getAllAreas(): Observable<AreaModel> {
		const url = 'get_allarea';
		return this.http.get<AreaModel>(API_AREAS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getAreaById(areaId: number): Observable<AreaModel> {
		return this.http.get<AreaModel>(API_AREAS_URL + `/${areaId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findAreas(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = 'get_area&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<AreaModel[]>(API_AREAS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
		/* return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params:  httpParams
		}); */
	}

	// UPDATE => PUT: update the area on the server
	updateArea(area: AreaModel): Observable<any> {
		const url = 'edit_area';
		const formData = new FormData();
		formData.append('area_name', area.area_name);
		formData.append('id', `${area.id}`);
		formData.append('user_id', area.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<AreaModel>(API_AREAS_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE Status
	updateStatusForArea(areas: AreaModel[], status: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = {
			areasForUpdate: areas,
			newStatus: status
		};
		const url = API_AREAS_URL + '/updateStatus';
		return this.http.put(url, body, { headers: httpHeaders });
	}

	// DELETE => delete the area from the server
	deleteArea(area: AreaModel): Observable<AreaModel> {
		const url = 'delete_area';
		const formData = new FormData();
		formData.append('id', `${area.id}`);
		formData.append('user_id', area.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<AreaModel>(API_AREAS_URL + url, formData, { headers: httpHeaders });
	}

	deleteAreas(ids: number[] = []): Observable<any> {
		const url = API_AREAS_URL + '/deleteAreas';
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = { areaIdsForDelete: ids };
		return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
	}

	UploadAreaFile(area): Observable<any> {
		const url = 'import_area_data';
		const formData = new FormData();
		formData.append('file', area.file);
		formData.append('user_id', area.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<AreaModel>(API_AREAS_URL + url, formData, { headers: httpHeaders });
	}
}
