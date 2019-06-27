import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminOrderActionButtonComponent } from './admin-order-action-button.component';

describe('AdminOrderActionButtonComponent', () => {
  let component: AdminOrderActionButtonComponent;
  let fixture: ComponentFixture<AdminOrderActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
