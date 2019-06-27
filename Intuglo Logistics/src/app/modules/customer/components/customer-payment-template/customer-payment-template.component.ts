import { Component, OnInit, Input, NgModule, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerApiService } from './../../services/customer-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { SessionStorage } from '../../../models/session-storage';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { CustomerSessionExpiredDialogComponent } from "../customer-session-expired-dialog/customer-session-expired-dialog.component";

import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import {of} from "rxjs/observable/of";
import {SharedService} from "@shared/services/shared.service";
import {environment} from '@env/environment';
import { Constants } from '@app/modules/util/constants';
import { PrintDateFormatPipe } from "@shared/pipes/print-date-format.pipe";

@Component({
  selector: 'customer-payment-template',
  templateUrl: './customer-payment-template.component.html',
  styleUrls: ['./customer-payment-template.component.css']
})
export class CustomerPaymentTemplateComponent implements OnInit {

  session = new SessionStorage();
  customerDetails: any[];
  customerLoginDetails: any[];
  CartDetails: any[];
  cartPersonDetails: any;
  message: boolean = false;
  cartId ;
  isPopup: boolean = false;
  amount: number = 0;
  tax_amount: number;
  tax_type: string;
  tax_rate: number;
  transaction_fee: number;
  transaction_description: string;
  total ;
  totalAmount;
  subscription: Subscription;
  loading: boolean = false;
  payaplButtonShow: boolean = false;
  phoneCode: any = environment.phoneCode;
  public payPalConfig?: PayPalConfig;

  recieptDate;
  companyName: string;
  customerAddressLine1: string;
  customerAddressLine2: string;
  customerAddressLine3: string;
  customerAddressLine4: string;
  customerPhone: string;
  customerEmail: string;
  cartItems: any =[];

