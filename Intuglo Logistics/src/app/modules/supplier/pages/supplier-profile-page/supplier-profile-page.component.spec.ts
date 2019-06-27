import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProfilePageComponent } from './supplier-profile-page.component';

describe('SupplierProfilesComponent', () => {
  let component: SupplierProfilePageComponent;
  let fixture: ComponentFixture<SupplierProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
