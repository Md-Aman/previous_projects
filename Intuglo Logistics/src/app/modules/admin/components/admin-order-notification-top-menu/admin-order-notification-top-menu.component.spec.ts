import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderNotificationTopMenuComponent } from './admin-order-notification-top-menu.component';

describe('AdminOrderNotificationTopMenuComponent', () => {
  let component: AdminOrderNotificationTopMenuComponent;
  let fixture: ComponentFixture<AdminOrderNotificationTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderNotificationTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderNotificationTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
