import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTablePaginationComponent } from './admin-table-pagination.component';

describe('AdminTablePaginationComponent', () => {
  let component: AdminTablePaginationComponent;
  let fixture: ComponentFixture<AdminTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
