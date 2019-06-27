import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCountryFilterComponent } from './supplier-country-filter.component';

describe('SupplierCountryFilterComponent', () => {
  let component: SupplierCountryFilterComponent;
  let fixture: ComponentFixture<SupplierCountryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCountryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCountryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
