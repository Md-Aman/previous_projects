import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderCountryListComponent } from './admin-order-country-list.component';

describe('AdminOrderCountryListComponent', () => {
  let component: AdminOrderCountryListComponent;
  let fixture: ComponentFixture<AdminOrderCountryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderCountryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderCountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
