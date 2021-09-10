import { BaseModel } from './_base.model';

export class UserModel extends BaseModel {
	id: number;
	first_name: string;
	user_id: string;
	middle_name: string;
	last_name: string;
	email: string;
	phone_no: string;
	birth_date: Date;
	birth_date_str: string;
	gender: string;
	village_id: number;
	role_id: number;
	block_no: string;
	address: string;
	area_id: number;
	city: string;
	state: string;
	postcode: number;
	profile_pic: any;
	barcode: string;
	is_main_member: number;
	is_active: number;
	main_member_id: number;
	created_date: Date;
	updated_date: Date;
	created_date_str: string;
	updated_date_str: string;
	relation: string;
	country_code: string;
	country: string;

	clear() {
		this.first_name = '';
		this.middle_name = '';
		this.last_name = '';
		this.email = '';
		this.phone_no = '';
		this.birth_date = new Date();
		this.gender = '';
		this.village_id = 0;
		this.role_id = 0;
		this.block_no = '';
		this.address = '';
		this.area_id = 0;
		this.city = '';
		this.state = '';
		this.postcode = 0;
		this.profile_pic = '';
		this.barcode = '';
		this.is_main_member = 0;
		this.is_active = 0;
		this.main_member_id = 0;
		this.created_date = new Date();
		this.updated_date = new Date();
		this.relation = '';

	}
}
