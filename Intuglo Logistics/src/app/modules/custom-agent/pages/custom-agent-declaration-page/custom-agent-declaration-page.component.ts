import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'custom-agent-declaration-page',
  templateUrl: './custom-agent-declaration-page.component.html',
  styleUrls: ['./custom-agent-declaration-page.component.css']
})
export class CustomAgentDeclarationPageComponent implements OnInit {

  isSideBarOpen: boolean = true;
  constructor() { }
  isOpen: boolean = true;

  ngOnInit() {
  }

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }

}
