import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationFilterListComponent } from './admin-quotation-filter-list.component';

describe('AdminQuotationFilterListComponent', () => {
  let component: AdminQuotationFilterListComponent;
  let fixture: ComponentFixture<AdminQuotationFilterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuotationFilterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuotationFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
