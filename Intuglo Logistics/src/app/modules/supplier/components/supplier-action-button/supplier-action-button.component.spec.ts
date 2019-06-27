import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierActionButtonComponent } from './supplier-action-button.component';

describe('SupplierActionButtonComponent', () => {
  let component: SupplierActionButtonComponent;
  let fixture: ComponentFixture<SupplierActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
