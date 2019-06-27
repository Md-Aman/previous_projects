import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierNewQuotationComponent } from './supplier-new-quotation.component';

describe('SupplierNewQuotationComponent', () => {
  let component: SupplierNewQuotationComponent;
  let fixture: ComponentFixture<SupplierNewQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierNewQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierNewQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
