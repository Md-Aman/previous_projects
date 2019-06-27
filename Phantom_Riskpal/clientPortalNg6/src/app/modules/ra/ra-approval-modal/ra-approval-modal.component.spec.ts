import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaApprovalModalComponent } from './ra-approval-modal.component';

describe('RaApprovalModalComponent', () => {
  let component: RaApprovalModalComponent;
  let fixture: ComponentFixture<RaApprovalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaApprovalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
