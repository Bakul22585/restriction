import { BaseModel } from './_base.model';

export class EventModel  extends BaseModel {
	id: number;
	title: string;
	tagline: string;
	description: string;
	datetime: Date;
	dateTimeStr: string;
	image: string;
	address: string;
	allow_outsider: number;
	limit_per_flat: string;
	is_active: number;
	event_img: any;


	clear() {
		this.title = '';
		this.tagline = '';
		this.description = '';
		this.datetime = new Date();
		this.image = 'Female';
		this.address = '';
		this.allow_outsider = 0;
		this.limit_per_flat = '';
		this.is_active = 0;
		this.event_img = [];
	}
}
