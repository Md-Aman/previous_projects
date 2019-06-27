import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { SupplierApiService } from "../../../supplier/services/supplier-api.service";
import { SharedService } from "../../../shared/services/shared.service";
import { MatDialog } from "@angular/material";
import { ViewBookingComponent } from "../../../shared/view-booking/view-booking.component";
import { Subscription } from "rxjs/Subscription";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { SupplierAssignContainerComponent } from "../supplier-assign-container/supplier-assign-container.component";
import { SessionStorage } from "../../../models/session-storage";
import { SupplierSessionExpiredDialogComponent } from "../supplier-session-expired-dialog/supplier-session-expired-dialog.component";
import { Router } from "@angular/router";
import { PapaParseService } from "ngx-papaparse";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: "supplier-action-button",
  templateUrl: "./supplier-action-button.component.html",
  styleUrls: ["./supplier-action-button.component.css"]
})
export class SupplierActionButtonComponent implements OnInit {
  session = new SessionStorage();
  @Output() hideSupplierActionButtons = new EventEmitter();
  @Input() step: string;
  @Input() containerId;
  @Input() isCheckedCheckBox:boolean;
  @Input() isCheckedMasterCheckBox:boolean;

  failure_message: string = "You are not allowed to change the booking status of this booking";
  is_exist_booking: string = "Booking data doesn't exist";
  error: string = "Something happend wrong. Try again later.";
  session_expired = "It seems your session is expired! Please login and try again.";
  display_message: string;

  formatedBinary: any;
  subscription: Subscription;
  orderList = [];
  success_message: boolean = false;
  container_no;
  supplierDetails: any[];
  supplierLoginDetails: any[];
  isPopup: boolean = false;
  rawJsonError: any[];
  message: any[];
  fileUpLoadStatus: boolean;
  order_data: any[];
  order_details: any;
  // download;
  halalStatus:string;
  departureAddress:string;
  arrivalAddress:string;

  constructor(
    private supplierApiService: SupplierApiService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private papa: PapaParseService,
    private sanitizer: DomSanitizer
  ) {
    this.subscription = this.sharedService
      .getButtonCode()
      .subscribe(buttonCode => {
        this.formatedBinary = buttonCode;
      });
  }

  closePopup() {
    this.hideSupplierActionButtons.emit(false);
    this.supplierApiService.sendUpdateSupplierBooking();
  }
  openLoginAgainModal() {
    this.dialog.open(SupplierSessionExpiredDialogComponent, {
      disableClose: true
    });
  }

  destroyAllSession() {
    sessionStorage.clear();
    this.router.navigateByUrl("/");
  }

  convertCsvFile(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: results => {
          for (let i = 0; i < results.data.length; i++) {
            let order = {
              order_id: results.data[i].Order_ID,
              duties_and_tax: results.data[i].Duties_and_Taxes
            };
            this.orderList.push(order);
          }
        }
      });
    };
  }

  updateContainerNo() {
    let containerId = {
      container_id: String(this.containerId),
      container_no: this.container_no
    };
    this.supplierApiService
      .updateContainerNo(
        this.session.loginID,
        this.session.sessionID,
        containerId
      )
      .subscribe(
        status => {
          this.rawJsonError = status;
          this.success_message = true;
          this.supplierApiService.sendUpdateSupplierBooking();
          this.message = Object.values(this.rawJsonError);
        },
        error => {
          if (error.status == 400) {
            this.dialog.open(SupplierSessionExpiredDialogComponent, {
              disableClose: true
            });
          }
        }
      );
  }

  clickViewBooking() {
    this.sharedService
      .checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
        status => {
          if (status == 200) {
            this.dialog.open(ViewBookingComponent, {
              height: "600px"
            });
          }
        },
        error => {
          if (error.status == 400) {
            this.dialog.open(SupplierSessionExpiredDialogComponent, {
              disableClose: true
            });
          }
        }
      );
  }

  // Change Booking status to cargo picked up
  ChangeStatusToCargoPickedUp() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status-code": "CARGOPICKUP"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to cargo picked up";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.supplierApiService.sendUpdateSupplierBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );
  }
