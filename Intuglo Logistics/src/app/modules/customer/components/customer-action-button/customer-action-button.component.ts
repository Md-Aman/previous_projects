import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CustomerApiService } from './../../services/customer-api.service';
import { SharedService } from '../../../shared/services/shared.service';
import { MatDialog } from '@angular/material';
import { ViewBookingComponent } from '../../../shared/view-booking/view-booking.component';
import { Subscription } from 'rxjs/Subscription';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CustomerSessionExpiredDialogComponent } from '../customer-session-expired-dialog/customer-session-expired-dialog.component';
import { Router } from '@angular/router';
import { SessionStorage } from '../../../models/session-storage';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PackingListComponent } from './../packing-list/packing-list.component'
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import {of} from "rxjs/observable/of";
import {environment} from '@env/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'customer-action-button',
  templateUrl: './customer-action-button.component.html',
  styleUrls: ['./customer-action-button.component.css']
})
export class CustomerActionButtonComponent  {

  //Create instance of SessionStorage
  session = new SessionStorage();
  @Input() step: string;
  @Input() orderStatus: string;
  @Output() hideCustomerActionButtons = new EventEmitter();
  public loading = false;


  // http 202
  failure_message: string = "You are not allowed to change the booking status of this booking";
  error: string = "Something happend wrong. Try again later.";
  // http 401
  session_expired = "It seems your session is expired! Please login and try again.";


  order_detials_from_db: any[];
  order_details: any;
  formatedBinary: any;
  date = "27-03-2018";
  customerDetails: any[];
  customerLoginDetails: any[];
  isPopup: boolean = false;
  view_booking_details: any[];
  get_booking_details: any[];
  subscription: Subscription;
  // stepBooking: boolean = false;
  // stepCargo: boolean = false;
  // stepPayment: boolean = false;
  // stepCustom: boolean = false;
  rawJsonError: any[];
  message: string;
  foundError;
  order_data: any[];
  isUpload: boolean = true;
  quotationId;
  form: FormGroup;                  // form for create new quotation      
  formm: FormGroup;
  // doucumentDescription:string;
  documents: any;
  documentLength: boolean;

