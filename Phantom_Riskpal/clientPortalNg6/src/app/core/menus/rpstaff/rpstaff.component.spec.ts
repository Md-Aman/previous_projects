import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpstaffComponent } from './rpstaff.component';

describe('RpstaffComponent', () => {
  let component: RpstaffComponent;
  let fixture: ComponentFixture<RpstaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpstaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
