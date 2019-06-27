import { Component, OnInit, Output, Input, EventEmitter, HostListener } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { SupplierSessionExpiredDialogComponent } from '../supplier-session-expired-dialog/supplier-session-expired-dialog.component';
import { SessionStorage } from '../../../models/session-storage';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'supplier-navbar',
  templateUrl: './supplier-navbar.component.html',
  styleUrls: ['./supplier-navbar.component.css']
})
export class SupplierNavbarComponent implements OnInit {
  session = new SessionStorage();
  display: boolean = false;
  logisticMenu: boolean = false;
  userName;
  logo;
  @Input() Logo: boolean;
  @Input() supplierName: boolean;

  @Output() controlSideBar = new EventEmitter()
  isToggle: boolean = true;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public dialog: MatDialog) { }


  ngOnChanges() {
    if (this.Logo) {
      this.getProfilePicture();
    }
    if (this.supplierName) {
      this.userName = this.session.userName;
    }
  }
  ngOnInit() {
    this.getProfilePicture();
  }
  getProfilePicture() {
    this.userName = this.session.userName;
    this.sharedService.getProfileLogo(this.session.loginID, this.session.sessionID, this.session.userType)
      .subscribe(url => {
        this.logo = '';
        this.logo = url;
      });
  }

  supplierDashboard() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/supplier/dashboard");
        }
      },
      error => {
        if (error.status == 400) {
          this.dialog.open(SupplierSessionExpiredDialogComponent, { disableClose: true });
        }
      }
      );
  }

  supplierProfile() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/supplier/profile");
        }
      },
      error => {
        if (error.status == 400) {
          this.dialog.open(SupplierSessionExpiredDialogComponent, { disableClose: true });
        }
      }
      );
  }

  supplierLandingPage() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
      status => {
        if (status == 200) {
          this.router.navigateByUrl("/");
        }
      },
      error => {
        if (error.status == 400) {
          this.dialog.open(SupplierSessionExpiredDialogComponent, { disableClose: true });
        }
      }
      );
  }

  toggleSideBar() {
    this.isToggle = !this.isToggle;
    this.controlSideBar.emit(this.isToggle);
  }

  clickDropdown() {
    this.display = !this.display;
  }

  clickLogisticMenu() {
    this.logisticMenu = !this.logisticMenu;
  }

  sessionExpiry() {
    this.router.navigateByUrl("/");
    sessionStorage.clear();
  }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener('document:click', ['event']) clickedOutside($event) {
    this.display = false;
  }

}
