import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentHswikiListComponent } from './custom-agent-hswiki-list.component';

describe('CustomAgentHswikiListComponent', () => {
  let component: CustomAgentHswikiListComponent;
  let fixture: ComponentFixture<CustomAgentHswikiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentHswikiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentHswikiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
