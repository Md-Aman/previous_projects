import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'custom-agent-hswiki-page',
  templateUrl: './custom-agent-hswiki-page.component.html',
  styleUrls: ['./custom-agent-hswiki-page.component.css']
})
export class CustomAgentHswikiPageComponent implements OnInit {

  isSideBarOpen: boolean = true;
  constructor() { }
  isOpen: boolean = true;

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }
  
  ngOnInit() {
  }

}
