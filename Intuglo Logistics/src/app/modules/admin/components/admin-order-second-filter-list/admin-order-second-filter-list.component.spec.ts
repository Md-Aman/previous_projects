import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderSecondFilterListComponent } from './admin-order-second-filter-list.component';

describe('AdminOrderSecondFilterListComponent', () => {
  let component: AdminOrderSecondFilterListComponent;
  let fixture: ComponentFixture<AdminOrderSecondFilterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderSecondFilterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderSecondFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
