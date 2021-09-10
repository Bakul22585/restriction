import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AttendanceModel } from '../models/attendance.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_URL = ApiUrlService.URL;

@Injectable()
export class AttendanceService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	findAreas(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = 'get_area&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<AttendanceModel[]>(API_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	GetEventAttentionUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const url = 'get_event_attention_user&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<AttendanceModel[]>(API_URL + url).pipe(
	      mergeMap(res => {
	        const result = this.httpUtils.baseFilter(res, queryParams, []);
	        return of(result);
	      })
	    );
	}

	GetEvent(): Observable<AttendanceModel> {
		const url = 'get_completed_event';
		const formData = new FormData();
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<AttendanceModel>(API_URL + url, formData, { headers: httpHeaders });
	}

	GetSearchEvent(search): Observable<AttendanceModel> {
		const url = 'get_completed_event';
		const formData = new FormData();
		formData.append('search', search);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<AttendanceModel>(API_URL + url, formData, { headers: httpHeaders });
	}

	GetEventAttentionCount(Event_id) {
		const url = 'get_event_attention_count';
		const formData = new FormData();
		formData.append('event_id', Event_id);
		return this.http.post<AttendanceModel>(API_URL + url, formData);
	}
}
