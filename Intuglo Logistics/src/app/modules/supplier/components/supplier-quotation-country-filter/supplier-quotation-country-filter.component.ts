import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SupplierApiService } from "../../services/supplier-api.service";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SessionStorage } from '../../../models/session-storage';
@Component({
  selector: 'supplier-quotation-country-filter',
  templateUrl: './supplier-quotation-country-filter.component.html',
  styleUrls: ['./supplier-quotation-country-filter.component.css']
})
export class SupplierQuotationCountryFilterComponent implements OnInit {
  @Output() shareDataToSupplierQuotation = new EventEmitter();
  @Output() shareToggleValueToDashboard = new EventEmitter();
  @Output() shareCountryTabToQuotationManagement = new EventEmitter();
  supplierDetails: any[];
  sessionDetails: any[];
  rawJsonCountry: any[];
  selectedCountry: string;
  countryTabChanged: boolean = false;
  selected: String;
  selectedIndex: string;
  isToggle: boolean = false;
  isSessionExpired: any[];
  session = new SessionStorage();   //Create instance of SessionStorage
  constructor(private service: SupplierApiService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    // getting supplier session from login
    // this.supplierDetails = JSON.parse(
    //   sessionStorage.getItem("supplier-session")
    // );
    // this.sessionDetails = Object.values(this.supplierDetails);
    this.getQuotationsCountryList();
     
  }
  getQuotationsCountryList() {
    this.service.getQuotationCountryList(this.session.loginID,this.session.sessionID)
    .subscribe(getCountry => {
      this.rawJsonCountry = getCountry;
      this.selectedCountry = this.rawJsonCountry[0]["country"];
      // // Emiting the first country 
      this.shareDataToSupplierQuotation.emit(this.selectedCountry);
      this.selectedIndex = this.selectedCountry;
    });  
  }
  shareDataToListFilter(country) {
    this.selected = country.country;
    this.shareDataToSupplierQuotation.emit(this.selected);
    country.active = !country.active;

    if (this.service.sessionExpired != false) {
      // this.dialog.open(SessionExpiredComponent,{disableClose: true});
      this.shareToggleValueToDashboard.emit(this.isToggle);
    }
  }

  onClickSelectedCountry(clickedCountry) {
    this.countryTabChanged = (this.selectedCountry != clickedCountry);
    if (this.selectedCountry != clickedCountry) {
      this.selectedCountry = clickedCountry;
    }
    this.shareCountryTabToQuotationManagement.emit(this.countryTabChanged);
    this.selectedIndex = clickedCountry;
  }

}