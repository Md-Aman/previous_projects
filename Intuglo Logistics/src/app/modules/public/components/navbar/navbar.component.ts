import { Router } from '@angular/router';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { PublicApiService } from './../../services/public-api.service';
import { Subscription } from 'rxjs/Subscription';
import { SharedService } from '../../../shared/services/shared.service';
import { SessionStorage } from '../../../models/session-storage';
import { MatDialog } from '@angular/material';
// import { SessionExpiredComponent } from '../../../shared/session-expired/session-expired.component';
import { CustomerSessionExpiredDialogComponent } from '../../../customer/components/customer-session-expired-dialog/customer-session-expired-dialog.component';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  session = new SessionStorage();
  // control login and signup button variable
  login: boolean = this.login = false;
  signup: boolean = this.signup = false;
  display: boolean = false;
  moduleMenu: boolean = false;
  subMenuAbout: boolean;
  subMenuServices: boolean;
  subMenuPrograms: boolean;
  subMenuAffiliate: boolean;
  isUserAuthentication: boolean = false;
  isSignup: boolean;
  userName;
  customerDetails;
  // session: any[];
  userSession: boolean;
  customerName: string;
  subscription: Subscription;
  logo;
  isCustomer: boolean = false;
  isSupplier: boolean = false;
  isCustomAgent: boolean = false;
  isAdmin: boolean = false;


  constructor(
    private router: Router,
    private publicApiService: PublicApiService,
    private sharedService: SharedService,
    public dialog: MatDialog) {

    // subscribe username from login-popup component via public API service
    this.subscription = this.publicApiService.getUserName().subscribe(userName => {
      if (userName || this.session.userName) {
        this.customerName = userName.name;
        this.isUserAuthentication = true;
        this.userName = userName.name;
        this.isCustomer = true;
      } else {
        this.isUserAuthentication = false;
      }
    });

    if(this.session.sessionID != null){
      this.isUserAuthentication = true;
      this.userName = this.session.userName;
      if (this.session.userType == 2) {
        this.isCustomer = true;
      } else if (this.session.userType == 1) {
        this.isSupplier = true;
      } else if(this.session.userType == 3){
        this.isCustomAgent = true;
      } else if(this.session.userType == 0){
        this.isAdmin = true;
      }
    }
  }

  ngOnInit() {
    if(this.session.sessionID != null){
      if ( this.session.sessionID != null ) {
        this.sharedService.getProfileLogo(this.session.loginID, this.session.sessionID, this.session.userType)
        .subscribe(url => {
          // this.logo = '';
          this.logo = url;
        });
      }
    }
    
   
  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  switchVisibility(buttonType) {

    if (buttonType == 'login') {
      this.login = !this.login;
      this.signup = false;
    } else if (buttonType == 'signup') {
      this.signup = !this.signup;
      this.login = false;
    }
  };

  userAuthentication(customerName) {
    if (customerName.length != 0) {
      this.isUserAuthentication = true;
      this.userName = customerName;
      this.isCustomer = true;
      this.isSupplier = false;
      this.isCustomAgent = false;
      this.isAdmin = false;
    }

    this.sharedService.getProfileLogo(this.session.loginID, 
        this.session.sessionID, this.session.userType)
      .subscribe(url => {
        // this.logo = Object.values(url)[0];
        this.logo = url;
      });
  }

  sessionExpiryHome() {
    sessionStorage.clear();
    this.isUserAuthentication = !this.isUserAuthentication;
    this.login = !this.login;
    this.router.navigateByUrl("");
  }
  customerCart() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
        status => {
          if (status == 200) {
            this.router.navigateByUrl("/customer/cart");
          }
        },
        error => {
          if (error.status == 400) {
            this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
          }
        }
      );
  }
  customerDashboard() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
        status => {
          if (status == 200) {
            this.router.navigateByUrl("/customer/dashboard");
          }
        },
        error => {
          if (error.status == 400) {
            this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
          }
        }
      );
  }

  clickDropdown() {
    this.display = !this.display;
  }

  showModuleMenu() {
    this.moduleMenu = !this.moduleMenu;
    this.subMenuAbout = false;
    this.subMenuServices = false;
    this.subMenuAffiliate = false;
    this.subMenuPrograms = false;
  }
  showSubMenuAbout() {
    this.subMenuAbout = !this.subMenuAbout;
    this.moduleMenu = false;
    this.subMenuServices = false;
    this.subMenuAffiliate = false;
    this.subMenuPrograms = false;
  }
  showSubMenuServices() {
    this.subMenuServices = !this.subMenuServices;
    this.subMenuAbout = false;
    this.moduleMenu = false;
    this.subMenuAffiliate = false;
    this.subMenuPrograms = false;
  }
  showSubMenuAffiliate() {
    this.subMenuAffiliate = !this.subMenuAffiliate;
    this.subMenuAbout = false;
    this.moduleMenu = false;
    this.subMenuServices = false;
    this.subMenuPrograms = false;
  }
  showSubMenuPrograms() {
    this.subMenuPrograms = !this.subMenuPrograms;
    this.subMenuAbout = false;
    this.moduleMenu = false;
    this.subMenuServices = false;
    this.subMenuAffiliate = false;
  }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener('document:click', ['$event']) clickedOutside($event) {
    this.signup = false;
    this.login = false;
    this.display = false;
    this.moduleMenu = false;
    this.subMenuServices = false;
    this.subMenuAbout = false;
    this.subMenuAffiliate = false;
    this.subMenuPrograms = false
  }
  reloadLandingPage() {
    this.router.navigateByUrl('');
    window.location.reload();
  }
}
