import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Signup-OptionComponent } from './signup-option.component';

describe('Signup-OptionsComponent', () => {
  let component: Signup-OptionComponent;
  let fixture: ComponentFixture<Signup-OptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Signup-OptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Signup-OptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});