  constructor(private customerApiService: CustomerApiService, public router: Router,
       private toastr: ToastrService, private sharedService: SharedService, 
       private dialog: MatDialog, private printDateFormatPipe: PrintDateFormatPipe) {
    this.subscription = this.customerApiService.getUpdateCartList().subscribe(details => {
      this.ngOnInit();
    });
  }
  sumCartAmount(cartDetails) {
    const sum = _.sumBy(cartDetails, function(o) {
       return o["transaction_fee"];
      });
    return sum;
  }
  ngOnInit() {
    this.recieptDate = new Date();
    this.cartId = this.session.cartID;
    console.log('cartid', this.cartId);
    // this.initConfig();
    // get cart (booking) list information
    this.loading = true;
    this.amount = 0;
    this.customerApiService.getCartList(this.session.loginID, this.session.sessionID,
      this.cartId)
      .finally(() => {this.loading = false;}).subscribe(response => {
        if (response.status == 200) {
          let cart_details = response.json();
          this.cartPersonDetails = cart_details;
          this.CartDetails = cart_details["cart_list"];
          this.tax_type = cart_details["tax_type"];
          this.tax_rate = cart_details["tax_rate"];
          this.amount = cart_details["amount"];
          this.tax_amount = cart_details["tax_amount"];
          this.total = cart_details["total_amount"];
          this.companyName = cart_details["company_name"];
            this.customerAddressLine1 = cart_details["address_line_one"];
            this.customerAddressLine2 = cart_details["address_line_two"];
            this.customerAddressLine3 =
              cart_details["postal_code"] + ", " + cart_details["city"];
            this.customerAddressLine4 =
              cart_details["state"] + ", " + cart_details["country_name"];
            this.customerEmail = cart_details["official_email"];
            this.customerPhone = cart_details["office_phone"];
            this.tax_type = cart_details["tax_type"];
            this.tax_rate = cart_details["tax_rate"];
            this.amount = cart_details["amount"];
            this.tax_amount =cart_details["tax_amount"];
            this.total = cart_details["total_amount"];

            for (let i = 0; i < cart_details["cart_list"].length; i++) {
              this.cartItems.push({
                no: i + 1,
                order_id: cart_details["cart_list"][i]["order_id"],
                description:
                  cart_details["cart_list"][i]["transaction_description"] +
                  " - " +
                  cart_details["cart_list"][i]["portFrom"] +
                  " to " +
                  cart_details["cart_list"][i]["portTo"] +
                  " - ETD:" +
                  cart_details["cart_list"][i]["ETD"],
                amount: Constants.formatter.format(Number(cart_details["cart_list"][i]["transaction_fee"]))
              });
              this.payPalConfig = undefined;

              // this.payaplButtonShow = true;
              // this.initConfig();
            }
        } else {
          this.message = true;
        }
      },
      error => {
        if (error.status == 400) {
          this.dialog.open(CustomerSessionExpiredDialogComponent, {
            disableClose: true
          });
        }
      });
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
            this.proceedPayment(res);
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
          console.log(actions);
        },
        transactions: [
          {
            amount: {
              total: this.total,
              currency: 'MYR'

            },
            custom: this.cartId,
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
                recipient_name: this.session.userName,
                line1: this.cartPersonDetails.address_line_one,
                line2: this.cartPersonDetails.address_line_two,
                city: this.cartPersonDetails.city,
                country_code: 'MY',
                postal_code: this.cartPersonDetails.postal_code,
                phone: this.phoneCode + this.cartPersonDetails.office_phone,
                state: this.cartPersonDetails.state
              },
            },
          }
        ],
        note_to_payer: 'Contact us if you have troubles processing payment'
      }
    );
  }
  // confirm container space from backend then proceed to payment
  confirmContainerSpace() {
    this.customerApiService.confirmContianerSpace(this.session.loginID, this.session.sessionID,
        this.cartId)
    .finally(() => {this.loading = false;}).subscribe(response => {
      if (response.status == 200) {
        // let cart_details = response.json();
        this.payaplButtonShow = true;
        this.initConfig();
        
      } else {
        this.message = true;
      }
    },
    error => {
      if (error.status == 401) {
        const text = error.text();
        const msg = text.status;
        this.sharedService.toggleToaster(msg, 'error');
        setTimeout(() => {this.router.navigate(['customer/cart']);}, 1000);
       
      }
    });
  }
  // navigate to cart component
  backToPreviousPage() {
    this.router.navigate(['customer/cart']);
  }


  getMessage: any[];
  messageGet: any[];

  buildTableBody(data, columns) {
    var body = [];
    body.push([
      {
        text: "No",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 12,
        fillColor: "#d1e2ff"
      },
      {
        text: "Order ID",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 12,
        fillColor: "#d1e2ff"
      },
      {
        text: "Description",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 12,
        fillColor: "#d1e2ff"
      },
      {
        text: "Amount",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 12,
        fillColor: "#d1e2ff"
      }
    ]);

    data.forEach(function(row) {
      var dataRow = [];
      columns.forEach(function(column) {
        dataRow.push(
          {
              text: row[column],
              color: "#424242",
              fontSize: 10
          }
        );
      });
      body.push(dataRow);
    });
    return body;
}

