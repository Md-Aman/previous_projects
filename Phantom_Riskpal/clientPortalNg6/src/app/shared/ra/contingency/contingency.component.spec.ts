import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContingencyComponent } from './contingency.component';

describe('ContingencyComponent', () => {
  let component: ContingencyComponent;
  let fixture: ComponentFixture<ContingencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContingencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
