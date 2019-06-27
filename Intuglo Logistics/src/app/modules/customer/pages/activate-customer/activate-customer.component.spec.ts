import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCustomerComponent } from './activate-customer.component';

describe('ActivateCustomerComponent', () => {
  let component: ActivateCustomerComponent;
  let fixture: ComponentFixture<ActivateCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