// Change Booking status to cargo received
  ChangeStatusToCargoReceived() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status-code": "CARGORECEIVED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to cargo received";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.supplierApiService.sendUpdateSupplierBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );
  }

  // Change Booking status to cargo shipped
  ChangeStatusToCargoShipped() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status-code": "CARGOSHIPPED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to cargo shipped";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.supplierApiService.sendUpdateSupplierBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else if (error.status == 404) {
            this.display_message = "Credit Block is not approved";
          } else {
            this.display_message = this.error;
          }
        }
      );
  }

  // Change booking status to shipment completed
  ChangeStatusToShipmentCompleted() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status-code": "SHIPMENTCOMPLETED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to shipment completed";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.supplierApiService.sendUpdateSupplierBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );
  }

// Change booking status to Container Sealed
  ChangeStatusToContainerSealed() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status-code": "CONTAINERSEALED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to container sealed";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.supplierApiService.sendUpdateSupplierBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );
  }

  // Change booking status to cargo delivered
  ChangeStatusToCargoDelivered() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status-code": "CARGODELIVERED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.display_message = "Booking Status has been changed successfully to cargo delivered";
              break;
            }
            case 202: {
              this.display_message = this.failure_message;
              break;
            }
            default: {
              this.display_message = this.error;
              break;
            }
          }
          this.supplierApiService.sendUpdateSupplierBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );
  }


