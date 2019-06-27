import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentDashboardComponent } from './custom-agent-dashboard.component';

describe('CustomAgentDashboardComponent', () => {
  let component: CustomAgentDashboardComponent;
  let fixture: ComponentFixture<CustomAgentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
