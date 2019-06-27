import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchboxNavbarComponent } from './searchbox-navbar.component';

describe('SearchboxNavbarComponent', () => {
  let component: SearchboxNavbarComponent;
  let fixture: ComponentFixture<SearchboxNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchboxNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchboxNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
