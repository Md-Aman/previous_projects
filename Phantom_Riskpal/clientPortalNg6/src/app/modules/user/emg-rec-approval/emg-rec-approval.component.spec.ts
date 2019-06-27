import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmgRecApprovalComponent } from './emg-rec-approval.component';

describe('EmgRecApprovalComponent', () => {
  let component: EmgRecApprovalComponent;
  let fixture: ComponentFixture<EmgRecApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmgRecApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmgRecApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
