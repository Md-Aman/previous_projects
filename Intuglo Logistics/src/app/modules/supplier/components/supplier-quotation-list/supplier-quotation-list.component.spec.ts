import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationListComponent } from './supplier-quotation-list.component';

describe('SupplierQuotationListComponent', () => {
  let component: SupplierQuotationListComponent;
  let fixture: ComponentFixture<SupplierQuotationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
