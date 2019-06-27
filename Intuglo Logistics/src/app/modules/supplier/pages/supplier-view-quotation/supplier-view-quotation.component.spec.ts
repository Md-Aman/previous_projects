import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierViewQuotationComponent } from '@app/modules/supplier/pages/supplier-view-quotation/supplier-view-quotation.component';

describe('SupplierModifyQuotationComponent', () => {
  let component: SupplierViewQuotationComponent;
  let fixture: ComponentFixture<SupplierViewQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierViewQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierViewQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
