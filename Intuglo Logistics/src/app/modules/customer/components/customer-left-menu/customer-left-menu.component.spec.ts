import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLeftMenuComponent } from './customer-left-menu.component';

describe('CustomerLeftMenuComponent', () => {
  let component: CustomerLeftMenuComponent;
  let fixture: ComponentFixture<CustomerLeftMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLeftMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
