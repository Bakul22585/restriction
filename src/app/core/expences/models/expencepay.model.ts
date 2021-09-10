import { BaseModel } from './_base.model';

export class ExpencepayModel extends BaseModel {
	id: number;
	expence_id: number;
	user_id: any;
	paid_amount: number;
	paid_datetime: Date;
	paid_by: number;
	cheque_clearance_date: Date;
	cheque_no: number;
	status: number;
	created_date: Date;
	created_by: number;
	// photo: string | ArrayBuffer;

	clear() {
		this.expence_id = 0;
		this.paid_amount = 0;
		this.paid_datetime = new Date();
		this.paid_by = 0;
		this.cheque_clearance_date = new Date();
		this.cheque_no = 0;
		this.status = 0;
		this.created_date = new Date();
		this.created_by = 0;
		// this.photo = '';
	}
}
