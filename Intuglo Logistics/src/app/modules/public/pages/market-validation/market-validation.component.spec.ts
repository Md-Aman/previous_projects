import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketValidationComponent } from './market-validation.component';

describe('MarketValidationComponent', () => {
  let component: MarketValidationComponent;
  let fixture: ComponentFixture<MarketValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
