import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierLeftMenuComponent } from './supplier-left-menu.component';

describe('SupplierLeftMenuComponent', () => {
  let component: SupplierLeftMenuComponent;
  let fixture: ComponentFixture<SupplierLeftMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierLeftMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
