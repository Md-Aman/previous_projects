import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaDetailsComponent } from './ra-details.component';

describe('RaDetailsComponent', () => {
  let component: RaDetailsComponent;
  let fixture: ComponentFixture<RaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
