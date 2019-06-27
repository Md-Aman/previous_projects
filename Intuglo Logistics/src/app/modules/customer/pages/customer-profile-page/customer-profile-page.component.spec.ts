import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfilePageComponent } from './customer-profile-page.component';

describe('CustomerProfilesComponent', () => {
  let component: CustomerProfilePageComponent;
  let fixture: ComponentFixture<CustomerProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
