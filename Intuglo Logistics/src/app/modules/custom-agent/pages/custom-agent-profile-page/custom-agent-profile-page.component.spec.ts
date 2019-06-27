import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentProfilePageComponent } from './custom-agent-profile-page.component';

describe('CustomAgentProfilePageComponent', () => {
  let component: CustomAgentProfilePageComponent;
  let fixture: ComponentFixture<CustomAgentProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
