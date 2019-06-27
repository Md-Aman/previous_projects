import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurCoreTechnologyComponent } from './our-core-technology.component';

describe('OurCoreTechnologyComponent', () => {
  let component: OurCoreTechnologyComponent;
  let fixture: ComponentFixture<OurCoreTechnologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurCoreTechnologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurCoreTechnologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
