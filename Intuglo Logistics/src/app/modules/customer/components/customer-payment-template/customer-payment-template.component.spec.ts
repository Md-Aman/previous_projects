import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentTemplateComponent } from './customer-payment-template.component';

describe('CustomerPaymentTemplateComponent', () => {
  let component: CustomerPaymentTemplateComponent;
  let fixture: ComponentFixture<CustomerPaymentTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPaymentTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
