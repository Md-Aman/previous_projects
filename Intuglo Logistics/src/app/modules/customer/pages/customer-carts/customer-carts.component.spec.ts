import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCartsComponent } from './customer-carts.component';

describe('CustomerCartsComponent', () => {
  let component: CustomerCartsComponent;
  let fixture: ComponentFixture<CustomerCartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
