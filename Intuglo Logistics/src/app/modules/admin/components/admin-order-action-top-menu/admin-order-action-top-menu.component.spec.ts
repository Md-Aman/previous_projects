import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderActionTopMenuComponent } from './admin-order-action-top-menu.component';

describe('AdminOrderActionTopMenuComponent', () => {
  let component: AdminOrderActionTopMenuComponent;
  let fixture: ComponentFixture<AdminOrderActionTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderActionTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderActionTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
