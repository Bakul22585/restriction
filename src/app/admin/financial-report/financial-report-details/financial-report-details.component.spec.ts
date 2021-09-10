import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportDetailsComponent } from './financial-report-details.component';

describe('FinancialReportDetailsComponent', () => {
  let component: FinancialReportDetailsComponent;
  let fixture: ComponentFixture<FinancialReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
