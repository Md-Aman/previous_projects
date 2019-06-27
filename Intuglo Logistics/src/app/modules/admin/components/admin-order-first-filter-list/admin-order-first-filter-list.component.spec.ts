import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderFirstFilterListComponent } from './admin-order-first-filter-list.component';

describe('AdminOrderFirstFilterListComponent', () => {
  let component: AdminOrderFirstFilterListComponent;
  let fixture: ComponentFixture<AdminOrderFirstFilterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderFirstFilterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderFirstFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
