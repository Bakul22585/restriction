import { BaseModel } from './_base.model';

export class SmsModel extends BaseModel {
	id: number;
	user_id: string;
	name: string;
	desc: string;
	handler_name: string;
	start_datetime: any;
	end_datetime: any;
	place: string;
	sms: string;
	assign_user: any;
	profile_pic: any;
	patrika_formate: any;
	is_active: number;
	created_date: Date;
	created_date_str: string;
}
