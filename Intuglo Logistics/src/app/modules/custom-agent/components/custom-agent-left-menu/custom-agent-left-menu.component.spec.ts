import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentLeftMenuComponent } from './custom-agent-left-menu.component';

describe('CustomAgentLeftMenuComponent', () => {
  let component: CustomAgentLeftMenuComponent;
  let fixture: ComponentFixture<CustomAgentLeftMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentLeftMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
