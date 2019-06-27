import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentListComponent } from './admin-payment-list.component';

describe('AdminPaymentListComponent', () => {
  let component: AdminPaymentListComponent;
  let fixture: ComponentFixture<AdminPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
