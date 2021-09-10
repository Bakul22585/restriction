import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from '../../utils/http-utils.service';
import { ApiUrlService } from '../../services/api-url.service';

const API_USERS_URL = ApiUrlService.URL;

@Injectable()
export class UsersService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new user to the server
	createUser(user: UserModel): Observable<UserModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'add_user';
		const formData = new FormData();
		formData.append('first_name', user.first_name);
		formData.append('user_id', user.user_id);
		formData.append('middle_name', user.middle_name);
		formData.append('last_name', user.last_name);
		formData.append('email', user.email);
		formData.append('phone_no', user.phone_no);
		formData.append('birth_date', `${user.birth_date}`);
		formData.append('gender', user.gender);
		formData.append('role_id', `${user.role_id}`);
		formData.append('village_id', `${user.village_id}`);
		formData.append('area_id', `${user.area_id}`);
		formData.append('block_no', user.block_no);
		formData.append('address', user.address);
		formData.append('city', user.city);
		formData.append('state', user.state);
		formData.append('postcode', `${user.postcode}`);
		formData.append('is_main_member', `${user.is_main_member}`);
		formData.append('main_member_id', `${user.main_member_id}`);
		formData.append('relation', user.relation);
		formData.append('profile_pic', user.profile_pic);
		formData.append('country_code', user.country_code);
		formData.append('country', user.country);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<UserModel>(API_USERS_URL + url, formData, { headers: httpHeaders});
	}

	// READ
	getAllUsers(): Observable<UserModel[]> {
		const url = 'get_alluser';
		return this.http.get<UserModel>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getAllMainUsers(): Observable<UserModel[]> {
		// const params = new HttpParams().set('is_main_member', '1');
		const url = 'get_alluser&is_main_member=1';
		return this.http.get<UserModel>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getAllSubUsers(): Observable<UserModel[]> {
		const url = 'get_alluser';
		return this.http.get<UserModel>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getSubUserById(main_member_id: number): Observable<UserModel> {
		const url = 'get_subuserbyidwise&main_member_id=' + main_member_id;
		return this.http.get<UserModel>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
		/* const params = new HttpParams().set('main_member_id', `${main_member_id}`);
		return this.http.get<UserModel>(API_USERS_URL, { params }); */
	}

	getUserById(userId: number): Observable<UserModel> {
		const url = 'get_userbyidwise&user_id=' + userId;
		return this.http.get<UserModel>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
		// return this.http.get<UserModel>(API_USERS_URL + url);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'get_user&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	SearchSubUsers(queryParams): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		// const url = 'get_alluser&queryParams=' + `${JSON.stringify(queryParams)}`;
		// return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
		// 	mergeMap(res => {
		// 		const result = this.httpUtils.baseFilter(res, queryParams, []);
		// 		return of(result);
		// 	})
		// );
		const url = 'get_alluser';
		const formData = new FormData();
		formData.append('queryParams', `${JSON.stringify(queryParams)}`);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<UserModel>(API_USERS_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE => PUT: update the user on the server
	updateUser(user: UserModel): Observable<any> {
		const url = 'edit_user';
		const formData = new FormData();
		formData.append('id', `${user.id}`);
		formData.append('first_name', user.first_name);
		formData.append('user_id', user.user_id);
		formData.append('middle_name', user.middle_name);
		formData.append('last_name', user.last_name);
		formData.append('email', user.email);
		formData.append('phone_no', user.phone_no);
		formData.append('birth_date', `${user.birth_date}`);
		formData.append('gender', user.gender);
		formData.append('role_id', `${user.role_id}`);
		formData.append('village_id', `${user.village_id}`);
		formData.append('area_id', `${user.area_id}`);
		formData.append('block_no', user.block_no);
		formData.append('address', user.address);
		formData.append('city', user.city);
		formData.append('state', user.state);
		formData.append('postcode', `${user.postcode}`);
		formData.append('is_main_member', `${user.is_main_member}`);
		formData.append('main_member_id', `${user.main_member_id}`);
		formData.append('relation', user.relation);
		formData.append('profile_pic', user.profile_pic);
		formData.append('country_code', user.country_code);
		formData.append('country', user.country);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<UserModel>(API_USERS_URL + url, formData, { headers: httpHeaders });
	}

	// UPDATE Status
	updateStatusForUser(users: UserModel[], status: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = {
			usersForUpdate: users,
			newStatus: status
		};
		const url = API_USERS_URL + '/updateStatus';
		return this.http.put(url, body, { headers: httpHeaders });
	}

	// DELETE => delete the user from the server
	deleteUser(user): Observable<UserModel> {
		const url = 'delete_user';
		const formData = new FormData();
		formData.append('id', user.id);
		formData.append('user_id', user.user_id);
		return this.http.post<UserModel>(API_USERS_URL + url, formData).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	deleteUsers(ids: number[] = []): Observable<any> {
		const url = API_USERS_URL + '/deleteUsers';
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const body = { userIdsForDelete: ids };
		return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
	}

	findUsersvillagewise(queryParams: QueryParamsModel, villageName: string): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_member_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	findUsersareawise(queryParams: QueryParamsModel, areaName: string): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_member_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	findUsersvillagewiseMain(queryParams: QueryParamsModel, villageName: string, Type: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_member_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	findUsersareawiseMain(queryParams: QueryParamsModel, areaName: string, Type: number): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'get_member_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	getAreaByName(Area): Observable<any[]> {
		const url = 'get_alluser';
		const formData = new FormData();
		formData.append('area_ids', Area.ids);
		formData.append('assign_user', Area.select_user);
		return this.http.post<UserModel>(API_USERS_URL + url, formData).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	getVillageByName(Village): Observable<any[]> {
		const url = 'get_alluser';
		const formData = new FormData();
		formData.append('village_ids', Village.ids);
		formData.append('assign_user', Village.select_user);
		return this.http.post<UserModel>(API_USERS_URL + url, formData).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetUsersWiseFinancialReport(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'user_finance_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	GetFamilyWiseFinancialReport(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'family_donation_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	GetEventWiseFinancialReport(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'eventwise_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	GetUserDetailsFinancialReport(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = 'user_donation_details_report&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	getInviteUser(UserIds): Observable<UserModel[]> {
		const url = 'get_alluser';
		const formData = new FormData();
		formData.append('user_ids', UserIds);
		return this.http.post<UserModel>(API_USERS_URL + url, formData).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetDashboardFinanceLineChartData(option): Observable<UserModel[]> {
		const url = 'get_line_chart_data';
		const formData = new FormData();
		formData.append('option', option);
		return this.http.post<UserModel>(API_USERS_URL + url, formData).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	GetDashboardEventChartData(option): Observable<UserModel[]> {
		const url = 'get_dashboard_bar_finance_data';
		const formData = new FormData();
		formData.append('option', option);
		return this.http.post<UserModel>(API_USERS_URL + url, formData).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	ChangePassword(user): Observable<any> {
		const url = 'change_password';
		const formData = new FormData();
		formData.append('user_id', user.user_id);
		formData.append('password', user.password);
		formData.append('image', user.image);
		formData.append('updoinstsemeday', user.updoinstsemeday);
		formData.append('project_name', user.project_name);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<UserModel>(API_USERS_URL + url, formData, { headers: httpHeaders });
	}

	findSubUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'get_subuserby_mainmemberwise&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	GetSiteSetting() {
		const url = 'get_sitesetting';
		const formData = new FormData();
		return this.http.post<UserModel>(API_USERS_URL + url, formData).pipe(
			mergeMap(res => {
				return of(res['data']);
			})
		);
	}

	SendUserWiseCustomMessage(obj) {
		const url = 'send_user_custome_message';
		const formData = new FormData();
		formData.append('selectedvillage', obj.selectedvillage);
		formData.append('selectedarea', obj.selectedarea);
		formData.append('minage', obj.minage);
		formData.append('maxage', obj.maxage);
		formData.append('mindonation', obj.mindonation);
		formData.append('maxdonation', obj.maxdonation);
		formData.append('text', obj.text);
		return this.http.post<UserModel>(API_USERS_URL + url, formData);
	}

	UpdateUserProfilePic(obj) {
		const url = 'update_user_profile';
		const formData = new FormData();
		formData.append('id', obj.id);
		formData.append('profile_pic', obj.profile_pic);
		formData.append('user_id', obj.user_id);
		return this.http.post<UserModel>(API_USERS_URL + url, formData);
	}

	GetCountry() {
		const url = 'get_country';
		const formData = new FormData();
		return this.http.post<UserModel>(API_USERS_URL + url, formData);
	}

	GetStates(obj) {
		const url = 'get_countrywisestates';
		const formData = new FormData();
		formData.append('country_id', obj.country_id);
		return this.http.post<UserModel>(API_USERS_URL + url, formData);
	}

	GetCity(obj) {
		const url = 'get_statewisecity';
		const formData = new FormData();
		formData.append('state_id', obj.state_id);
		return this.http.post<UserModel>(API_USERS_URL + url, formData);
	}

	SendAllUserMessage(message) {
		const url = 'send_message_all_user';
		const formData = new FormData();
		formData.append('message', message);
		return this.http.post<UserModel>(API_USERS_URL + url, formData);
	}

	GetDeleteUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const url = 'get_delete_user&queryParams=' + `${JSON.stringify(queryParams)}`;
		return this.http.get<UserModel[]>(API_USERS_URL + url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	RestoreUser(obj) {
		const url = 'restore_user';
		const formData = new FormData();
		formData.append('user_id', obj.user_id);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<UserModel>(API_USERS_URL + url, formData, { headers: httpHeaders });
	}

	GetPrintUser(UserIds) {
		const url = 'get_print_user';
		const formData = new FormData();
		formData.append('user_ids', UserIds);
		return this.http.post<UserModel>(API_USERS_URL + url, formData);
	}
}
