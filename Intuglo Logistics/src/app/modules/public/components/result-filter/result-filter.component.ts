import { Component, OnInit } from '@angular/core';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { SharedService } from '@shared/services/shared.service';
@Component({
  selector: 'result-filter',
  templateUrl: './result-filter.component.html',
  styleUrls: ['./result-filter.component.css']
})

export class ResultFilterComponent implements OnInit {
  priceFilter: any;
  quotationIdFilter: any;
  incotermsFilter: any;
  logisticPartnerFilter: any;
  incoTermsCheckedList: any = [];
  
  incoTerms: any = [ {value: 'CIF', text: 'Cost, Insurance & Freight'},{value: 'FOB', text: 'Free on Board'}
    , {value: 'CFR', text: 'Cost and Freight'},{value: 'CIP', text: 'Carriage and Insurance Paid'},
   ];
  toPrice: number = 25000;
  fromPrice: number = 10;
  
  constructor(private sharedService: SharedService) { 
  }

  ngOnInit() {
    const session = JSON.parse(sessionStorage.getItem("searchbox-session"));
    console.log('sessssion', session);
  }
  priceChange(event) {
    console.log('price', event);
    this.fromPrice = event.from;
    this.toPrice = event.to;
  }
  onCheckboxChange(option, event) {
    if(event.target.checked) {
      this.incoTermsCheckedList.push(option.value);
    } else {
      for(var i=0 ; i < this.incoTerms.length; i++) {
        if(this.incoTermsCheckedList[i] == option.value){
          this.incoTermsCheckedList.splice(i,1);
        }
      }
    }
    console.log(this.incoTermsCheckedList);
  }
  submit() {
    const data = {
      event: "extraFilterRate",
      price_start: this.fromPrice,
      price_end: this.toPrice,
      quotation_id: this.quotationIdFilter,
      incoterm: this.incoTermsCheckedList.join(),
      logistic_patner: this.logisticPartnerFilter,
      filter: true
    }
    this.sharedService.changeMessage(data);
    console.log('sss', data);
  }
}