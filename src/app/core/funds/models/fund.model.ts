import { BaseModel } from './_base.model';

export class FundModel extends BaseModel {
	id: number;
	event_id: string;
	user_id: string;
	purpose: string;
	actual_amount: number;
	paid_amount: number;
	backend_paid_amount: number;
	remaining_amount: number;
	backend_remaining_amount: number;
	is_installment_available: boolean;
	initial_paid_amount: number;
	month_duration: number;
	paid_end_date: Date;
	payent_by: number;
	cheque_no: number;
	cheque_clearance_date: Date;
	status: number;
	created_date: Date;
	updated_date: Date;
	created_by: number;
	updated_by: number;
	paymentmethod: '';
	image: any;
	cheque_clear: any;

	clear() {
		this.event_id = '';
		this.user_id = '';
		this.purpose = '';
		this.actual_amount = 0;
		this.remaining_amount = 0;
		this.backend_remaining_amount = 0;
		this.is_installment_available = true;
		this.initial_paid_amount = 0;
		this.month_duration = 0;
		this.paid_end_date = new Date();
		this.payent_by = 0;
		this.cheque_clearance_date = new Date();
		this.status = 0;
		this.cheque_no = 0;
		this.created_date = new Date();
		this.updated_date = new Date();
		this.created_by = 0;
		this.updated_by = 0;
		this.paymentmethod = '';
	}
}
