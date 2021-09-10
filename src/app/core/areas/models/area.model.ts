import { BaseModel } from './_base.model';

export class AreaModel extends BaseModel {
	id: number;
	area_name: string;
	is_active: number;
	user_id: string;
	created_date: Date;
	updated_date: Date;
	created_date_str: string;
	updated_date_str: string;

	clear() {
		this.area_name = '';
		this.is_active = 0;
		this.created_date = new Date();
		this.updated_date = new Date();
	}
}
