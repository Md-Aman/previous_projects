import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTablePaginationComponent } from './supplier-table-pagination.component';

describe('SupplierTablePaginationComponent', () => {
  let component: SupplierTablePaginationComponent;
  let fixture: ComponentFixture<SupplierTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
