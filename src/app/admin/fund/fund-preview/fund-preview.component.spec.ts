import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundPreviewComponent } from './fund-preview.component';

describe('FundPreviewComponent', () => {
  let component: FundPreviewComponent;
  let fixture: ComponentFixture<FundPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
