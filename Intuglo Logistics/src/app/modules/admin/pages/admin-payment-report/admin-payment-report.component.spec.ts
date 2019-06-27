import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentReportComponent } from './admin-payment-report.component';

describe('AdminPaymentReportComponent', () => {
  let component: AdminPaymentReportComponent;
  let fixture: ComponentFixture<AdminPaymentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPaymentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
