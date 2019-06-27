import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'admin-quotation-top-menu',
  templateUrl: './admin-quotation-top-menu.component.html',
  styleUrls: ['./admin-quotation-top-menu.component.css']
})
export class AdminQuotationTopMenuComponent implements OnInit {

  @Output() shareDataToParent = new EventEmitter();
  
  stepQuotation: string = "quotation";
  stepNotification: string = "notification";

  step;
  stepOne: boolean = true;
  stepTwo: boolean = false;

  tabQuotation() {
    this.stepOne = true;
    this.stepTwo = false;
  }
  tabNotification() {
    this.stepTwo = true;
    this.stepOne = false;  
  }
  constructor() { }

  shareDataToParentQuotation() {
    this.shareDataToParent.emit(this.stepQuotation);
  }
  shareDataToParentNotification() {
    this.shareDataToParent.emit(this.stepNotification);
  }

  ngOnInit() {
  }

}
