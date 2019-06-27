import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierModifyQuotationTemplateComponent } from './supplier-modify-quotation-template.component';

describe('SupplierModifyQuotationTemplateComponent', () => {
  let component: SupplierModifyQuotationTemplateComponent;
  let fixture: ComponentFixture<SupplierModifyQuotationTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierModifyQuotationTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierModifyQuotationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
