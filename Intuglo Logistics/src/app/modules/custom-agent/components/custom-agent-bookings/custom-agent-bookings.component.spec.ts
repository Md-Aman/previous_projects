import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentBookingsComponent } from './custom-agent-bookings.component';

describe('CustomAgentBookingsComponent', () => {
  let component: CustomAgentBookingsComponent;
  let fixture: ComponentFixture<CustomAgentBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
