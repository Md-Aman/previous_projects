import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'supplier-top-menu',
  templateUrl: './supplier-top-menu.component.html',
  styleUrls: ['./supplier-top-menu.component.css']
})
export class SupplierTopMenuComponent implements OnInit {
  @Output() shareDataToParent = new EventEmitter();
  stepOrder: string = "order";
  stepCargo: string = "cargo";
  stepBuyer: string = "buyer";
  stepCustom: string = "custom";
  stepPacking: string = "packing";

  step;
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  stepFive: boolean = false;

  tabOrder() {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;    
    this.stepFive = false;
  }
  tabCargo() {
    this.stepTwo = true;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepOne = false;  
  }
  tabCustom() {
    this.stepThree = true;
    this.stepFour = false;
    this.stepFive = false;
    this.stepOne = false;  
    this.stepTwo = false;
  }
  tabBuyer() {
    this.stepFour = true;
    this.stepFive = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = false;  
  }
  tabPacking() {
    this.stepFive = true;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;
  }
  constructor() { }
  shareDataToParentOrder() {
    this.shareDataToParent.emit(this.stepOrder);
  }
  shareDataToParentCargo() {
    this.shareDataToParent.emit(this.stepCargo);
  }
  shareDataToParentBuyer() {
    this.shareDataToParent.emit(this.stepBuyer);
  }
  shareDataToParentCustom() {
    this.shareDataToParent.emit(this.stepCustom);
  }
  // shareDataToParentPacking() {
  //   this.shareDataToParent.emit(this.stepPacking);
  // }

  ngOnInit() {
  }

}
