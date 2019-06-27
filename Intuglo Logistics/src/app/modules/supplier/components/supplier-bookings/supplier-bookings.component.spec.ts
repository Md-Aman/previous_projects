import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBookingsComponent } from './supplier-bookings.component';

describe('SupplierBookingsComponent', () => {
  let component: SupplierBookingsComponent;
  let fixture: ComponentFixture<SupplierBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
