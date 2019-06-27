import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPlatformComponent } from './multi-platform.component';

describe('MultiPlatformComponent', () => {
  let component: MultiPlatformComponent;
  let fixture: ComponentFixture<MultiPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
