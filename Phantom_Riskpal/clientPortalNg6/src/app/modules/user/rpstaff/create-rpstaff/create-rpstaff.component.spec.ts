import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRpstaffComponent } from './create-rpstaff.component';

describe('CreateRpstaffComponent', () => {
  let component: CreateRpstaffComponent;
  let fixture: ComponentFixture<CreateRpstaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRpstaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRpstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
