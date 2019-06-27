import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierListFilterComponent } from './supplier-list-filter.component';

describe('SupplierListFilterComponent', () => {
  let component: SupplierListFilterComponent;
  let fixture: ComponentFixture<SupplierListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
