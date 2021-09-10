import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DashboardModel } from '../models/dashboard.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_URL = ApiUrlService.URL;

@Injectable()
export class DashboardService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new area to the server
	createArea(area: DashboardModel): Observable<DashboardModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'add_area';
		const formData = new FormData();
		formData.append('area_name', area.area_name);
		formData.append('user_id', area.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<DashboardModel>(API_URL + url, formData, { headers: httpHeaders});
	}

	// READ
	GetUpcomingEvent(): Observable<DashboardModel> {
		const url = 'get_upcoming_event';
		return this.http.get<DashboardModel>(API_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetUpcomingBirthday(): Observable<DashboardModel> {
		const url = 'get_upcoming_birthday';
		return this.http.get<DashboardModel>(API_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetDashboardCount(): Observable<DashboardModel> {
		const url = 'get_dashboard_count';
		return this.http.get<DashboardModel>(API_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetDashboardLineChartData(): Observable<DashboardModel> {
		const url = 'get_line_chart_data';
		return this.http.get<DashboardModel>(API_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetUpcomingDonation(): Observable<DashboardModel> {
		const url = 'get_upcoming_donation_list';
		return this.http.get<DashboardModel>(API_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetEventWiseAccounting(): Observable<DashboardModel> {
		const url = 'get_dashboard_bar_finance_data';
		return this.http.get<DashboardModel>(API_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetDashboardUserDonation(): Observable<DashboardModel> {
		const url = 'get_dashboard_user_donation_data';
		return this.http.get<DashboardModel>(API_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getAreaById(areaId: number): Observable<DashboardModel> {
		return this.http.get<DashboardModel>(API_URL + `/${areaId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findAreas(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = 'get_area&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<DashboardModel[]>(API_URL + url).pipe(
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
	updateArea(area: DashboardModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_URL, area, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForArea(areas: DashboardModel[], status: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = {
			areasForUpdate: areas,
			newStatus: status
		};
		const url = API_URL + '/updateStatus';
		return this.http.put(url, body, { headers: httpHeaders });
	}

	// DELETE => delete the area from the server
	deleteArea(area: DashboardModel): Observable<DashboardModel> {
		const url = 'delete_area';
		const formData = new FormData();
		formData.append('id', `${area.id}`);
		formData.append('user_id', area.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<DashboardModel>(API_URL + url, formData, { headers: httpHeaders });
	}

	deleteAreas(ids: number[] = []): Observable<any> {
		const url = API_URL + '/deleteAreas';
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = { areaIdsForDelete: ids };
		return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
	}
}
