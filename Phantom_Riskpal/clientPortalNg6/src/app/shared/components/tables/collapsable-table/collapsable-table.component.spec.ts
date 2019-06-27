import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsableTableComponent } from './collapsable-table.component';

describe('CollapsableTableComponent', () => {
  let component: CollapsableTableComponent;
  let fixture: ComponentFixture<CollapsableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapsableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
