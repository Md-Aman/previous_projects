import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './../../../shared/services/shared.service';
import { SessionStorage } from '../../../models/session-storage';
import { MatDialog } from '@angular/material';
import { ProfileUnapprovedPopupComponent } from './../../../shared/components/profile-unapproved-popup/profile-unapproved-popup.component';

@Component({
  selector: 'custom-agent-dashboard',
  templateUrl: './custom-agent-dashboard.component.html',
  styleUrls: ['./custom-agent-dashboard.component.css']
})
export class CustomAgentDashboardComponent implements OnInit {
  //Create instance of SessionStorage
  session = new SessionStorage();
  isSideBarOpen: boolean = true;
  selectedRoute: string;
  check: number = 1;   //hard-coded value 
  isCheckBox: boolean;
  isDocumentLength: boolean;
  isOpen: boolean = true;
  customStatus:string;


  constructor(private router: Router, private sharedService: SharedService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sharedService.checkProfilePermission(this.session.loginID, this.session.sessionID)
      .subscribe(getBookingInfo => {
        this.router.navigateByUrl("/customagent/dashboard");
      }, error => {
        this.sharedService.profilePermissionFlag = "customagent";
        this.router.navigateByUrl("/customagent/profile");
        this.dialog.open(ProfileUnapprovedPopupComponent);
      });

  }

  receiveDataFromHeader(toggle) {
    this.isSideBarOpen = toggle;
  }

  recieveDataFromCountryFilter(countryFilter) {
    this.selectedRoute = countryFilter;
  }
  getCheckboxValueAndDocLengthFromBookings(selectedCheckBoxAndDocLength) {
    console.log("custom Status Code :",  selectedCheckBoxAndDocLength);
    this.isCheckBox = selectedCheckBoxAndDocLength.isChechedCheckBox;
    this.isDocumentLength = selectedCheckBoxAndDocLength.isDocumentLength;
    this.customStatus = selectedCheckBoxAndDocLength.customStatus;
  }
  getHideButtonsFromActionButtons(actionValue){
   this.isCheckBox = actionValue;
  }

}
