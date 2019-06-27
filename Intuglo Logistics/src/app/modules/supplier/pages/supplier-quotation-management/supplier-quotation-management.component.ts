import { SupplierApiService } from './../../services/supplier-api.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierQuotationCountryFilterComponent } from '../../components/supplier-quotation-country-filter/supplier-quotation-country-filter.component';
import {SharedService} from '@shared/services/shared.service';
@Component({
  selector: 'supplier-quotation-management',
  templateUrl: './supplier-quotation-management.component.html',
  styleUrls: ['./supplier-quotation-management.component.css']
})
export class SupplierQuotationManagementComponent implements OnInit {

  isSideBarOpen: boolean = true;
  step: string = "modify";
  selectedCountry;
  isCheckedBooking : boolean = false;
  // supplierDetails;
  countryTabChanged : boolean;
  displayActionButtons: boolean;
  filterVesselFromQuotation;
  quotationId;
  countryId;
  quotationStatus: string;
  isOpen: boolean = true;

  @ViewChild(SupplierQuotationCountryFilterComponent) quatationList: SupplierQuotationCountryFilterComponent;
  constructor(private service:SupplierApiService, private sharedService: SharedService) {
    // getting supplier session from login
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"));
  }

  receiveDataFromHeader(toggle) {
    this.isSideBarOpen = toggle;
  }
  receiveDataFromChild(data) {
    this.step = data;
  }
  receiveCheckBoxBooleanValueFromSupplierQuotationBooking(data){
    this.isCheckedBooking = data;
  }
  getQuotationStatus(status) {
    this.quotationStatus = status;
  }
  receiveQuotationId(q_id)
  {
    this.quotationId = q_id;
  }

  // receiveDataFromCountryFilter(countryFilter) {
  //   this.selectedCountry = countryFilter;
  // }

  receiveCountryTabFromSupplierQuotationCountryFilter(countryTab){
    this.countryTabChanged = countryTab;
    this.displayActionButtons = !this.countryTabChanged && this.isCheckedBooking ;
   }

   receiveCountryId(countryId){
    this.countryId = countryId;
   }

   receiveVesselInfo(filterVessel){
     this.filterVesselFromQuotation = filterVessel;
    //  this.filterVesselFromQuotation = filterVessel.Vessel;
   }

  //  Please add component if you are passing toggle data to here (dashboard) from another component
  //  customer navbar , 
  //  customer country filter

   receiveToggleValue(toggle){
    this.isSideBarOpen = toggle;
   }
   getQuotationsCountryList() {
      this.quatationList.getQuotationsCountryList();
   }
  ngOnInit() {
    this.sharedService.currentMessage.subscribe(data => {
      if ( data.event == 'supplierActionButtonCheckBoxStatus' ) {
        this.isCheckedBooking = data.status;
      }
    })
  }

}