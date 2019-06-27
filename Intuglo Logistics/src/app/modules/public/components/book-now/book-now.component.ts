import { PublicApiService } from "./../../services/public-api.service";
import { Component, OnInit, Inject, NgModule, Pipe } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { SessionStorage } from "../../../models/session-storage";
import { CustomerSessionExpiredDialogComponent } from "../../../customer/components/customer-session-expired-dialog/customer-session-expired-dialog.component";
import { MatDialog } from "@angular/material";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PrintDateFormatPipe } from "../../../shared/pipes/print-date-format.pipe";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { VALID } from "@angular/forms/src/model";
import { min } from "rxjs/operator/min";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: "book-now",
  templateUrl: "./book-now.component.html",
  styleUrls: ["./book-now.component.css"]
})
@NgModule({
  providers: [CurrencyPipe],
  declarations: [CurrencyPipe]
})
export class BookNowComponent implements OnInit {
  // declarations for each forms
  formOne: FormGroup;
  formTwo: FormGroup;
  formThree: FormGroup;
  formFour: FormGroup;

  session = new SessionStorage(); // instance for session

  // for each tabs in book-now
  showFormPages: boolean = true;
  isOrderSuccessfull: boolean = false;
  isStepConsignor: boolean = true;
  isStepConsignee: boolean = false;
  isStepShipment: boolean = false;
  isStepCargo: boolean = false;

  container_id; // container_id variable from search-result
  order_id; // variable for order_id when user confirm booking

  rawJsonBookingDetails: any[];
  bookingDetailsValues: any[];
  customerDetails: any[];
  sessionDetails: any[];
  isAgreed: boolean = false; // checkbox terms and condition
  response;
  rawJsonError;
  message;

  reportDate;

  // Json get values to display in html
  vessel_name: string;
  consolidation: string;
  halal_consolidation: string;
  halal_unstuffing: string;
  unstuffing: string;
  vessel_no: string;
  customBroker: string;
  consignor_billAdd: string;
  consignor_contactNum: string;
  consignor_email: string;
  quotationID: string;
  portTo: any;
  portToAbbr: string;
  departureDate: any;
  consignor_companyName: string;
  portFrom: any;
  portFromAbbr: string;
  warehouseDepartureAddress: string;
  warehouseArrivalAddress: string;
  consignor_customerName: string;
  arrivalDate: any;

  cost_part_a: string;
  cost_part_b_departure: string;
  cost_part_b_arival: string;
  cost_tax_type: string;
  cost_tax_rate: string;
  cost_tax_amount: string;
  cost_total_before_tax: string;
  cost_total_after_tax: string;
  cost_part_a_per_cbm: string;

  // input data field id
  // 1st  step
  consignor_shipper: string;
  consignor_merchandiseValue: string;
  consignor_commercialValue: string;
  consignor_deliveryAdd: string;
  // 3rd step
  logistic_company: string;
  etd: string;
  eta: string;
  logistic_freight_provider = "";
  billing_of_loading: "";
  // 4th step
  _6_hs_code;
  fourDigitHSCode: string;
  cargoDescription: string;
  cbm: string;
  weight: string;
  quantity: string;
  halalStatus: string;
  tracking_number: "";
  //2nd step
  consignee_companyName: string;
  consignee_contactPerson: string;
  consignee_shipper: string;
  consignee_contactNum: string;
  consignee_email: string;
  consignee_merchandiseValue: string;
  consignee_commercialValue: string;
  consignee_billAdd: string;
  consignee_deliveryAdd: string;
  //var for search-box session
  halal;
  halal_status: boolean = true;
  hasCustomBroker: boolean = true;
  agentList;
  customBrokerName: string;
  //date for last page of book-now
  creditBlock;
  customFile;
  packing_details;
  warehouseAcceptCargo;
  sessionStorage: any;
  packingList:any[];
  constructor(
    public thisDialogRef: MatDialogRef<BookNowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private service: PublicApiService,
    public router: Router,
    private formBuilder: FormBuilder,
    private printDateFormatPipe: PrintDateFormatPipe,
    public dialog: MatDialog // private cp: CurrencyPipe
  ) {
    this.sessionStorage = this.session.getStorageData("searchbox-session");
    //getting data from searchbox
    this.cbm = this.sessionStorage.CBM;
    this.weight = this.sessionStorage.EstimatedWeight;
    this.halalStatus = this.sessionStorage.HalalStatus;
    if (this.halalStatus == "Halal") {
      this.halal = "H";
      this.halal_status = true;
    } else if (this.halalStatus == "Non-Halal") {
      this.halal = "N";
      this.halal_status = false;
    } else {
      this.halal = "U";
    }

    // this.consignee_commercialValue = this.cp.transform(this.consignee_commercialValue, 'USD', true, '1.0-0');
    // this.consignee_merchandiseValue = this.cp.transform(this.consignee_merchandiseValue, 'USD', true, '1.0-0');
    // this.consignor_commercialValue = this.cp.transform(this.consignor_commercialValue, 'USD', true, '1.0-0');
    // this.consignor_merchandiseValue = this.cp.transform(this.consignor_merchandiseValue, 'USD', true, '1.0-0');
  }