// Download csv file with all the orders listed in bookings
  downloadOrderListCSV() {
    this.supplierApiService.getOrderListCSV(this.session.loginID, this.session.sessionID,this.containerId)
      .subscribe(
        getOrdersInfo => {
          var options = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            // keys: [getOrdersInfo.cargo_status_code,"bla bla"],
            headers: [
              "Company Name",
              "Email",
              "Booking Date",
              "Time of Booking Confirm",
              "Order ID",
              "Container No",
              "ETD",
              "ETA",
              "Departure Port/Terminal",
              "Arrival Port/Terminal",
              "HS Code",
              "Halal(H)/Non-Halal(N)",
              "Cargo Packing",
              "Weight",
              "CBM",
              "Tracking Number",
              "Merchant Value at Departure",
              "Merchant Value at Arrival",
              "Commercial Invoice Value at Departure",
              "Commercial Invoice Value at Arrival",
              "Booking Status",
              "Cargo Tracking Status",
              "Final Payment Amount",
              "Declaration Form",
              "Buyer Document",
              "Duties and Taxes (RM)",
              "Custom Status"
            ]
          };
          new Angular2Csv(getOrdersInfo, this.containerId, options);
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
          }
        }
      );
  }

  document_url: SafeUrl;
  downloadDocuments() {
    this.supplierApiService.downloadBuyerDocuments(this.session.loginID, this.session.sessionID, this.sharedService.orderId)
      .subscribe(
        url => {
          if (url != null) {
            window.open(url, "_blank");
            // this.document_url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            // console.log("File downloaded!",this.document_url);
            // this.download = url;
            // console.log(this.download);
            // var a = document.createElement("a");
            // console.log(Object.values(status));
            // document.body.appendChild(a);
            // window.open(this.download, "_blank");
            // a.click();
            // a.remove();
            this.display_message = "Document is downloading. Please wait for a moment"
          } else {
            this.display_message = "Document is not available"
          }
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.display_message = this.session_expired;
          } else {
            this.display_message = this.error;
          }
        }
      );
  }


 

  buttonDownloadPDF() {
    this.sharedService.getBookingPDF(this.session.loginID, this.session.sessionID, this.sharedService.orderId)
      .subscribe(
        get_order_details => {
          this.order_details = get_order_details;
          if(this.order_details.halal_status == "H"){
             this.halalStatus = "Halal";
             this.departureAddress = this.order_details.halal_consolidation;
             this.arrivalAddress = this.order_details.halal_unstuffing;

          } else{
             this.halalStatus = "Non-Halal";
             this.departureAddress = this.order_details.consolidation;
             this.arrivalAddress = this.order_details.unstuffing;
          }

          pdfMake.vfs = pdfFonts.pdfMake.vfs;
          var dd = {
            pageSize: 'A4',

            content: [
              // { text: 'Intuglo Logistics', bold: true, fontSize: 22, times: true, alignment: 'center' },
              { text: 'Order Booking Confirmation', bold: true, fontSize: 16, alignment: 'center', margin: [0, 0, 0, 40] },

              {
                fontSize: 10, columns: [
                  { width: 50, bold: true, text: 'Order ID : ' },
                  { width: 150, bold: true, text: this.sharedService.orderId },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 0]
              },

              { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 500 - 10, y2: 10, lineWidth: 0.5, color: '#ff981c' }] },

              {
                fontSize: 10, columns: [
                  { width: 50, bold: true, text: 'Section A : ' },
                  { width: 100, bold: true, text: 'Consignors Details' },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 10, 0, 10]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Company Name' },
                  { width: 110, text: this.order_details.consignor_company_name }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Contact Person' },
                  { width: 110, text: this.order_details.consignor_contact_person },
                  { width: 110, bold: true, text: 'Shipper ' },
                  { width: 110, text: this.order_details.consignor_shipper}
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },


              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Contact Number ' },
                  { width: 110, text: this.order_details.consignor_contact_number },
                  { width: 110, bold: true, text: 'Email ' },
                  { width: 110, text: this.order_details.consignor_email }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Merchandise Value' },
                  { width: 110, text: this.order_details.consignor_merchandise_value },
                  { width: 110, bold: true, text: 'Commercial Value' },
                  { width: 110, text: this.order_details.consignor_commercial_value }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Billing Address ' },
                  { width: 110, text: this.order_details.consignor_billing_address },
                  { width: 110, bold: true, text: 'Ship/Deliver to Address ' },
                  { width: 110, text: this.order_details.consignor_delivery_address },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },
              //Section B
              {
                fontSize: 10, columns: [
                  { width: 50, bold: true, text: 'Section B : ' },
                  { width: 100, bold: true, text: 'Consignees Details' },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 10, 0, 10]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Company Name ' },
                  { width: 110, text: this.order_details.consignee_company_name }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Contact Person ' },
                  { width: 110, text: this.order_details.consignee_contact_person },
                  { width: 110, bold: true, text: 'Shipper ' },
                  { width: 110, text: this.order_details.consignee_shipper }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },


              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Contact Number ' },
                  { width: 110, text: this.order_details.consignee_contact_number },
                  { width: 110, bold: true, text: 'Email ' },
                  { width: 110, text: this.order_details.consignee_email }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Merchandise Value' },
                  { width: 110, text: this.order_details.consignee_merchandise_value },
                  { width: 110, bold: true, text: 'Commercial Value' },
                  { width: 110, text: this.order_details.consignee_commercial_value }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Billing Address ' },
                  { width: 110, text: this.order_details.consignee_billing_address },
                  { width: 110, bold: true, text: 'Ship/Deliver to Address ' },
                  { width: 110, text: this.order_details.consignee_delivery_address },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },
              //Section C
              {
                fontSize: 10, columns: [
                  { width: 50, bold: true, text: 'Section C : ' },
                  { width: 100, bold: true, text: 'Shipment Details' },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 10, 0, 10]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Quotation Id ' },
                  { width: 110, text: this.order_details.quotation_id },
                  { width: 110, bold: true, text: 'Logistic Company' },
                  { width: 110, text: this.order_details.company_name }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'ETD ' },
                  { width: 110, text: this.order_details.departure_date },
                  { width: 110, bold: true, text: 'ETA' },
                  { width: 110, text: this.order_details.arrival_date }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },


              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Departure Address' },
                  { width: 110, text: this.departureAddress },
                  { width: 110, bold: true, text: 'Arrival Address ' },
                  { width: 110, text: this.arrivalAddress },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Logistic Provider' },
                  { width: 110, text: this.order_details.logistic_provider },
                  { width: 110, bold: true, text: 'Vessel/Flight No. ' },
                  { width: 110, text: this.order_details.vessel }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Customer Broker' },
                  { width: 110, text: this.order_details.custom_broker },
                  { width: 110, bold: true, text: 'Bill of Lading' },
                  { width: 110, text: this.order_details.bill_of_loading },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Departure Address' },
                  { width: 110, text: this.order_details.port_from },
                  { width: 110, bold: true, text: 'Arrival Address ' },
                  { width: 110, text: this.order_details.port_to },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },
              //Section D
              {
                fontSize: 10, columns: [
                  { width: 50, bold: true, text: 'Section D : ' },
                  { width: 100, bold: true, text: 'Cargo Details' },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 10, 0, 10]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: '6 Digit HS code ' },
                  { width: 110, text: this.order_details.hs_code_id },
                  { width: 110, bold: true, text: 'Last 4 Digit HS code ' },
                  { width: 110, text: this.order_details.four_digit_hs_code }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Cargo Description ' },
                  { width: 110, text: this.order_details.cargo_description},

                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },


              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Estimated CBM' },
                  { width: 110, text: this.order_details.cbm },
                  { width: 110, bold: true, text: 'Estimated Weight ' },
                  { width: 110, text: this.order_details.weight }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Packing Details' },
                  { width: 110, text: this.order_details.packing_type_description },
                  { width: 110, bold: true, text: 'Quantity' },
                  { width: 110, text: this.order_details.quantity }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Halal/Non-Halal' },
                  { width: 110, text: this.halalStatus },
                  { width: 110, bold: true, text: 'Tracking Number' },
                  { width: 110, text: this.order_details.tracking_number },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },
              {
                fontSize: 10, columns: [
                  { width: 50, bold: true, color: 'red', text: 'NOTE: ' },
                  { width: 450, bold: true, italics: true, text: 'Pallet height should not exceed a maximum of 1.2meter from floor up.' },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 10, 0, 10]
              },

              {
                fontSize: 10, columns: [
                  { width: 80, bold: true, pageBreak: 'before', text: 'Section E : ', style: 'sectionHeader' },
                  { width: 100, bold: true, pageBreak: 'before', text: 'Order Details', style: 'sectionHeader' },
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 10, 0, 10]
              },

              // {
              //   type: 'ellipse',
              //   x: 150, y: 140,
              //   color: 'red',
              //   fillOpacity: 0.5,
              //   r1: 80, r2: 60
              // },

              {
                style: 'tableExample',
                table: {
                  // fontSize: 12,
                  // widths: [ '*', '*',  '*', '*'],
                  body: [
                    [{ text: 'Description', style: 'tableHeader' }, { text: 'Unit', style: 'tableHeader' }, { text: 'Price Per Unit', style: 'tableHeader' }, { text: 'Total', style: 'tableHeader' }],
                    ['Sea Freight Rate (CBM)', this.order_details.cbm, "RM"+this.order_details.booking_price_a/this.order_details.cbm, 'RM' +this.order_details.booking_price_a],
                    ['Document Charges at Departure Port ('+this.order_details.port_from +')', '1',"RM" + this.order_details.booking_price_bd, "RM" +this.order_details.booking_price_bd ],
                    ['Document Charges at Arrival Port ('+this.order_details.port_to +')', '1', "RM" + this.order_details.booking_price_ba, "RM" + this.order_details.booking_price_ba],
                    [{
                      border: [false, false, false, false],
                      text: ''
                    },
                    {
                      border: [false, false, false, false],
                      fillColor: '#eeeeee',
                      text: this.order_details.booking_fee_tax_type, style: 'tableHeader'
                    },
                    {
                      border: [false, false, false, false],
                      fillColor: '#eeeeee',
                      text:this.order_details.booking_fee_tax_rate+'%', style: 'tableHeader'
                    },
                    {
                      border: [false, false, false, false],
                      text: 'RM' +((parseFloat(this.order_details.booking_fee_tax_rate) * (parseFloat(this.order_details.booking_price_a)+parseFloat(this.order_details.booking_price_bd)+parseFloat(this.order_details.booking_price_ba)))/100).toFixed(2) 
                    }
                    ],
                    [{
                      border: [false, false, false, false],
                      text: ''
                    },
                    {
                      border: [false, false, false, false],
                      fillColor: '#eeeeee',
                      fontSize: 11,
                      text: 'Freight Logistic', style: 'tableHeader'
                    },
                    {
                      border: [false, false, false, false],
                      fillColor: '#eeeeee',
                      text: '', style: 'tableHeader'
                    },
                    {
                      border: [false, false, false, false],
                      fillColor: '#eeeeee',
                      text: 'RM' +((parseFloat(this.order_details.booking_price_a)+parseFloat(this.order_details.booking_price_bd)+parseFloat(this.order_details.booking_price_ba)) + ((parseFloat(this.order_details.booking_fee_tax_rate) * (parseFloat(this.order_details.booking_price_a)+parseFloat(this.order_details.booking_price_bd)+parseFloat(this.order_details.booking_price_ba)))/100)).toFixed(2)
                       , style: 'tableHeader'
                    }
                    ]
                  ]
                },
                layout: {
                  fillColor: function (i, node) {
                    return (i === 0) ? '#CCCCCC' : null;
                  }
                }
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
              },
              subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
              },
              tableExample: {
                margin: [0, 5, 0, 15]
              },
              tableHeader: {
                bold: true,
                fontSize: 12,
                color: 'black',
                alignment: 'center'
              },
              sectionHeader: {
                bold: true,
                fontSize: 12
              }
            },
          };
          pdfMake.createPdf(dd).download('Booking Form');
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
          }
        }
      );
  }
ngOnChnages(){
}
  ngOnInit() { }
}
