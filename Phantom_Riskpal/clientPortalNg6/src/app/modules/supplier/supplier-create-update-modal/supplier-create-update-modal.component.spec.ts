import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCreateUpdateModalComponent } from './supplier-create-update-modal.component';

describe('SupplierCreateUpdateModalComponent', () => {
  let component: SupplierCreateUpdateModalComponent;
  let fixture: ComponentFixture<SupplierCreateUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCreateUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCreateUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
