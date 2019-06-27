import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'supplier-quotation-top-menu',
  templateUrl: './supplier-quotation-top-menu.component.html',
  styleUrls: ['./supplier-quotation-top-menu.component.css']
})
export class SupplierQuotationTopMenuComponent implements OnInit {

  @Output() shareDataToParent = new EventEmitter();
  stepPublish: string = "publish";
  stepModify: string = "modify";
  stepQuotation: string = "quotation";

  step;
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;

  tabPublish() {
    this.stepOne = false;
    this.stepTwo = true;
    this.stepThree = false;
  }
  tabModify() {
    this.stepTwo = false;
    this.stepThree = false;
    this.stepOne = true;  
  }
  tabQuotation() {
    this.stepThree = true;
    this.stepOne = false;  
    this.stepTwo = false;
  }
  constructor() { }
  shareDataToParentPublish() {
    this.shareDataToParent.emit(this.stepPublish);
  }
  shareDataToParentModify() {
    this.shareDataToParent.emit(this.stepModify);
  }
  shareDataToParentQuotation() {
    this.shareDataToParent.emit(this.stepQuotation);
  }

  ngOnInit() {
  }

}
