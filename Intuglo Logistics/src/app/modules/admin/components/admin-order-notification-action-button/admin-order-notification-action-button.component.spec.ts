import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderNotificationActionButtonComponent } from './admin-order-notification-action-button.component';

describe('AdminOrderNotificationActionButtonComponent', () => {
  let component: AdminOrderNotificationActionButtonComponent;
  let fixture: ComponentFixture<AdminOrderNotificationActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderNotificationActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderNotificationActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
