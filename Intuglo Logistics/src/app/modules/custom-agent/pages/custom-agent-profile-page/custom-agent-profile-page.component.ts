import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'custom-agent-profile-page',
  templateUrl: './custom-agent-profile-page.component.html',
  styleUrls: ['./custom-agent-profile-page.component.css']
})
export class CustomAgentProfilePageComponent implements OnInit {

  isSideBarOpen: boolean = true;
  isCustomAgentName:boolean;
  LogoBool;
  constructor() { }

  ngOnInit() {
  }

  recieveLogoFromProfileLogoUploader(recieveLogo){
    
    this.LogoBool = recieveLogo;
  }

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }
  getCustomAgentNameFromCustomAgentProfile(customAgentName){
  this.isCustomAgentName = customAgentName;
  }
}
