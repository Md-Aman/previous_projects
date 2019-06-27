import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentListComponent } from './supplier-payment-list.component';

describe('SupplierPaymentListComponent', () => {
  let component: SupplierPaymentListComponent;
  let fixture: ComponentFixture<SupplierPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
