import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUnapprovedPopupComponent } from './profile-unapproved-popup.component';

describe('ProfileUnapprovedPopupComponent', () => {
  let component: ProfileUnapprovedPopupComponent;
  let fixture: ComponentFixture<ProfileUnapprovedPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUnapprovedPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUnapprovedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
