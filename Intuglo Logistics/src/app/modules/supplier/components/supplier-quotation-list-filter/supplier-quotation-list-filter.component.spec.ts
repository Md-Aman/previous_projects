import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationListFilterComponent } from './supplier-quotation-list-filter.component';

describe('SupplierQuotationListFilterComponent', () => {
  let component: SupplierQuotationListFilterComponent;
  let fixture: ComponentFixture<SupplierQuotationListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
