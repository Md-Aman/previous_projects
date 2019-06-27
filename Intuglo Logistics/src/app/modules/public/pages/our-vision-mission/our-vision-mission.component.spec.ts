import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVisionMissionComponent } from './our-vision-mission.component';

describe('OurVisionMissionComponent', () => {
  let component: OurVisionMissionComponent;
  let fixture: ComponentFixture<OurVisionMissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurVisionMissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurVisionMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
