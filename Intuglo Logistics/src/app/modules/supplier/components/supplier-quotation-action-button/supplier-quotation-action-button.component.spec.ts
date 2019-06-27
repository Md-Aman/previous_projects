import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationActionButtonComponent } from './supplier-quotation-action-button.component';

describe('SupplierQuotationActionButtonComponent', () => {
  let component: SupplierQuotationActionButtonComponent;
  let fixture: ComponentFixture<SupplierQuotationActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
