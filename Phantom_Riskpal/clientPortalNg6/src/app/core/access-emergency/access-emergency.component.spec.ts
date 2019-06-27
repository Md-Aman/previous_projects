import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessEmergencyComponent } from './access-emergency.component';

describe('AccessEmergencyComponent', () => {
  let component: AccessEmergencyComponent;
  let fixture: ComponentFixture<AccessEmergencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessEmergencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessEmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
