import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAccessComponent } from './booking-access.component';

describe('BookingAccessComponent', () => {
  let component: BookingAccessComponent;
  let fixture: ComponentFixture<BookingAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
