import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMitigationComponent } from './risk-mitigation.component';

describe('RiskMitigationComponent', () => {
  let component: RiskMitigationComponent;
  let fixture: ComponentFixture<RiskMitigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMitigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMitigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
