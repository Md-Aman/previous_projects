import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationCountryFilterComponent } from './supplier-quotation-country-filter.component';

describe('SupplierQuotationCountryFilterComponent', () => {
  let component: SupplierQuotationCountryFilterComponent;
  let fixture: ComponentFixture<SupplierQuotationCountryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationCountryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationCountryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
