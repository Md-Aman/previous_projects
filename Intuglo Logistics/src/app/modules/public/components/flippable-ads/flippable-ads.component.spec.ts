import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlippableAdsComponent } from './flippable-ads.component';

describe('BigAdsComponent', () => {
  let component: FlippableAdsComponent;
  let fixture: ComponentFixture<FlippableAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlippableAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlippableAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
