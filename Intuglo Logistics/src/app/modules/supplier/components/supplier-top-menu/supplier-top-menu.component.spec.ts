import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTopMenuComponent } from './supplier-top-menu.component';

describe('SupplierTopMenuComponent', () => {
  let component: SupplierTopMenuComponent;
  let fixture: ComponentFixture<SupplierTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
