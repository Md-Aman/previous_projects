import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentNavbarComponent } from './custom-agent-navbar.component';

describe('CustomAgentNavbarComponent', () => {
  let component: CustomAgentNavbarComponent;
  let fixture: ComponentFixture<CustomAgentNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
