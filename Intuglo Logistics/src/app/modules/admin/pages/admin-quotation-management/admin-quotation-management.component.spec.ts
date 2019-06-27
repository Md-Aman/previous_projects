import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationManagementComponent } from './admin-quotation-management.component';

describe('AdminQuotationManagementComponent', () => {
  let component: AdminQuotationManagementComponent;
  let fixture: ComponentFixture<AdminQuotationManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuotationManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuotationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
