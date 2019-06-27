
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AdminApiService } from "../../services/admin-api.service";
import { SessionStorage } from '../../../models/session-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-order-country-list',
  templateUrl: './admin-order-country-list.component.html',
  styleUrls: ['./admin-order-country-list.component.css']
})
export class AdminOrderCountryListComponent implements OnInit {
  @Output() shareRouteTabToFirstFilter = new EventEmitter();
  @Output() shareCountryTabToAdminOrderList = new EventEmitter();
  
  session = new SessionStorage(); //instance for session
  // sessionDetails: any[];
  rawJsonCountry: any[];
  selected: String;
  countryList;
  adminOrderList;
  adminOrderLists;
  selectedIndex;
  selectedRoute: string;
  displayCountryName: boolean = false;
  isToggle: boolean = false;
  routeTabChanged: boolean = false;
  // isSessionExpired: any[];
  routeList;
  selectedCountry;
  firstCountry;
  
  constructor(private service:AdminApiService, private router: Router) { }

  ngOnInit() {
    //get list of country
    this.service.getAdminCountryByQT(this.session.loginID,this.session.sessionID)
    .subscribe( getCountryInfo => {
      this.countryList = getCountryInfo;
      this.firstCountry = this.countryList[0].country_code_dep_name;

      // get list of route based on selected country
    this.service.getAdminRoutesByCountry(this.session.loginID,this.session.sessionID, this.firstCountry)
      .subscribe( getCountryInfo => {
        this.routeList = getCountryInfo;
        this.selectedCountry = this.routeList[0].country_code; //set first array as selected country
        this.selectedIndex = this.selectedCountry;
        this.displayCountryName = true;
        this.shareDataToAdminFirstFilter(this.routeList[0]) //call function by passing first array
      });
    });
  }

  //share selected route id to admin first filter component
  shareDataToAdminFirstFilter(route) {
    console.log('route', route);
    this.selected = route.country_code; //assign selected route id to selected var
    this.shareRouteTabToFirstFilter.emit(this.selected);
    route.active = !route.active;
  }

  // get list of routes based on selected country
  onClickSelectedCountry(country){
    this.selectedCountry = country;
    this.service.getAdminRoutesByCountry(this.session.loginID,this.session.sessionID, this.selectedCountry)
      .subscribe( getCountryInfo => {
        this.routeList = getCountryInfo;
        this.selectedCountry = this.routeList[0].country_code; //set first array as selected country
        this.selectedIndex = this.selectedCountry;
        this.displayCountryName = true;
        this.shareDataToAdminFirstFilter(this.routeList[0]) //call function by passing first array
      });
  }

  onClickSelectedRoutes(clickedRoute) {
    this.routeTabChanged = (this.selectedCountry != clickedRoute);
    if (this.selectedCountry != clickedRoute) {
      this.selectedCountry = clickedRoute;
    }
    this.shareCountryTabToAdminOrderList.emit(this.routeTabChanged);
    console.log (this.routeTabChanged);
    this.selectedIndex = clickedRoute;
  }
}

