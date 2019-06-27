import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentSessionExpiredDialogComponent } from './custom-agent-session-expired-dialog.component';

describe('CustomAgentSessionExpiredDialogComponent', () => {
  let component: CustomAgentSessionExpiredDialogComponent;
  let fixture: ComponentFixture<CustomAgentSessionExpiredDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentSessionExpiredDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentSessionExpiredDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
