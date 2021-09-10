import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreDonationDataComponent } from './restore-donation-data.component';

describe('RestoreDonationDataComponent', () => {
  let component: RestoreDonationDataComponent;
  let fixture: ComponentFixture<RestoreDonationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreDonationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreDonationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
