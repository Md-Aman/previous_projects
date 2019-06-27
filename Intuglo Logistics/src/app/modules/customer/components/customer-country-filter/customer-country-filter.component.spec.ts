import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCountryFilterComponent } from './customer-country-filter.component';

describe('CustomerCountryFilterComponent', () => {
  let component: CustomerCountryFilterComponent;
  let fixture: ComponentFixture<CustomerCountryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCountryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCountryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
