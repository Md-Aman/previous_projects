import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationCountryListComponent } from './admin-quotation-country-list.component';

describe('AdminQuotationCountryListComponent', () => {
  let component: AdminQuotationCountryListComponent;
  let fixture: ComponentFixture<AdminQuotationCountryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuotationCountryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuotationCountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
