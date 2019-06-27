import { LoginPopupComponent } from "./../login-popup/login-popup.component";
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MatDialog } from "@angular/material";
import { BookNowComponent } from "../book-now/book-now.component";
import { UserOnboardComponent } from "../user-onboard/user-onboard.component";
import { SessionStorage } from "../../../models/session-storage";
import { SharedService } from "../../../shared/services/shared.service";
import { PublicApiService } from "./../../services/public-api.service";
import { BookingAccessComponent } from "./../booking-access/booking-access.component";

@Component({
  selector: "search-result",
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.css"]
})
export class SearchResultComponent implements OnInit {
  @Input()
  searchResult: any;
  session = new SessionStorage();
  status;

  isSessionExpired: any[];
  getBackground(halalNonHalal) {
    switch (halalNonHalal) {
      case "HALAL":
        return "green";
      case "NON-HALAL":
        return "red";
      // case 'Unassigned':
      //   return 'green';
    }
  }

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private service: PublicApiService
  ) {}

  customerDetails: any[];
  SessionDetails: any[];
  isUserOnBoarded: any;

  openDialog(
    containerId,
    total_part_a,
    total_price_arrival,
    total_price_departure,
    tax_type,
    tax_rate,
    tax_amount,
    total_price_without_tax,
    total_price_with_tax
  ) {
    this.service.booking_price_without_tax = total_price_without_tax;
    this.service.booking_price_with_tax = total_price_with_tax;
    this.service.booking_total_part_a = total_part_a;
    this.service.booking_total_price_arrival = total_price_arrival;
    this.service.booking_total_price_departure = total_price_departure;
    if (tax_type) {
      this.service.booking_tax_type = tax_type;
    } else {
      this.service.booking_tax_type = "Tax";
    }
    this.service.booking_tax_percentage = String(tax_rate);
    this.service.booking_tax_amount = String(tax_amount);
    this.service.sendQId(containerId);

    if (this.session.sessionID != null) {
      this.sharedService
        .checkUserSession(this.session.loginID, this.session.sessionID)
        .subscribe(
          status => {
            if (status == 200) {
              if (this.session.userType == 1 || this.session.userType == 3) {
                this.dialog.open(BookingAccessComponent);
              } else if (this.session.userType == 2) {
                if (this.session.isOnBoarded == 1) {
                  this.dialog.open(BookNowComponent);
                } else {
                  // if (this.session.isOnBoarded == 1) ; can be used this condition but not required
                  this.dialog.open(UserOnboardComponent);
                }
              }
            }
          },
          error => {
            if (error.status == 400) {
              this.dialog.open(LoginPopupComponent);
            }
          }
        );
    } else {
      // Can be added one more condition (==null)
      this.dialog.open(LoginPopupComponent);
    }
  }

  ngOnInit() {}
}
