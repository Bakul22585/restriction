import { BaseModel } from './_base.model';

export class RoleModel extends BaseModel {
	id: number;
	roles_name: string;
	user_id: string;
	is_active: number;
	created_date: Date;
	updated_date: Date;
	created_date_str: string;
	updated_date_str: string;

	clear() {
		this.roles_name = '';
		this.is_active = 0;
		this.created_date = new Date();
		this.updated_date = new Date();
	}
}
