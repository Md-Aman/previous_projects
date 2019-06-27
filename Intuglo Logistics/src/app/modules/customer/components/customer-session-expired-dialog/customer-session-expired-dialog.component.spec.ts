import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSessionExpiredDialogComponent } from './customer-session-expired-dialog.component';

describe('CustomerSessionExpiredDialogComponent', () => {
  let component: CustomerSessionExpiredDialogComponent;
  let fixture: ComponentFixture<CustomerSessionExpiredDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSessionExpiredDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSessionExpiredDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
