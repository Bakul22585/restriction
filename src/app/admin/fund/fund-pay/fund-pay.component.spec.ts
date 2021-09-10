import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundPayComponent } from './fund-pay.component';

describe('FundPayComponent', () => {
  let component: FundPayComponent;
  let fixture: ComponentFixture<FundPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
