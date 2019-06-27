import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentPasswordPopupComponent } from './custom-agent-password-popup.component';

describe('CustomAgentPasswordPopupComponent', () => {
  let component: CustomAgentPasswordPopupComponent;
  let fixture: ComponentFixture<CustomAgentPasswordPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentPasswordPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentPasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
