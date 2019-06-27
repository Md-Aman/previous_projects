import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SupplierApiService } from "../../services/supplier-api.service";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SessionStorage } from '../../../models/session-storage';

@Component({
  selector: 'supplier-country-filter',
  templateUrl: './supplier-country-filter.component.html',
  styleUrls: ['./supplier-country-filter.component.css']
})
export class SupplierCountryFilterComponent implements OnInit {
  @Output() shareDataToSupplierDashboard = new EventEmitter();
  @Output() shareToggleValueToDashboard = new EventEmitter();
  @Output() shareCountryTabToSupplierDashboard = new EventEmitter();
  //Create instance of SessionStorage
  session = new SessionStorage();
  supplierDetails: any[];
  sessionDetails: any[];
  rawJsonCountry: any[];
  selectedCountry: string;
  countryTabChanged: boolean = false;
  selected: String;
  selectedIndex: string;
  isToggle: boolean = false;
  isSessionExpired: any[];

  constructor(private service: SupplierApiService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    // getting supplier session from login
    // this.supplierDetails = JSON.parse(
    //   sessionStorage.getItem("supplier-session")
    // );
    // this.sessionDetails = Object.values(this.supplierDetails);

    this.service.getSupplierBookingCountryList(this.session.loginID,this.session.sessionID)
      .subscribe(getCountry => {
        this.rawJsonCountry = getCountry;
        this.selectedCountry = this.rawJsonCountry[0]["country"];
        // Emiting the first country 
        this.shareDataToSupplierDashboard.emit(this.selectedCountry);
        this.selectedIndex = this.selectedCountry;
      }
      );
  }

  shareDataToListFilter(country) {
    this.selected = country.country;
    this.shareDataToSupplierDashboard.emit(this.selected);
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
    this.shareCountryTabToSupplierDashboard.emit(this.countryTabChanged);
    this.selectedIndex = clickedCountry;
  }
}
