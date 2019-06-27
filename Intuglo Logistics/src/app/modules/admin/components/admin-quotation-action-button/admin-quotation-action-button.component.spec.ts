import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationActionButtonComponent } from './admin-quotation-action-button.component';

describe('AdminQuotationActionButtonComponent', () => {
  let component: AdminQuotationActionButtonComponent;
  let fixture: ComponentFixture<AdminQuotationActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuotationActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuotationActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
