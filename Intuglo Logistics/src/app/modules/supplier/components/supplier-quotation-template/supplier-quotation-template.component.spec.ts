import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationTemplateComponent } from './supplier-quotation-template.component';

describe('SupplierQuotationTemplateComponent', () => {
  let component: SupplierQuotationTemplateComponent;
  let fixture: ComponentFixture<SupplierQuotationTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
