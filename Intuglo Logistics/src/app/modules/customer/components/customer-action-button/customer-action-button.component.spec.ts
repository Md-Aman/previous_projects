import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerActionButtonComponent } from './customer-action-button.component';

describe('CustomerActionButtonComponent', () => {
  let component: CustomerActionButtonComponent;
  let fixture: ComponentFixture<CustomerActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
