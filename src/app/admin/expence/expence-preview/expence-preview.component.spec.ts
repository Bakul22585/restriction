import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpencePreviewComponent } from './expence-preview.component';

describe('ExpencePreviewComponent', () => {
  let component: ExpencePreviewComponent;
  let fixture: ComponentFixture<ExpencePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpencePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpencePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