  ngOnInit() {

    this.reportDate = new Date();
    //validation for 1st step
    this.formOne = this.formBuilder.group({
      compName: new FormControl("", [Validators.required]),
      contPerson: new FormControl("", [Validators.required]),
      shipperName: new FormControl("", [Validators.required]),
      contNum: new FormControl("", [
        Validators.required,
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      emailCust: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ]),
      merchandiseCust: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      commercialCust: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      billingCust: new FormControl("", [Validators.required]),
      shipCust: new FormControl("", [Validators.required])
    });

    //validation for 2nd step
    this.formTwo = this.formBuilder.group({
      compSupp: new FormControl("", [Validators.required]),
      contPersonSupp: new FormControl("", [Validators.required]),
      shipSuppName: new FormControl("", [Validators.required]),
      contSupp: new FormControl("", [
        Validators.required,
        Validators.pattern(/^((\+)|(00)|(\\*)|())[0-9]{8,16}((\\#)|())$/),
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      emailSupp: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ]),
      merchandiseSupp: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      commercialSupp: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      billingSupp: new FormControl("", [Validators.required]),
      shipSupp: new FormControl("", [Validators.required])
    });

    //validation for 3rd step
    this.formThree = this.formBuilder.group({
      // quotationId: [null, Validators.required],
      // logisticComp: new FormControl('', [
      //   Validators.required
      // ]),
      // estimateDepart: [null, Validators.required],
      // estimateArrive: [null, Validators.required],
      // portDepart: [null, Validators.required],
      // portArrive: [null, Validators.required],
      // provForward: new FormControl('', [
      //   Validators.required
      // ]),
      // vesselFlight: [null, Validators.required],
      custom: new FormControl("", [Validators.required]),
      billLoad: new FormControl("", [Validators.pattern(/[a-zA-Z]/)]),
      warehouseDepart: new FormControl(''),
      warehouseArrivalAddress: new FormControl('')
    });

    //validation for 4th step
    this.formFour = this.formBuilder.group({
      // hs_6: [null, Validators.required],
      hs_4: new FormControl("", [
        Validators.required,
        Validators.pattern(/^([0-9][0-9][0-9][0-9])$/)
      ]),
      cargoDesc: new FormControl("", [Validators.required]),
      estimateWeight: new FormControl("", [Validators.required]),
      estimateCbm: new FormControl("", [Validators.required]),
      pack: new FormControl("", [Validators.required]),
      qty: new FormControl("", [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]),
      halal: new FormControl("")
      // trackNum: new FormControl('', [
      //   Validators.required
      // ])
    });

    this.container_id = this.service.getQId(); //get container_id when user click 'book-now' button in search-result

    //getting quotation information from backend and assigned to each variable to bind with html
    this.service
      .getBookingInit(
        this.session.loginID,
        this.session.sessionID,
        this.container_id
      )
      .subscribe(getBookingInfo => {
        this.rawJsonBookingDetails = getBookingInfo;

        this.bookingDetailsValues = this.rawJsonBookingDetails; 
        
        if (this.sessionStorage.ShipperType === "Importer") {
          this.consignee_companyName = this.bookingDetailsValues[
            "customer_company_name"
          ];
          this.consignee_contactPerson = this.bookingDetailsValues[
            "customer_name"
          ];
          this.consignee_email = this.bookingDetailsValues["official_email"];
          this.consignee_contactNum = this.bookingDetailsValues["mobile_no"];
          this.consignee_merchandiseValue = this.sessionStorage.MerchandiseValue;
          this.consignee_billAdd = this.bookingDetailsValues[
            "customer_address"
          ];
          this.consignee_deliveryAdd = this.bookingDetailsValues["customer_address"];
        } else {
          this.consignor_companyName = this.bookingDetailsValues[
            "customer_company_name"
          ];
          this.consignor_customerName = this.bookingDetailsValues[
            "customer_name"
          ];
          this.consignor_email = this.bookingDetailsValues["official_email"];
          this.consignor_contactNum = this.bookingDetailsValues["mobile_no"];
          this.consignor_merchandiseValue = this.sessionStorage.MerchandiseValue;
          this.consignor_billAdd = this.bookingDetailsValues[
            "customer_address"
          ];
          this.consignor_deliveryAdd = this.bookingDetailsValues["customer_address"];
        }
        this._6_hs_code = this.sessionStorage.SixDigitHSCode;
        this.vessel_name = this.bookingDetailsValues["vessel_name"];
        this.quotationID = this.bookingDetailsValues["quotation_id"];
        this.portTo = this.bookingDetailsValues["portTo"];
        this.portFrom = this.bookingDetailsValues["portFrom"];
        this.portFromAbbr =
          "(" +
          String(this.bookingDetailsValues["portFrom"]).substring(2, 5) +
          " , " +
          String(this.bookingDetailsValues["portFrom"]).substring(0, 2) +
          ")";
        this.portToAbbr =
          "(" +
          String(this.bookingDetailsValues["portTo"]).substring(2, 5) +
          " , " +
          String(this.bookingDetailsValues["portTo"]).substring(0, 2) +
          ")";
        this.customBrokerName = this.bookingDetailsValues["custom_broker"];
        this.departureDate = this.bookingDetailsValues["departure_date"];
        this.arrivalDate = this.bookingDetailsValues["arrival_date"];
        if (this.halalStatus === "Halal"){
          this.warehouseDepartureAddress = this.bookingDetailsValues["halal_consolidation"];
          this.warehouseArrivalAddress = this.bookingDetailsValues["halal_unstuffing"];
        }else{
          this.warehouseDepartureAddress = this.bookingDetailsValues["consolidation"];
          this.warehouseArrivalAddress = this.bookingDetailsValues["unstuffing"];
        }
        console.log('hallallll', this.bookingDetailsValues, '---', this.bookingDetailsValues['halal_consolidation']);
        this.logistic_company = this.bookingDetailsValues["company_name"];
        this.creditBlock = this.bookingDetailsValues["CreditBlock"];
        this.customFile = this.bookingDetailsValues["CustomFile"];
        this.warehouseAcceptCargo = this.bookingDetailsValues[
          "WarehouseAcceptCargo"
        ];
        this.vessel_no = this.bookingDetailsValues["vessel_no"];
        this.customBroker = this.bookingDetailsValues["custom_agent_id"];
        if (this.customBrokerName != null) {
          this.hasCustomBroker = true;
        } else if (this.customBrokerName == null) {
          this.hasCustomBroker = false;
        }
      });
    this.cost_part_a_per_cbm =
      parseFloat(this.cbm) == 0
        ? "0"
        : String(
            parseFloat(this.service.booking_total_part_a) / parseFloat(this.cbm)
          );
    this.cost_part_a = String(this.service.booking_total_part_a);
    this.cost_part_b_departure = String(
      this.service.booking_total_price_departure
    );
    this.cost_part_b_arival = String(this.service.booking_total_price_arrival);
    this.cost_total_before_tax = String(parseFloat(this.service.booking_price_without_tax));
    this.cost_total_after_tax = String(parseFloat(this.service.booking_price_with_tax));
    this.cost_tax_type = this.service.booking_tax_type;
    this.cost_tax_rate = this.service.booking_tax_percentage;
    this.cost_tax_amount = this.service.booking_tax_amount;
    // get list of custom agent
    this.service
      .getAgentList(this.session.loginID, this.session.sessionID)
      .subscribe(getAgentList => {
        this.agentList = getAgentList;
        console.log(this.agentList);
      });
    
    // get packging list
    this.service.getPackingTypesList(this.session.loginID, this.session.sessionID)
    .subscribe(getPackingList =>{
      this.packingList = getPackingList;
      this.packing_details = this.packingList[0].packing_type_id;
    })

  }

  //dropdown for packing details and halal status
  // packingDetails: Array<Object> = ["With Bubble Wrap", "Without Bubble Wrap"];
  // packing_details = this.packingDetails[0];


  //displaying step pages
  stepConsignor() {
    this.isStepConsignor = true;
    this.isStepConsignee = false;
    this.isStepShipment = false;
    this.isStepCargo = false;
  }
  stepConsignee() {
    if (this.formOne.valid) {
      this.isStepConsignor = false;
      this.isStepConsignee = true;
      this.isStepShipment = false;
      this.isStepCargo = false;
    }
  }
  stepShipment() {
    if (this.formTwo.valid) {
      this.isStepConsignor = false;
      this.isStepConsignee = false;
      this.isStepShipment = true;
      this.isStepCargo = false;
    }
  }
  stepCargo() {
    if (this.formThree.valid) {
      this.isStepConsignor = false;
      this.isStepConsignee = false;
      this.isStepShipment = false;
      this.isStepCargo = true;
    }
  }

  //send booking data to post in database
  showSuccesssfulOrder() {
    if (this.formFour.valid) {
      let booking_data = {
        quotation_id: this.quotationID,
        hs_code_id: this._6_hs_code,
        container_id: this.container_id,
        consignor_company_name: this.consignor_companyName,
        consignor_contact_person: this.consignor_customerName,
        consignor_contact_number: this.consignor_contactNum,
        consignor_email: this.consignor_email,
        consignor_delivery_address: this.consignor_deliveryAdd,
        consignor_billing_address: this.consignor_billAdd,
        consignor_shipper: this.consignor_shipper,
        four_digit_hs_code: this.fourDigitHSCode,
        halal_status: this.halal,
        cargo_description: this.cargoDescription,
        consignor_merchandise_value: this.consignor_merchandiseValue,
        consignor_commercial_value: this.consignor_commercialValue,
        consignee_merchandise_value: this.consignee_merchandiseValue,
        consignee_commercial_value: this.consignee_commercialValue,
        consignee_company_name: this.consignee_companyName,
        consignee_contact_person: this.consignee_contactPerson,
        consignee_contact_number: this.consignee_contactNum,
        consignee_email: this.consignee_email,
        consignee_delivery_address: this.consignee_deliveryAdd,
        consignee_billing_address: this.consignee_billAdd,
        consignee_shipper: this.consignee_shipper,
        weight: this.weight,
        cbm: this.cbm,
        quantity: this.quantity,
        tracking_number: this.tracking_number ? this.tracking_number: null,
        logistic_freight_provider: this.logistic_freight_provider,
        packing_details: this.packing_details,
        customBroker: this.customBroker,
        billing_of_loading: this.billing_of_loading ? this.billing_of_loading: null,
        booking_price: this.service.booking_price_with_tax,
        booking_price_ba: this.service.booking_total_price_arrival,
        booking_price_bd: this.service.booking_total_price_departure,
        booking_price_total: this.service.booking_total_part_a,
        booking_tax_type:this.cost_tax_type,
        booking_tax_rate:this.cost_tax_rate,
        booking_total_amount_with_tax:this.cost_total_after_tax,
        booking_tax_amount:this.cost_tax_amount
      };
      this.service
        .postBooknow(this.session.loginID, this.session.sessionID, this.session.cartID, 
            booking_data)
        .subscribe(
          newPost => {
            this.showFormPages = false;
            this.isOrderSuccessfull = true;
            this.rawJsonError = newPost;
            this.message = Object.values(this.rawJsonError);
            this.order_id = this.message[0];
          },
          error => {
            if (error.status == 400) {
              this.dialog.open(CustomerSessionExpiredDialogComponent, {
                disableClose: true
              });
            }
          }
        );
    }
  }

  //function to close booking popup
  onCloseCancel() {
    this.thisDialogRef.close();
    window.scrollBy({ top: 900, left: 0, behavior: "smooth" });
    this.router.navigate(["/searchresult"]);
  }

  //function to navigate to customer dashboard
  onDashboard() {
    this.thisDialogRef.close();
    window.scroll(0, 0);
    this.router.navigate(["customer/dashboard"]);
  }

  //function to enable confirm booking button
  statusAgreed() {
    this.isAgreed = !this.isAgreed;
  }

  //function to link to cart page
  onCartClick() {
    this.thisDialogRef.close();
    this.router.navigate(["customer/cart"]);
  }

  onPrint(){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var thankYouPdf = {
      pageSize : "A4",

      content:[
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
          ]
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
          ],
          // optional space between columns
          // columnGap: 10
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
        { text: 'Thank you for your Order! ', fontSize: 15, margin: [0, 30, 0, 30], alignment: 'center', color: "#424242", bold: true },
        { text: 'Please keep the below information for your reference on your order.', fontSize: 10, margin: [0, 30, 0, 30], alignment: 'center', color: "#424242", bold: true },
        {
          fontSize: 11, columns: [
               { 
                 width: 250, 
                 bold: true, text: 'Order ID: ' + this.order_id,
                 margin: [0, 0, 0, 1],color: '#424242'
               },
               { 
                width: 250, bold: true, 
                text: 'Last day for credit block: ' + this.creditBlock,
                margin: [50, 0, 0, 1],color: '#424242'
               }
            ],
        },
        {
          fontSize: 11, columns: [
               { 
                 width: 250, 
                 bold: true, text: 'Warehouse accepting cargo from: ' + this.warehouseAcceptCargo,
                 margin: [0, 0, 0, 1],color: '#424242'
               },
               { 
                width: 250, bold: true, 
                text: 'Please upload your custom declaration document before: ' + this.customFile,
                margin: [50, 0, 0, 1],color: '#424242'
               }
            ],
        },
        {
          fontSize: 11, columns: [
               { 
                 width: 250, 
                 bold: true, text: 'Please send cargo to: ' + this.warehouseDepartureAddress,
                 margin: [0, 0, 0, 1],color: '#424242'
               }
            ],
        }
      ],
      footer: {
        columns: [
          { 
          text: 'Print Date: ' + this.printDateFormatPipe.transform(this.reportDate), 
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
    pdfMake.createPdf(thankYouPdf).download("Thank You For Your Order");
  }
}
