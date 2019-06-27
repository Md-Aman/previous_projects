import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurAffiliateComponent } from './our-affiliate.component';

describe('OurAffiliateComponent', () => {
  let component: OurAffiliateComponent;
  let fixture: ComponentFixture<OurAffiliateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurAffiliateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
