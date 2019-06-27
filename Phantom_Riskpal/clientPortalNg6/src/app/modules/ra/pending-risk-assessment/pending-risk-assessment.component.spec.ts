import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRiskAssessmentComponent } from './pending-risk-assessment.component';

describe('PendingRiskAssessmentComponent', () => {
  let component: PendingRiskAssessmentComponent;
  let fixture: ComponentFixture<PendingRiskAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRiskAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
