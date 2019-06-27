import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationTopMenuComponent } from './admin-quotation-top-menu.component';

describe('AdminQuotationTopMenuComponent', () => {
  let component: AdminQuotationTopMenuComponent;
  let fixture: ComponentFixture<AdminQuotationTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuotationTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuotationTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
