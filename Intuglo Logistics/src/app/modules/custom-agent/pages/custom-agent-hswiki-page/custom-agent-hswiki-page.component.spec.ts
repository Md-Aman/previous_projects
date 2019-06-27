import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentHswikiPageComponent } from './custom-agent-hswiki-page.component';

describe('CustomAgentHswikiPageComponent', () => {
  let component: CustomAgentHswikiPageComponent;
  let fixture: ComponentFixture<CustomAgentHswikiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentHswikiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentHswikiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
