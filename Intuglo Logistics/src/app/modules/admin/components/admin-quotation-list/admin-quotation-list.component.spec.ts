import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationListComponent } from './admin-quotation-list.component';

describe('AdminQuotationListComponent', () => {
  let component: AdminQuotationListComponent;
  let fixture: ComponentFixture<AdminQuotationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuotationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
