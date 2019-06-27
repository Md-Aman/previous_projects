import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentProfileComponent } from './custom-agent-profile.component';

describe('CustomAgentProfileComponent', () => {
  let component: CustomAgentProfileComponent;
  let fixture: ComponentFixture<CustomAgentProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
