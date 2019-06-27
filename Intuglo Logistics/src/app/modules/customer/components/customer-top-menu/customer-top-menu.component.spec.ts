import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTopMenuComponent } from './customer-top-menu.component';

describe('CustomerTopMenuComponent', () => {
  let component: CustomerTopMenuComponent;
  let fixture: ComponentFixture<CustomerTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
