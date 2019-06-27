import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'supplier-payment',
  templateUrl: './supplier-payment.component.html',
  styleUrls: ['./supplier-payment.component.css']
})
export class SupplierPaymentComponent implements OnInit {

  isSideBarOpen: boolean = true;
  selectedCountry;
  filterVesselFromQuotation;
  isOpen: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  receiveCountryId(countryId){
    this.selectedCountry = countryId;
  }

  receiveVesselInfo(filterVessel){
    this.filterVesselFromQuotation = filterVessel;
   //  this.filterVesselFromQuotation = filterVessel.Vessel;
    console.log("page", this.filterVesselFromQuotation)
  }

  receiveDataFromHeader(toggle) {
    this.isSideBarOpen = toggle;
  }

}
