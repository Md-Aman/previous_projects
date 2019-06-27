import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'custom-agent-left-menu',
  templateUrl: './custom-agent-left-menu.component.html',
  styleUrls: ['./custom-agent-left-menu.component.css']
})
export class CustomAgentLeftMenuComponent implements OnInit {

  @Input() sideBar: boolean;  
  @Input() fromDashboard: boolean;
  @Input() fromHSwiki: boolean;
  @Input() fromCD: boolean;

  step;
  stepOne: boolean;
  stepTwo: boolean;
  stepTwoOne: boolean;
  stepThree: boolean;
  stepFour: boolean;
  stepFive: boolean;
  stepSix: boolean;
  stepSixOne: boolean;
  stepSixTwo: boolean;
  stepSeven: boolean;
  stepSevenOne: boolean;
  stepEight: boolean;
  stepEightOne: boolean;

  constructor(private router: Router) { }

  // menuOrder() {
  //   this.stepOne = true;
  //   this.stepTwo = false;
  //   this.stepTwoOne = false;
  //   this.stepThree = false;
  //   this.stepFour = false;
  //   this.stepFive = false;
  //   this.stepSix = false;
  //   this.stepSixOne = false;
  //   this.stepSixTwo = false;
  //   this.stepSeven = false;
  //   this.stepSevenOne = false;
  //   this.stepEight = false;
  //   this.stepEightOne = false;
  //   this.router.navigateByUrl("/customagent/dashboard");    
  // }

  // menuCustomDeclaration() {
  //   this.stepTwo = true;
  //   this.stepTwoOne = false;
  //   this.stepThree = false;
  //   this.stepFour = false;
  //   this.stepFive = false;
  //   this.stepSix = false;
  //   this.stepSixOne = false;
  //   this.stepSixTwo = false;
  //   this.stepSeven = false;
  //   this.stepSevenOne = false;
  //   this.stepEight = false;
  //   this.stepEightOne = false;
  //   this.stepOne = false;
  //   this.router.navigateByUrl("/customagent/declaration");  
  // }

  // menuWiki(){
  //   this.stepThree = true;
  //   this.stepFour = false;
  //   this.stepFive = false;
  //   this.stepSix = false;
  //   this.stepSixOne = false;
  //   this.stepSixTwo = false;
  //   this.stepSeven = false;
  //   this.stepSevenOne = false;
  //   this.stepEight = false;
  //   this.stepEightOne = false;
  //   this.stepOne = false;
  //   this.stepTwo = false;
  //   this.stepTwoOne = false;
  //   this.router.navigateByUrl("/customagent/hswiki");
  // }

  customAgentBooking(){
    this.router.navigateByUrl("/customagent/dashboard");
  }
  customAgentDeclaration(){
    this.router.navigateByUrl("/customagent/declaration");
  }
  HSCodeWiki(){
    this.router.navigateByUrl("/customagent/hswiki");
  }

  ngOnInit() {
  }

}
