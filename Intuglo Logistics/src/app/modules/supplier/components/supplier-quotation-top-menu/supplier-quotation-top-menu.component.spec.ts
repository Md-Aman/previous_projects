import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationTopMenuComponent } from './supplier-quotation-top-menu.component';

describe('SupplierQuotationTopMenuComponent', () => {
  let component: SupplierQuotationTopMenuComponent;
  let fixture: ComponentFixture<SupplierQuotationTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
