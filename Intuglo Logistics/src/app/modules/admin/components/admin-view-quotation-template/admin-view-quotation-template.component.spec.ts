import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewQuotationTemplateComponent } from './admin-view-quotation-template.component';

describe('AdminViewQuotationTemplateComponent', () => {
  let component: AdminViewQuotationTemplateComponent;
  let fixture: ComponentFixture<AdminViewQuotationTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewQuotationTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewQuotationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
