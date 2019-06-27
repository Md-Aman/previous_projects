import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAdsComponent } from './fixed-ads.component';

describe('FixedAdsComponent', () => {
  let component: FixedAdsComponent;
  let fixture: ComponentFixture<FixedAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
