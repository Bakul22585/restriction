import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ExpenceModel } from '../../../core/expences/models/expence.model';
import { ExpencepayModel } from '../../../core/expences/models/expencepay.model';
import { ExpencesService } from '../../../core/expences/services/expences.service';
import { HistoryModel } from '../../../core/historys/models/history.model';
import { HistorysService } from '../../../core/historys/services/historys.service';

@Component({
  selector: 'app-expence-pay',
  templateUrl: './expence-pay.component.html',
  styleUrls: ['./expence-pay.component.css']
})
export class ExpencePayComponent implements OnInit {

  public payfund: any = ExpencepayModel;
  fundpay: ExpencepayModel;
  fund: ExpenceModel;
  fundForm: FormGroup;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  readonly maxSize = 104857600;
  fund_id = 0;
  paid_cheque = 0;
  date = new Date();
  mindate = new Date();
  checkpayarray: any = [];
  error = '';
  files: File[] = [];
  UserData: any = [];

  constructor(
    public dialogRef: MatDialogRef<ExpencePayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public expenceService: ExpencesService,
    public historyService: HistorysService
  ) { }

  ngOnInit() {
    this.fundpay = this.data.fund;
    this.fund = this.data.fund;
    this.fund_id = this.fundpay.id;
    this.UserData = JSON.parse(sessionStorage.getItem('user_data'))._value;
    this.createForm();
  }

  createForm() {
    const remaining = this.fund.backend_remaining_amount;
    this.fundForm = this.fb.group({
      fund_id: [this.payfund.fund_id],
      paid_amount: ['', [Validators.required, Validators.max(remaining)]],
      paid_datetime: [this.payfund.paid_datetime, Validators.required],
      paid_by: [this.payfund.paid_by, Validators.required],
      cheque_clearance_date: [this.payfund.cheque_clearance_date],
      cheque_no: [this.payfund.cheque_no],
      status: [this.payfund.status]
    });
  }

  prepareFundpay(): ExpencepayModel {
    const controls = this.fundForm.controls;
    const _fund = new ExpencepayModel();
    _fund.expence_id = this.fundpay.id;
    _fund.user_id = this.UserData.id;
    _fund.paid_amount = controls['paid_amount'].value;
    _fund.paid_datetime = controls['paid_datetime'].value;
    _fund.paid_by = controls['paid_by'].value;
    _fund.cheque_clearance_date = controls['cheque_clearance_date'].value;
    _fund.cheque_no = controls['cheque_no'].value;
    _fund.status = controls['paid_by'].value == 1 ? 1 : 0;
    return _fund;
  }

    ChequeRequired() {
    const cheque_clearance_date = this.fundForm.get('cheque_clearance_date');
    const cheque_no = this.fundForm.get('cheque_no');
    this.fundForm.get('paid_by').valueChanges.subscribe((mode: string) => {
      if (mode === '2') {
        cheque_clearance_date.setValidators([Validators.required]);
        cheque_no.setValidators([Validators.required]);
      } else {
        cheque_clearance_date.clearValidators();
        cheque_no.clearValidators();
      }
      cheque_clearance_date.updateValueAndValidity();
      cheque_no.updateValueAndValidity();
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    this.loadingAfterSubmit = false;
    const controls = this.fundForm.controls;
    this.error = '';
    /** check form */
    if (this.fundForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched();
        if (controlName == 'paid_amount' && controls['paid_amount'].invalid && this.error === '') {
          this.error = 'Please enter between 0 to ' + this.fund.backend_remaining_amount;
        } else if (controlName == 'cheque_clearance_date' && controls['cheque_clearance_date'].invalid && this.error === '') {
          this.error = 'Please enter cheque clearance date';
        } else if (controlName == 'cheque_no' && controls['cheque_no'].invalid && this.error === '') {
          this.error = 'Please enter cheque number ';
        }
      });

      this.hasFormErrors = true;
      return;
    }

    const Fundpayment = this.prepareFundpay();
    if (Fundpayment.id > 0) {
      this.updateFunds(Fundpayment);
    } else {
      this.createFunds(Fundpayment);
    }
  }

  updateFunds(_funds: ExpencepayModel) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
  }

  createFunds(_funds: ExpencepayModel) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.expenceService.createExpencePay(_funds).subscribe(res => {
      // console.log(this.fund.id);
      this.expenceService.CheckExpencepayStatus(this.fund.id).subscribe(checkres => {
        // console.log(checkres);
        this.checkpayarray = checkres['data'];
        // console.log(this.checkpayarray.length);
        let remaining = 0;
        let paidamount = 0;
        let backendremaining = 0;
        let backendpaidamount = 0;
        remaining = Number(this.fund.remaining_amount) - Number(res['data'].paid_amount);
        paidamount = Number(this.fund.paid_amount) + Number(res['data'].paid_amount);
        backendremaining = Number(this.fund.backend_remaining_amount) - Number(res['data'].paid_amount);
        backendpaidamount = Number(this.fund.backend_paid_amount) + Number(res['data'].paid_amount);
        const _fund = new ExpenceModel();
        _fund.id = this.fund.id;
        _fund.event_id = this.fund.event_id;
        _fund.user_id = this.fund.user_id;
        _fund.purpose = this.fund.purpose;
        _fund.actual_amount = this.fund.actual_amount;
        _fund.paid_amount = _funds.paid_by == 1 ? paidamount : this.fund.paid_amount;
        _fund.is_installment_available = (remaining > 0) ? this.fund.is_installment_available : false;
        _fund.initial_paid_amount = this.fund.initial_paid_amount;
        _fund.month_duration = this.fund.month_duration;
        _fund.paid_end_date = this.fund.paid_end_date;
        _fund.payent_by = this.fund.payent_by;
        _fund.cheque_clearance_date = this.fund.cheque_clearance_date;
        _fund.cheque_no = this.fund.cheque_no;
        _fund.status = (remaining > 0 || this.checkpayarray.length > 0 || _funds.paid_by === 2) ? this.fund.status : 1;
        _fund.remaining_amount = _funds.paid_by == 1 ? remaining : this.fund.remaining_amount;
        _fund.backend_remaining_amount = backendremaining;
        _fund.backend_paid_amount = backendpaidamount;
        
        this.expenceService.updateExpence(_fund).subscribe(rese => {
          this.viewLoading = false;
          this.dialogRef.close({ _funds, isEdit: false });
        });
      });
      let type = _funds.paid_by == 1 ? 'cash' : 'cheque';
      type += _funds.paid_by == 2 ? ' and cheque no ' + _funds.cheque_no : '';
      /* const _history = new HistoryModel();
      _history.user_name = JSON.parse(sessionStorage.getItem('user_data'))._value.username;
      _history.module = 'Expence';
      _history.description = JSON.parse(sessionStorage.getItem('user_data'))._value.username +
        ' was pay expence amount ' + _funds.paid_amount + ' for ' + type + '.';
      _history.action = 'Insert';
      _history.created_date = new Date();
      this.historyService.createHistory(_history).subscribe(responce => {
      }); */
    });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  emptyfile() {
    this.files = [];
  }
}
