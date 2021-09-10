import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundEditComponent } from './fund-edit.component';

describe('FundEditComponent', () => {
  let component: FundEditComponent;
  let fixture: ComponentFixture<FundEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
