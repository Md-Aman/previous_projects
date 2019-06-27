import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentActionButtonComponent } from './custom-agent-action-button.component';

describe('CustomAgentActionButtonComponent', () => {
  let component: CustomAgentActionButtonComponent;
  let fixture: ComponentFixture<CustomAgentActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
