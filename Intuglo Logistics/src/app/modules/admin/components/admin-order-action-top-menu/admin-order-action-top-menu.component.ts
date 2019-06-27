import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'admin-order-action-top-menu',
  templateUrl: './admin-order-action-top-menu.component.html',
  styleUrls: ['./admin-order-action-top-menu.component.css']
})
export class AdminOrderActionTopMenuComponent implements OnInit {

  @Output() shareDataToAdminOrderActionButton = new EventEmitter();
  
  stepBooking: string = "booking";
  stepCargo: string = "cargo";
  stepPayment: string = "payment";

  step;
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;

  tabBooking() {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepThree = false;
  }
  tabCargo() {
    this.stepTwo = true;
    this.stepThree = false;
    this.stepOne = false;  
  }
  tabPayment() {
    this.stepThree = true;
    this.stepOne = false;  
    this.stepTwo = false;
  }
  constructor() { }

  shareDataToParentBooking() {
    this.shareDataToAdminOrderActionButton.emit(this.stepBooking);
  }
  shareDataToParentCargo() {
    this.shareDataToAdminOrderActionButton.emit(this.stepCargo);
  }
  shareDataToParentPayment() {
    this.shareDataToAdminOrderActionButton.emit(this.stepPayment);
  }

  ngOnInit() {
  }

}
