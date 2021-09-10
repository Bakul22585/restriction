import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SmsModel } from '../models/sms.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_EVENTS_URL = ApiUrlService.URL;

@Injectable()
export class SmsService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // CREATE =>  POST: add a new user to the server
  createUser(user: SmsModel): Observable<SmsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const url = 'add_event';
    const formData = new FormData();
    formData.append('user_id', user.user_id);
    formData.append('event_name', user.name);
    formData.append('description', user.desc);
    formData.append('handler_id', user.handler_name);
    formData.append('start_datetime', user.start_datetime);
    formData.append('end_datetime', user.end_datetime);
    formData.append('place', user.place);
    formData.append('invite_user', `${JSON.stringify(user.assign_user)}`);
    formData.append('sms', user.sms);
    formData.append('profile', user.profile_pic);
    formData.append('patrika_formate', user.patrika_formate);
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SmsModel>(API_EVENTS_URL + url, formData, {
      headers: httpHeaders
    });
  }

  // READ
  getAllUsers(): Observable<SmsModel[]> {
    return this.http.get<SmsModel[]>(API_EVENTS_URL);
  }

  getUserById(userId: number): Observable<SmsModel> {
    return this.http.get<SmsModel>(API_EVENTS_URL + `/${userId}`);
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_EVENTS_URL + '/find';
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the user on the server
  updateUser(user: SmsModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_EVENTS_URL, user, { headers: httpHeader });
  }

  // UPDATE Status
  updateStatusForUser(users: SmsModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      usersForUpdate: users,
      newStatus: status
    };
    const url = API_EVENTS_URL + '/updateStatus';
    return this.http.put(url, body, { headers: httpHeaders });
  }

  // DELETE => delete the user from the server
  deleteUser(userId: number): Observable<SmsModel> {
    const url = `${API_EVENTS_URL}/${userId}`;
    return this.http.delete<SmsModel>(url);
  }

  deleteUsers(ids: number[] = []): Observable<any> {
    const url = API_EVENTS_URL + '/deleteUsers';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { userIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, {
      headers: httpHeaders
    });
  }

  findEvents(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    const url = 'get_event&queryParams=' + `${JSON.stringify(queryParams)}`;
    return this.http.get<SmsModel[]>(API_EVENTS_URL + url).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, []);
        return of(result);
      })
    );
  }

  findUsersvillagewise(
    queryParams: QueryParamsModel,
    villageName: string
  ): Observable<QueryResultsModel> {
    // This code imitates server calls
    const url = 'get_event&queryParams=' + `${JSON.stringify(queryParams)}`;
    return this.http.get<SmsModel[]>(API_EVENTS_URL + url).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, []);
        return of(result);
      })
    );
  }

  findUsersareawise(
    queryParams: QueryParamsModel,
    areaName: string
  ): Observable<QueryResultsModel> {
    // This code imitates server calls
    const url = 'get_event&queryParams=' + `${JSON.stringify(queryParams)}`;
    return this.http.get<SmsModel[]>(API_EVENTS_URL + url).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, []);
        return of(result);
      })
    );
  }

  deleteEvent(event): Observable<SmsModel> {
    const url = 'delete_event';
    const formData = new FormData();
    formData.append('id', event.id);
    formData.append('user_id', event.user_id);
    return this.http.post<SmsModel>(API_EVENTS_URL + url, formData).pipe(
      mergeMap(res => {
        return of(res['data']);
      })
    );
  }

  updateEvent(user: SmsModel): Observable<any> {
    const url = 'edit_event';
    const formData = new FormData();
    formData.append('id', `${user.id}`);
    formData.append('user_id', user.user_id);
    formData.append('event_name', user.name);
    formData.append('description', user.desc);
    formData.append('handler_id', user.handler_name);
    formData.append('start_datetime', user.start_datetime);
    formData.append('end_datetime', user.end_datetime);
    formData.append('place', user.place);
    formData.append('invite_user', `${JSON.stringify(user.assign_user)}`);
    formData.append('sms', user.sms);
    formData.append('profile', user.profile_pic);
    formData.append('patrika_formate', user.patrika_formate);
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SmsModel>(API_EVENTS_URL + url, formData, {
      headers: httpHeaders
    });
  }

  GetEventInviteUserList(
    queryParams: QueryParamsModel
  ): Observable<QueryResultsModel> {
    // This code imitates server calls
    const url = 'get_event_invite_user&queryParams=' + `${JSON.stringify(queryParams)}`;
    return this.http.get<SmsModel[]>(API_EVENTS_URL + url).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, []);
        return of(result);
      })
    );
  }

  DeleteEventInviteUser(event): Observable<SmsModel> {
    const url = 'delete_event_invite_user';
    const formData = new FormData();
    formData.append('id', event.id);
    formData.append('user_id', event.user_id);
    formData.append('invite_user_id', event.invite_user_id);
    return this.http.post<SmsModel>(API_EVENTS_URL + url, formData).pipe(
      mergeMap(res => {
        return of(res);
      })
    );
  }

  SerachUser(event): Observable<SmsModel> {
    const url = 'get_alluser';
    const formData = new FormData();
    formData.append('name', event.name);
    formData.append('assign_user', JSON.stringify(event.assign_user));
    return this.http.post<SmsModel>(API_EVENTS_URL + url, formData).pipe(
      mergeMap(res => {
        return of(res['data']);
      })
    );
  }
}
