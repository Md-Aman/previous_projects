import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateSponsorshipComponent } from './affiliate-sponsorship.component';

describe('AffiliateSponsorshipComponent', () => {
  let component: AffiliateSponsorshipComponent;
  let fixture: ComponentFixture<AffiliateSponsorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateSponsorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
