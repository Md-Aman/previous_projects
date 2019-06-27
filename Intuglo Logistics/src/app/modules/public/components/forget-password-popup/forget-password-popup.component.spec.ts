import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordPopupComponent } from './forget-password-popup.component';

describe('ForgetPasswordPopupComponent', () => {
  let component: ForgetPasswordPopupComponent;
  let fixture: ComponentFixture<ForgetPasswordPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetPasswordPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
