import { BaseModel } from './_base.model';

export class HistoryModel extends BaseModel {
	id: number;
	user_name: string;
	module: string;
	description: string;
	action: string;
	created_date: Date;
	created_date_str: string;

	clear() {
		this.user_name = '';
		this.module = '';
		this.description = '';
		this.action = '';
		this.created_date = new Date();
	}
}
