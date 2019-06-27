import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierModifyQuotationComponent } from './supplier-modify-quotation.component';

describe('SupplierModifyQuotationComponent', () => {
  let component: SupplierModifyQuotationComponent;
  let fixture: ComponentFixture<SupplierModifyQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierModifyQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierModifyQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
