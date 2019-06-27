import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyIntugloComponent } from './why-intuglo.component';

describe('WhyIntugloComponent', () => {
  let component: WhyIntugloComponent;
  let fixture: ComponentFixture<WhyIntugloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyIntugloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyIntugloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
