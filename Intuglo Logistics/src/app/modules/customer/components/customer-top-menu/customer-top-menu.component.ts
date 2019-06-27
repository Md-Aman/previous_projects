import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'customer-top-menu',
  templateUrl: './customer-top-menu.component.html',
  styleUrls: ['./customer-top-menu.component.css']
})
export class CustomerTopMenuComponent implements OnInit {
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
    this.stepOne = false;
    this.stepThree = false;
    this.stepFour = false;
  }
  tabPayment() {
    this.stepThree = true;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepFour = false;
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