  halalStatus: string;
  departureAddress: string;
  arrivalAddress: string;
  payaplButtonShow: boolean = false;
  phoneCode: any = environment.phoneCode;
  public payPalConfig?: PayPalConfig;
  bookingDetails: any;
  orderStatusCode: any;
  paymentStatusCode: string;
  loadingPaypal: boolean = false;
  constructor(
    private customerApiService: CustomerApiService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService) {
    this.subscription = this.sharedService.getButtonCode().subscribe(buttonCode => {
      this.formatedBinary = buttonCode;
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }


  openLoginAgainModal() {
    this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
  }

  destroyAllSession() {
    sessionStorage.clear();
    this.router.navigateByUrl("/");
  }

  closePopup() {
    this.hideCustomerActionButtons.emit(false);
    this.customerApiService.sendUpdateCustomerBooking();
  }

  clickViewBooking() {
    this.sharedService.checkUserSession(this.session.loginID, this.session.sessionID)
      .subscribe(
        status => {
          if (status == 200) {
            this.dialog.open(ViewBookingComponent, {
              height: '600px'
            });
          }
        },
        error => {
          if (error.status == 400) {
            this.dialog.open(CustomerSessionExpiredDialogComponent, { disableClose: true });
          }
        }
      );
  }


  // Change booking status to cargo sent
  changeStatusToCargoSent() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": "CARGOSENT"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been changed successfully to cargo sent";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customerApiService.sendUpdateCustomerBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else if (error.status == 404) {
            this.message = "Credit Block is not approved";
          } else {
            this.message = this.error;
          }
        }
      );
  }

  // Change Booking status to cargo ready for pick up
  changeStatusToCargoReadyforPickup() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": "CARGOREADYFORPICKUP"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been changed successfully to cargo ready for pick up";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customerApiService.sendUpdateCustomerBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else if (error.status == 404) {
            this.message = "Credit Block is not approved";
          } else {
            this.message = this.error;
          }
        }
      );
  }

  // Change booking status to cancel
  changeStatusToCancel() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": "ORDERCANCELLED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been cancelled successfully";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customerApiService.sendUpdateCustomerBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else {
            this.message = this.error;
          }
        }
      );
  }


  // Change Booking status to shipment completed
  changeStatusToShipmentCompleted() {
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": "CARGODELIVERED"
    }
    this.sharedService.patchBookingStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.message = "Booking Status has been changed successfully to shipment completed";
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customerApiService.sendUpdateCustomerBooking();
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else {
            this.message = this.error;
          }
        }
      );
  }
  approveCreditBlockDetails(togglePaypalButton) {
    this.payaplButtonShow = togglePaypalButton;
    if ( this.payaplButtonShow ) {
      this.loadingPaypal = true;
      this.sharedService.viewBooking(this.session.loginID, this.session.sessionID,       this.sharedService.orderId)
      .subscribe(
        data => {
          this.bookingDetails = {
            address_line_one: data.address_line_one,
            address_line_two: data.address_line_one,
            company_name: data.consignor_company_name,
            phone: data.consignor_contact_number,
            country_code: data.country_code,
            postal_code: data.postal_code,
            total: data.booking_price_total,
            city: data.city,
            state: data.state
          };
          this.payaplButtonShow = true;
          this.initConfig();
          
          console.log('thisboooook', this.bookingDetails);
        },
        error => {
          console.log('error', error);
          this.loadingPaypal = false;
          const msg = 'There is some error, please try again later.';
          this.sharedService.toggleToaster(msg, 'error');
        }
      )
    }
    
  }
  private initConfig(): void {
        
    this.payPalConfig = new PayPalConfig(
      PayPalIntegrationType.ClientSideREST,
      PayPalEnvironment.Sandbox,
      {
        commit: true,
        client: {
          sandbox:environment.paypalClientId
        },
        button: {
          label: 'paypal',
          fundingicons: false,
          size: 'medium',
          shape: 'rect'
        },
        onAuthorize: (data, actions) => {
          console.log('Authorize');
           return of(undefined);
        },
        onPaymentComplete: (data, actions) => {
          console.log('OnPaymentComplete', data);
           actions.payment.execute().then( res =>  {
            console.log('Payment Complete!', res);
            this.approveCreditBlock(res);
          });
          console.log('actions', actions);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
          this.payaplButtonShow = false;
          const msg = "Payment cancel by user.";
          this.sharedService.toggleToaster(msg, 'error');
        },
        onError: err => {
          console.log('OnError');
          this.payaplButtonShow = false;
          const msg = 'There is some error, please try again later.';
          this.sharedService.toggleToaster(msg, 'error');
        },
        onClick: () => {
          console.log('onClick');
        },
        validate: (actions) => {
          this.loadingPaypal = false;
          console.log('action', actions);
        },
        transactions: [
          {
            amount: {
              total: this.bookingDetails.total,
              currency: 'MYR'

            },
            custom: this.sharedService.orderId,
            item_list: {
              // items: [
              //   {
              //     name: 'hat',
              //     description: 'Brown hat.',
              //     quantity: 5,
              //     price: 1,
              //     tax: 0.00,
              //     sku: '1',
              //     currency: 'MYR'
              //   },
              //   {
              //     name: 'handbag',
              //     description: 'Black handbag.',
              //     quantity: 1,
              //     price: 5,
              //     tax: 0.00,
              //     sku: 'product34',
              //     currency: 'MYR'
              //   }],
              shipping_address: {
                recipient_name: this.bookingDetails.company_name,
                line1: this.bookingDetails.address_line_one,
                line2: this.bookingDetails.address_line_two,
                city: this.bookingDetails.city,
                country_code: this.bookingDetails.country_code,
                postal_code: this.bookingDetails.postal_code,
                phone: this.phoneCode + this.bookingDetails.phone,
                state: this.bookingDetails.state
              },
            },
          }
        ],
        note_to_payer: 'Contact us if you have troubles processing payment'
      }
    );
  }
  approveCreditBlock(paymentData = {}) {
    const paymentStatus = 'CREDITBLOCKED';
    let orderDetails = {
      "order_id": this.sharedService.orderId,
      "current_order_status_code": this.sharedService.orderStatusCode,
      "current_button_code": this.sharedService.buttonCode,
      "order_status_code": paymentStatus,
      data: paymentData
    }
    this.sharedService.ChangePaymentStatus(this.session.loginID, this.session.sessionID, orderDetails)
      .subscribe(
        response => {
          switch (response.status) {
            case 200: {
              this.paymentStatusCode = paymentStatus;
              this.message = "Credit Block of this order has been approved";
              this.sharedService.toggleToaster(this.message, 'success');
              break;
            }
            case 202: {
              this.message = this.failure_message;
              break;
            }
            default: {
              this.message = this.error;
              break;
            }
          }
          this.customerApiService.sendUpdateCustomerBooking();
          this.payaplButtonShow = false;
        },
        error => {
          if (error.status == 401) {
            this.isPopup = true;
            this.message = this.session_expired;
          } else {
            this.message = this.error;
          }
        }
      );
    //download receipt
    this.sharedService.getCreditBlockReceipt(this.session.loginID, this.session.sessionID, this.sharedService.orderId)
      .subscribe(
        get_order_details => {
          this.order_details = get_order_details;
          this.order_data = Object.values(this.order_details);

          pdfMake.vfs = pdfFonts.pdfMake.vfs;

          var creditBlockReceiptPDF = {
            pageSize: 'A4',

            content: [
              {

                canvas: [
                  {
                    type: 'line', x1: 0, y1: 10, x2: 500 - (-15), y2: 10, color: '#2674f2',
                  }
                ],
                columnGap: 10,
              },
              {
                columns: [
                  {
                    // star-sized columns fill the remaining space
                    // if there's more than one star-column, available width is divided equally
                    image: 'data:image/png;base64,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',
                    fit: [100, 100],
                    margin: [0, 12, 0, 0]
                  },
                  {
                    text: 'RECEIPT', bold: false, fontSize: 24, color: 'gray', style: ['header'],
                    width: '*',
                    margin: [160, 12, 0, 0]
                  },
                ],
                // optional space between columns
                columnGap: 10,
              },
              {
                fontSize: 11, columns: [
                  {
                    width: 250, bold: true, text: 'HBG FLUXR DIGITAL SDN BHD (1208312-H)', margin: [0, 0, 0, 1],
                    color: '#424242'

                  },
                  { width: 140, margin: [60, 0, 0, 0], text: 'Receipt No.  :', color: '#424242' },
                  { text: '', margin: [15, 0, 0, 1], color: '#424242', bold: true },
                ],
                // optional space between columns
                columnGap: 5, margin: [0, 0, 0, 1]
              },

              {
                fontSize: 11, columns: [
                  {
                    width: 250, text: 'C-09-23, Centum @ Oasis Corporate park, No 2, Jln PJU 1A/2 ', margin: [0, 0, 0, 1],
                    bold: true, color: '#424242'
                  },
                  { width: 140, margin: [60, 0, 0, 1], text: 'Receipt Date:', color: '#424242' },
                  { text: '20 April 2018', margin: [15, 0, 0, 1], color: '#424242', bold: true },
                ],
                // optional space between columns
                columnGap: 5, margin: [0, 0, 0, 0]
              },
              {
                fontSize: 11, columns: [
                  {
                    width: 250, text: 'Ara damansara, 472301, Petaling Jaya, Selangor', margin: [0, 0, 0, 1],
                    bold: true, color: '#424242'
                  },
                ],

              },

              {
                fontSize: 11, columns: [
                  { bold: true, width: 40, text: 'Email:', margin: [0, 0, 0, 1], color: '#919191' },
                  { text: 'customerservice@intuglo.com', margin: [0, 0, 0, 1], color: '#919191' },
                ],
                // optional space between columns
                columnGap: 10, margin: [0, 0, 0, 0]
              },

              {
                fontSize: 11, columns: [
                  { bold: true, width: 40, text: 'Tel:', margin: [0, 0, -6, 5], color: '#919191' },
                  { text: '+60378322188', margin: [5, 0, 0, 5], color: '#919191' },
                ],
                // optional space between columns
                columnGap: 10,
              },
              {
                fontSize: 11, columns: [
                  {
                    width: 250, text: 'Website:   www.intuglo.com', margin: [0, 0, 0, 1],
                    bold: true, color: '#919191'
                  },
                ],

              },

              {
                fontSize: 11, columns: [
                  { bold: true, text: 'On Behalf Of + Supplier Company Name', margin: [0, 0, -6, 1], color: '#919191' },
                ],
              },
              {
                canvas: [
                  {
                    type: 'line', x1: 0, y1: 10, x2: 500 - (-15), y2: 10, lineWidth: 10, color: '#2674f2'
                  }
                ],
              },

              //new
              {
                fontSize: 11, columns: [
                  {
                    width: 250, bold: true, text: 'Buyer Name',
                    //23 get_order_details.consignor_contact_person
                    margin: [0, 30, 0, 1], color: '#424242'

                  },
                ],
                // optional space between columns
                columnGap: 10, margin: [0, 0, 0, 0]
              },

              {
                fontSize: 11, columns: [
                  {
                    text: 'Buyer Address: ', margin: [0, 0, 0, 2],
                    bold: true, color: '#424242'
                  },
                ],
                // optional space between columns
                columnGap: 10, margin: [0, 0, 0, 0]
              },
              {
                fontSize: 11, columns: [
                  {
                    text: 'Buyer Email : ', margin: [0, 0, 0, 2],
                    bold: true, color: '#424242'
                  },
                ],
                // optional space between columns
                columnGap: 10, margin: [0, 0, 0, 0]
              },

              {
                fontSize: 11, columns: [
                  { bold: true, text: 'Buyer Tel:' + get_order_details.consignor_contact_number, margin: [0, 0, -5, 10], color: '#919191' },

                ],
                // optional space between columns
                columnGap: 50, margin: [0, 0, 0, 5]
              },

              // table starts here
              {
                layout: 'lightHorizontalLines',
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                  widths: ['14.28%', '14.28%', '14.28%', '14.28%', '14.28%', '14.28%', '14.28%'],


                  body: [
                    //header
                    [

                      { text: 'No', bold: true, margin: [0, 0, 0, 5], color: '#424242', fontSize: 12, fillColor: '#d1e2ff' },
                      { text: 'Invoice No', bold: true, margin: [0, 0, 0, 5], color: '#424242', fontSize: 12, fillColor: '#d1e2ff' },
                      { text: 'Order ID', bold: true, margin: [0, 0, 0, 5], color: '#424242', fontSize: 12, fillColor: '#d1e2ff' },
                      { text: 'Description', bold: true, margin: [0, 0, 0, 5], color: '#424242', fontSize: 12, fillColor: '#d1e2ff' },
                      { text: 'CBM', bold: true, margin: [0, 0, 0, 5], color: '#424242', fontSize: 12, fillColor: '#d1e2ff' },
                      { text: 'Unit', bold: true, margin: [0, 0, 0, 5], color: '#424242', fontSize: 12, fillColor: '#d1e2ff' },
                      { text: 'Amount', bold: true, margin: [0, 0, 0, 5], color: '#424242', fontSize: 12, fillColor: '#d1e2ff' },

                    ],
                    // rows
                    [
                      // row 1
                      { text: this.sharedService.orderId, color: '#424242', fontSize: 11 },
                      { text: get_order_details.port_from, color: '#424242', fontSize: 11 },
                      { text: get_order_details.port_to, color: '#424242', fontSize: 11 },
                      { text: get_order_details.quantity, color: '#424242', fontSize: 11 },
                      { text: get_order_details.departure_date, color: '#424242', fontSize: 11 },
                      { text: get_order_details.arrival_date, color: '#424242', fontSize: 11 },
                      { text: "$" + get_order_details.closing_price_total, color: '#424242', fontSize: 11, }

                    ],

                    // row 2
                    [
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: 'Subtotal:', color: '#424242', fontSize: 11, fillColor: '#d1e2ff' },
                      { text: "$" + get_order_details.closing_price_total, color: '#424242', fontSize: 11, fillColor: '#d1e2ff' }
                    ],
                    // row 3   
                    [
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: 'SST:', color: '#424242', fontSize: 11, },
                      { text: "" + get_order_details.closing_price_total, color: '#424242', fontSize: 11, }
                    ],
                    //row 4
                    [
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: '', color: '#424242', fontSize: 11, border: [false, false, false, false] },
                      { text: 'Total:', color: '#424242', fontSize: 11, fillColor: '#d1e2ff' },
                      { text: "$" + get_order_details.closing_price_total, color: '#424242', fontSize: 11, fillColor: '#d1e2ff' }
                    ]
                  ],

                },
                //  layout: {

                //    fillColor: function (i, node) {
                //      return (i === 0 || 1) ? '#d1e2ff' : null;
                //    },
                //  },

              },

              { text: 'Payment Information', fontSize: 13, bold: true, color: '#424242', margin: [0, 8, 0, 0] },
              { text: 'Transaction was via:', fontSize: 11, bold: true, color: '#424242', margin: [0, 0, 0, 0] },
              {
                image: 'data:image/png;base64,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',
                fit: [100, 100], margin: [0, 12, 0, 15]
              },
              { text: 'Delivery to: ', fontSize: 13, bold: true, color: '#424242', margin: [0, 8, 0, 5] },


              {
                table: {
                  widths: ['50%', '52%'],
                  body: [
                    [
                      { text: 'Company Name: ', border: [true, true, false, false], color: '#424242', fontSize: 12 },
                      { text: 'Name', border: [false, true, true, false], color: '#424242', fontSize: 12 }
                    ],
                    [
                      { text: 'Address: ', border: [true, false, false, false], color: '#424242', fontSize: 12 },
                      { text: 'Address', border: [false, false, true, false], color: '#424242', fontSize: 12 }
                    ],
                    [
                      { text: 'Email: ', border: [true, false, false, false], color: '#424242', fontSize: 12 },
                      { text: 'email', border: [false, false, true, false], color: '#424242', fontSize: 12 }
                    ],
                    [
                      { text: 'Contact Number: ', border: [true, false, false, true], color: '#424242', fontSize: 12 },
                      { text: '+385 66 77 8765', border: [false, false, true, true], color: '#424242', fontSize: 12 }
                    ]
                  ]
                }
              },


              { text: 'Thank you for your order!', bold: true, color: '#424242', fontSize: 16, alignment: 'center', margin: [0, 70, 0, 0] },
              { text: 'This is autogenerated receipt, no signature required', color: '#424242', fontSize: 12, alignment: 'center', margin: [0, 10, 0, 0] },
              //content ends here
            ]
          };

          pdfMake.createPdf(creditBlockReceiptPDF).download('Approve Credit Block Receipt');
        },
        error => {
          if (error.status == 400) {
            this.isPopup = true;
          }
        }
      );
  }
  //approve credit block receipt ends here


  // Download booking form
  buttonDownloadPDF() {
    this.loading = true;
    this.sharedService.getBookingPDF(this.session.loginID, this.session.sessionID, this.sharedService.orderId)
      .subscribe(
        get_order_details => {
          this.loading = false;
          this.order_details = get_order_details;
          if (this.order_details.halal_status == "H") {
            this.halalStatus = "Halal";
            this.departureAddress = this.order_details.halal_consolidation;
            this.arrivalAddress = this.order_details.halal_unstuffing;

          } else {
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
                  { width: 110, text: this.order_details.consignor_shipper }
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
                  { width: 110, bold: true, text: 'Port of Departure ' },
                  { width: 110, text: this.order_details.port_from },
                  { width: 110, bold: true, text: 'Port of Arrival' },
                  { width: 110, text: this.order_details.port_to }
                ],
                // optional space between columns
                columnGap: 10, margin: [10, 0, 0, 5]
              },

              {
                fontSize: 10, columns: [
                  { width: 110, bold: true, text: 'Logistic Provider' },
                  { width: 110, text: this.order_details.logistic_provider },
                  { width: 110, bold: true, text: 'Vessel/Flight No. ' },
                  { width: 110, text: this.order_details.vessel_no }
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
                  { width: 110, text: this.departureAddress },
                  { width: 110, bold: true, text: 'Arrival Address ' },
                  { width: 110, text: this.arrivalAddress },
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
                  { width: 110, text: this.order_details.cargo_description },

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
                    ['Sea Freight Rate (CBM)', this.order_details.cbm, "RM" + this.order_details.booking_price_a / this.order_details.cbm, 'RM' + this.order_details.booking_price_a],
                    ['Document Charges at Departure Port (' + this.order_details.port_from + ')', '1', "RM" + this.order_details.booking_price_bd, "RM" + this.order_details.booking_price_bd],
                    ['Document Charges at Arrival Port (' + this.order_details.port_to + ')', '1', "RM" + this.order_details.booking_price_ba, "RM" + this.order_details.booking_price_ba],
                    [{
                      border: [false, false, false, false],
                      text: ''
                    },
                    {
                      border: [false, false, false, false],
                      fillColor: '#eeeeee',
                      text: this.order_details.booking_price_tax_type, style: 'tableHeader'
                    },
                    {
                      border: [false, false, false, false],
                      fillColor: '#eeeeee',
                      text: this.order_details.booking_price_tax + '%', style: 'tableHeader'
                    },
                    {
                      border: [false, false, false, false],
                      text: 'RM' + ((parseFloat(this.order_details.booking_price_tax) * (parseFloat(this.order_details.booking_price_a) + parseFloat(this.order_details.booking_price_bd) + parseFloat(this.order_details.booking_price_ba))) / 100).toFixed(2)
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
                      text: 'RM' + ((parseFloat(this.order_details.booking_price_a) + parseFloat(this.order_details.booking_price_bd) + parseFloat(this.order_details.booking_price_ba)) + ((parseFloat(this.order_details.booking_price_tax) * (parseFloat(this.order_details.booking_price_a) + parseFloat(this.order_details.booking_price_bd) + parseFloat(this.order_details.booking_price_ba))) / 100)).toFixed(2)
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
          this.loading = false;
          if (error.status == 401) {
            this.isPopup = true;
          }
        }
      );
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.formm.get('documentUploader').setValue(file);
      let namefile = <HTMLInputElement>document.getElementById("documentName");
      namefile.innerHTML = file.name;
    }
  }

  onFileReset() {
    let namefile = <HTMLInputElement>document.getElementById("documentName");
    namefile.innerHTML = "";
    let newfile = <HTMLInputElement>document.getElementById("documentUploader");
    newfile.value = "";
    this.isUpload = false;

  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('documentUploader', this.formm.get('documentUploader').value);
    input.append('orderId', this.sharedService.orderId);
    return input;
  }
  
  ngOnInit() {
    this.sharedService.currentMessage.
      subscribe(
        data => {
          if ( data.event == 'orderBookingStatus' ) {
            this.orderStatusCode = data.status;
            this.paymentStatusCode = data.paymentStatusCode
          }
        }
      )
    this.formm = this.fb.group({
      documentUploader: null,
    });

    //validation that required before sending out the data
    this.form = new FormGroup({
      documentUpload: new FormControl('', [
        Validators.required
      ])
    });

  }


  showuploadSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success('Your document uploaded successfully!', 'Successful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  //to show failure notification properties
  showuploadFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('Your document failed to upload', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }
  showuploadError() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('Something wrong happend. Pease refresh your browser and try again', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showDeleteSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success('Your document deleted successfully!', 'Successful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  //to show failure notification properties
  showDeleteFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('Your document failed to delete', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }
  manageDocument() {
    // this.spinnerService.show();
    //function will be here to load list of documents
    this.customerApiService.getDocuments(this.session.loginID, this.session.sessionID, this.sharedService.orderId).subscribe(
      getdocuments => {
        if (getdocuments != null) {
          this.documents = getdocuments;
          this.documentLength = true;
        } else {
          // this.spinnerService.hide();
          this.documentLength = false;
        }
      },
      error => {
        // this.spinnerService.hide();
        this.isPopup = true;
      }
    )
  }

  uploadDocument() {
    // if (this.form.valid) {
      console.log("inside upload pin")
    this.spinnerService.show();
    const fileAndDocumentDescription = this.prepareSave();
    this.customerApiService.uploadOrderDocument(fileAndDocumentDescription).subscribe(
      status => {
        if (status === 200) {
          this.showuploadSuccess();
          this.manageDocument();
          this.form.reset();
          this.onFileReset();
          this.customerApiService.sendUpdateCustomerBooking();
        } else if (status === 204) {
          this.spinnerService.hide();
          this.showuploadFailure();
        } else {
          this.spinnerService.hide();
          this.showuploadError();
        }
      },
      error => {
        this.spinnerService.hide();
        this.showuploadError();
      }
    );
    // } 
  }
  resetInputField() {
    this.onFileReset();
  }
  deleteDocument(documentId) {
    let documentDetails = {
      "documentId": documentId
    }
    this.customerApiService.deleteOrderDocument(this.session.loginID, this.session.sessionID, documentDetails).subscribe(
      status => {
        this.showDeleteSuccess();
        this.manageDocument();
      },
      error => {
        this.showDeleteFailure();
      }
    );

  }

  // submitPackingList(){
  //   this.dialog.open(PackingListComponent, { disableClose: false });
  // }



}
