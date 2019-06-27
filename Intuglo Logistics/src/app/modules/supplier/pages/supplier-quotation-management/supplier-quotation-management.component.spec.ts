import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationManagementComponent } from './supplier-quotation-management.component';

describe('SupplierQuotationManagementComponent', () => {
  let component: SupplierQuotationManagementComponent;
  let fixture: ComponentFixture<SupplierQuotationManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
