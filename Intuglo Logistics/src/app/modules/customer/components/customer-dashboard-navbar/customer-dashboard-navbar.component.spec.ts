import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDashboardNavbarComponent } from './customer-dashboard-navbar.component';

describe('CustomerDashbordNavbarComponent', () => {
  let component: CustomerDashboardNavbarComponent;
  let fixture: ComponentFixture<CustomerDashboardNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDashboardNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDashboardNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
