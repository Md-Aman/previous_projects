import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SupplierApiService } from '../../services/supplier-api.service';
import { SharedService } from './../../../shared/services/shared.service';
import { SessionStorage } from '../../../models/session-storage';
import { MatDialog } from '@angular/material';
import { ProfileUnapprovedPopupComponent } from './../../../shared/components/profile-unapproved-popup/profile-unapproved-popup.component';

@Component({
  selector: 'supplier-new-quotation',
  templateUrl: './supplier-new-quotation.component.html',
  styleUrls: ['./supplier-new-quotation.component.css']
})
export class SupplierNewQuotationComponent implements OnInit {

  //Create instance of SessionStorage
  session = new SessionStorage();

  isSideBarOpen: boolean = true;
  step: string = "publish";
  isCheckedBooking: boolean = false;
  isOpen:boolean = true;
  // supplierDetails

  constructor(private service: SupplierApiService, private router: Router, private sharedService: SharedService, private dialog: MatDialog) {
    // getting supplier session from login
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"));
  }

  receiveDataFromHeader(toggle) {
    this.isSideBarOpen = toggle;
  }

  ngOnInit() {
    this.sharedService.checkProfilePermission(this.session.loginID, this.session.sessionID)
      .subscribe(getBookingInfo => {
        console.log('getbookinginfo', getBookingInfo);
        
        if ( getBookingInfo.verified_user ) {
          this.router.navigateByUrl("/supplier/newquotation");
        } else {
          this.unapprovedPopup();
        }
       
      }, error => {
        this.unapprovedPopup('error');
      });
  }
  unapprovedPopup(type = 'success') {
   
      this.sharedService.profilePermissionFlag = "supplier";
      this.router.navigateByUrl("/supplier/profile");
      if ( type != 'error' ) 
        this.dialog.open(ProfileUnapprovedPopupComponent);
   
    
  }
}