table(data, columns) {
  return {
    layout: 'lightHorizontalLines',
    table: {
      headerRows: 1,
      widths: ["5%", "30%", "55%", "10%"],
      body: this.buildTableBody(data, columns)
    }
  };
}

  proceedPayment(paymentData) {
    // update order status in cart to "paid"
    let cartId ={
      "carts_id": this.cartId,
      "data": paymentData
    }
    console.log('trying to call api')
    this.customerApiService.updateCartStatusPaid(this.session.loginID, this.session.sessionID, cartId)
    .subscribe(
      status => {
        this.getMessage = status;
        this.messageGet = Object.values(this.getMessage);
        this.cartId = status.cart_id;
        sessionStorage.setItem("cartID", JSON.stringify(this.cartId));
        this.sharedService.toggleToaster('Payment Successful', 'success');
        console.log('inside proceed payment');
        // update container's halal_status, remianing cbm and number of people sharing
    //     this.customerApiService.updateContainer(this.session.loginID,this.session.sessionID,this.containerList)
    // .subscribe();
        this.router.navigate(['customer/dashboard']);
        this.generatePdf();
      },
      error => {
          this.isPopup = true;
          this.sharedService.toggleToaster('Payment Unsuccessful', 'error');
      }
    );

  }
  generatePdf () {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    var creditBlockReceiptPDF = {
      pageSize: "A4",

      content: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 10,
              x2: 500 - -15,
              y2: 10,
              color: "#2674f2"
            }
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              image:
                "data:image/png;base64,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",
              fit: [150, 150],
              margin: [0, 12, 0, 0]
            },
            {
              text: "RECEIPT",
              bold: false,
              fontSize: 24,
              color: "gray",
              style: ["header"],
              width: "*",
              margin: [160, 12, 0, 0]
            }
          ],
          // optional space between columns
          columnGap: 10
        },
        {
          fontSize: 11,
          columns: [
            {
              width: 250,
              bold: true,
              text: "HBG FLUXR DIGITAL SDN BHD (1208312-H)",
              margin: [0, 0, 0, 1],
              color: "#424242"
            },
            {
              width: 140,
              margin: [60, 0, 0, 0],
              text: "Receipt No.  :",
              color: "#424242"
            },
            { text: "", margin: [15, 0, 0, 1], color: "#424242", bold: true }
          ],
          // optional space between columns
          columnGap: 5,
          margin: [0, 0, 0, 1]
        },

        {
          fontSize: 11,
          columns: [
            {
              width: 250,
              text: "C-09-23, Centum @ Oasis Corporate park",
              margin: [0, 0, 0, 1],
              bold: true,
              color: "#424242"
            },
            {
              width: 140,
              margin: [60, 0, 0, 1],
              text: "Receipt Date:",
              color: "#424242"
            },
            {
              text: this.printDateFormatPipe.transform(this.recieptDate),
              margin: [15, 0, 0, 1],
              color: "#424242",
              bold: true
            }
          ],
          // optional space between columns
          columnGap: 5,
          margin: [0, 0, 0, 0]
        },
        {
          fontSize: 11,
          columns: [
            {
              width: 250,
              text: "No 2, Jln PJU 1A/2, Ara damansara",
              margin: [0, 0, 0, 1],
              bold: true,
              color: "#424242"
            }
          ]
        },
        {
          fontSize: 11,
          columns: [
            {
              width: 250,
              text: "472301, Petaling Jaya, Selangor",
              margin: [0, 0, 0, 1],
              bold: true,
              color: "#424242"
            }
          ]
        },

        {
          fontSize: 11,
          columns: [
            {
              bold: true,
              width: 40,
              text: "Email:",
              margin: [0, 0, 0, 1],
              color: "#919191"
            },
            {
              text: "customerservice@intuglo.com",
              margin: [0, 0, 0, 1],
              color: "#919191"
            }
          ],
          // optional space between columns
          columnGap: 10,
          margin: [0, 0, 0, 0]
        },

        {
          fontSize: 11,
          columns: [
            {
              bold: true,
              width: 40,
              text: "Tel:",
              margin: [0, 0, -6, 5],
              color: "#919191"
            },
            { text: "+60378322188", margin: [5, 0, 0, 5], color: "#919191" }
          ],
          // optional space between columns
          columnGap: 10
        },
        {
          fontSize: 11,
          columns: [
            {
              width: 250,
              text: "Website:   www.intuglo.com",
              margin: [0, 0, 0, 1],
              bold: true,
              color: "#919191"
            }
          ]
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 10,
              x2: 500 - -15,
              y2: 10,
              lineWidth: 10,
              color: "#2674f2"
            }
          ]
        },

        //new
        {
          fontSize: 11,
          columns: [
            {
              width: 250,
              bold: true,
              text: this.companyName,
              //23 get_order_details.consignor_contact_person
              margin: [0, 10, 0, 1],
              color: "#424242"
            }
          ],
          // optional space between columns
          columnGap: 10,
          margin: [0, 0, 0, 0]
        },

        {
          fontSize: 11,
          columns: [
            {
              text: this.customerAddressLine1,
              margin: [0, 0, 0, 2],
              bold: true,
              color: "#424242"
            }
          ],
          // optional space between columns
          columnGap: 10,
          margin: [0, 0, 0, 0]
        },
        {
          fontSize: 11,
          columns: [
            {
              text: this.customerAddressLine2,
              margin: [0, 0, 0, 2],
              bold: true,
              color: "#424242"
            }
          ],
          // optional space between columns
          columnGap: 10,
          margin: [0, 0, 0, 0]
        },
        {
          fontSize: 11,
          columns: [
            {
              text: this.customerAddressLine3,
              margin: [0, 0, 0, 2],
              bold: true,
              color: "#424242"
            }
          ],
          // optional space between columns
          columnGap: 10,
          margin: [0, 0, 0, 0]
        },
        {
          fontSize: 11,
          columns: [
            {
              text: this.customerAddressLine4,
              margin: [0, 0, 0, 2],
              bold: true,
              color: "#424242"
            }
          ],
          // optional space between columns
          columnGap: 10,
          margin: [0, 0, 0, 0]
        },
        {
          fontSize: 11,
          columns: [
            {
              text: this.customerEmail,
              margin: [0, 0, 0, 2],
              bold: true,
              color: "#424242"
            }
          ],
          // optional space between columns
          columnGap: 10,
          margin: [0, 0, 0, 20]
        },

        this.table(this.cartItems, ["no", "order_id", "description", "amount"]),
        // table starts here
        {
          layout: "lightHorizontalLines",

          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["60%", "30%", "10%"],

            body: [
              //header
                            

              //row 4
              [
                {
                  text: "",
                  border: [false, false, false, false]
                },
                {
                  text: "Sub-Total:",
                  color: "#424242",
                  fontSize: 11,
                  fillColor: "#d1e2ff",
                  border: [true, false, true, true]
                },
                {
                  text: Constants.formatter.format(this.amount),
                  color: "#424242",
                  fontSize: 11,
                  fillColor: "#d1e2ff",
                  border: [false, false, true, true]
                }
              ],
              [
                {
                  text: "",
                  border: [false, false, false, false]
                },
                {
                  text: this.tax_type,
                  color: "#424242",
                  fontSize: 11,
                  fillColor: "#d1e2ff",
                  border: [true, false, true, true]
                },
                {
                  text: Constants.formatter.format(this.tax_amount),
                  color: "#424242",
                  fontSize: 11,
                  fillColor: "#d1e2ff",
                  border: [false, false, true, true]
                }
              ],
              [
                {
                  text: "",
                  border: [false, false, false, false]
                },
                {
                  text: "Total:",
                  color: "#424242",
                  fontSize: 11,
                  fillColor: "#d1e2ff",
                  border: [true, false, true, true]
                },
                {
                  text: Constants.formatter.format(this.total),
                  color: "#424242",
                  fontSize: 11,
                  fillColor: "#d1e2ff",
                  border: [false, false, true, true]
                }
              ]
            ]
          }
        }
        //content ends here
      ],
      footer: {
        columns: [
          { 
          text: 'Print Date: ' + this.printDateFormatPipe.transform(this.recieptDate), 
          alignment: 'left',
          margin: [15, 0, 0, 0],
          color: "#424242",
          fontSize: 10,
          }, 
          {
            text: 'This is an auto-generated report.', 
            alignment: 'center',
            color: "#424242",
            fontSize: 10,
          },
          {
            text: 'Page 1' + ' of ' + '1', 
            alignment: 'right',
            margin: [0, 0, 25, 0],
            color: "#424242",
            fontSize: 10,
          }

        ]    
      }
    };

    pdfMake.createPdf(creditBlockReceiptPDF).download("Booking Receipt");
  }

}
