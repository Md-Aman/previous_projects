import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySponsorshipComponent } from './community-sponsorship.component';

describe('CommunitySponsorshipComponent', () => {
  let component: CommunitySponsorshipComponent;
  let fixture: ComponentFixture<CommunitySponsorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySponsorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
