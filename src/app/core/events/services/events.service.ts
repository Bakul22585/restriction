import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { EventModel } from '../models/event.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { ApiUrlService } from '../../services/api-url.service';

const API_EVENTS_URL = ApiUrlService.URL;

@Injectable()
export class EventsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new event to the server
	createEvent(event: EventModel): Observable<EventModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<EventModel>(API_EVENTS_URL, event, { headers: httpHeaders});
	}

	// READ
	getAllEvents(): Observable<EventModel[]> {
		const url = 'get_allevent';
		return this.http.get<EventModel>(API_EVENTS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getEventById(eventId: number): Observable<EventModel> {
		return this.http.get<EventModel>(API_EVENTS_URL + `/${eventId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findEvents(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_EVENTS_URL;
		return this.http.get<EventModel[]>(API_EVENTS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the event on the server
	updateEvent(event: EventModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_EVENTS_URL, event, { headers: httpHeader });
	}

	// UPDATE Status
	updateStatusForEvent(events: EventModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < events.length; i++) {
			const _event = events[i];
			_event.is_active = status;
			tasks$.push(this.updateEvent(_event));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the event from the server
	deleteEvent(eventId: number): Observable<EventModel> {
		const url = `${API_EVENTS_URL}/${eventId}`;
		return this.http.delete<EventModel>(url);
	}

	deleteEvents(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteEvent(ids[i]));
		}
		return forkJoin(tasks$);
	}
}
