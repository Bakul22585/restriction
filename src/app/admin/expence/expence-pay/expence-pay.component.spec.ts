import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpencePayComponent } from './expence-pay.component';

describe('ExpencePayComponent', () => {
  let component: ExpencePayComponent;
  let fixture: ComponentFixture<ExpencePayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpencePayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpencePayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
