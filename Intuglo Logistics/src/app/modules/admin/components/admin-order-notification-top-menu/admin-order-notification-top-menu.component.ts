import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'admin-order-notification-top-menu',
  templateUrl: './admin-order-notification-top-menu.component.html',
  styleUrls: ['./admin-order-notification-top-menu.component.css']
})
export class AdminOrderNotificationTopMenuComponent implements OnInit {

  @Output() shareDataToParent = new EventEmitter();
  stepBooking: string = "booking";
  stepCargo: string = "cargo";
  stepPayment: string = "payment";
  stepCustom: string = "custom";

  step;
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;

  tabBooking() {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;    
  }
  tabCargo() {
    this.stepTwo = true;
    this.stepThree = false;
    this.stepFour = false;
    this.stepOne = false;  
  }
  tabPayment() {
    this.stepThree = true;
    this.stepFour = false;
    this.stepOne = false;  
    this.stepTwo = false;
  }
  tabCustom() {
    this.stepFour = true;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = false;  
  }
  constructor() { }
  shareDataToParentBooking() {
    this.shareDataToParent.emit(this.stepBooking);
  }
  shareDataToParentCargo() {
    this.shareDataToParent.emit(this.stepCargo);
  }
  shareDataToParentPayment() {
    this.shareDataToParent.emit(this.stepPayment);
  }
  shareDataToParentCustom() {
    this.shareDataToParent.emit(this.stepCustom);
  }

  ngOnInit() {
  }

}
