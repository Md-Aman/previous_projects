import { Component, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { MatDialogRef } from "@angular/material";
import { SharedService } from "../../shared/services/shared.service";
import { CustomerApiService } from "./../../customer/services/customer-api.service";
import { SessionStorage } from "./../../models/session-storage";
import { Constants } from "@app/modules/util/constants";

// import { Injectable } from '@angular/core';
@Component({
  selector: "app-view-booking",
  templateUrl: "./view-booking.component.html",
  styleUrls: ["./view-booking.component.css"]
})

// @Injectable()
export class ViewBookingComponent {
  //Create instance of SessionStorage
  session = new SessionStorage();
  booking_details: string;
  bookingDetailsWizard: string = "isStepConsignor";
  customerDetails: any[];
  customerLoginDetails: any[];

  view_booking_details: any[];
  
  customerName: string;
  halalStatus: string;
  bookingDetails: any;

  //for payment
  partAPerCbm: string;
  
  constructor(
    private dialogRef: MatDialogRef<ViewBookingComponent>,
    private sharedService: SharedService,
    private customerApiService: CustomerApiService
  ) {}

  onCloseCancel() {
    this.dialogRef.close();
  }

  onClickWizard(bookingDetailsWizard) {
    this.bookingDetailsWizard = bookingDetailsWizard;
  }

  ngOnInit() {
    this.sharedService
      .viewBooking(
        this.session.loginID,
        this.session.sessionID,
        this.sharedService.orderId
      )
      .subscribe(booking_details => {
        this.bookingDetails = booking_details;
        
        if (booking_details.halal_status === "H") {
          this.halalStatus = "Halal";
          this.bookingDetails['warehouse_departure_address']=booking_details.halal_consolidation;
          this.bookingDetails['warehouse_arrival_address']=booking_details.halal_unstuffing;
        } else {
          this.halalStatus = "Non-Halal";
          this.bookingDetails['warehouse_departure_address']=booking_details.consolidation;
          this.bookingDetails['warehouse_arrival_address']=booking_details.unstuffing;
        }

        this.bookingDetails['consignee_commercial_value']=Constants.formatter.format(Number(booking_details.consignee_commercial_value));
        this.bookingDetails['consignee_merchandise_value']=Constants.formatter.format(Number(booking_details.consignee_merchandise_value));
        this.bookingDetails['consignor_commercial_value']=Constants.formatter.format(Number(booking_details.consignor_commercial_value));
        this.bookingDetails['consignor_merchandise_value']=Constants.formatter.format(Number(booking_details.consignor_merchandise_value));

        this.partAPerCbm = Constants.formatter.format(Number(booking_details.booking_price_a / booking_details.cbm));
        this.bookingDetails['booking_price_a']=Constants.formatter.format(Number(booking_details.booking_price_a));
        this.bookingDetails['booking_price_bd']=Constants.formatter.format(Number(booking_details.booking_price_bd));
        this.bookingDetails['booking_price_ba']=Constants.formatter.format(Number(booking_details.booking_price_ba));
        this.bookingDetails['booking_price_gst']=Constants.formatter.format(Number(booking_details.booking_price_gst));
        this.bookingDetails['booking_price_total']=Constants.formatter.format(Number(booking_details.booking_price_total));
        
      });
  }
}
