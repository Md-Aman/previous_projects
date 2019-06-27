import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLogoUploaderComponent } from './profile-logo-uploader.component';

describe('ProfileLogoUploaderComponent', () => {
  let component: ProfileLogoUploaderComponent;
  let fixture: ComponentFixture<ProfileLogoUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLogoUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLogoUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
