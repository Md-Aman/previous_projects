import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSessionExpiredDialogComponent } from './supplier-session-expired-dialog.component';

describe('SuppierSessionExpiredDialogComponent', () => {
  let component: SupplierSessionExpiredDialogComponent;
  let fixture: ComponentFixture<SupplierSessionExpiredDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierSessionExpiredDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSessionExpiredDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
