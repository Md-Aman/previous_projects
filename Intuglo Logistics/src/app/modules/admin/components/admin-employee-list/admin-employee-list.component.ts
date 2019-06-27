import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { AdminApiService } from './../../services/admin-api.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Subscription } from 'rxjs/Subscription';
import { SessionStorage } from '../../../models/session-storage';
import { ToastrService } from "ngx-toastr";
import * as $ from 'jquery';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
//import * as pdfFonts from '../../../shared/fonts/vfs_fonts';
import { PrintDateFormatPipe } from "../../../shared/pipes/print-date-format.pipe";
import { Constants } from './../../../util/constants';

//all for month datepicker
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { count } from 'rxjs/operators';
import { shiftInitState } from '@angular/core/src/view';

const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'admin-employee-list',
  templateUrl: './admin-employee-list.component.html',
  styleUrls: ['./admin-employee-list.component.css'],

      //for month picker
      providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
      ]
})
export class AdminEmployeeListComponent implements OnInit {

  countryList: any[];
  resourcesList: any[];
  vesselList: any[];
  selectedData;
  selectedCountry;
  selectedMonth: any;
  selectedCountryCode;
  selectedRoute;
  selectedVessel = null;
  selectedRouteName;
  selectedRouteId;
  selectedVesselName;
  selectedVesselId; 
  displayCountryName: boolean = false;
  routeTabChanged: boolean = false;
  selectedIndex;
  month;
  year;
  amount;
  EmployeeDetails;
  printableEmployeeList:any =[];
  reportDate;
  paymentItems: any[];
  output: JSON;
  shipmentRoutesList: any[];
  message: boolean = false;
  displayTable: boolean = false;
  displayGenerateButton: boolean = false;
  filtershipmentRoutes:any = [];
  filterRoutes:any = [];
  filteredRoute:any = [];
  filterVessels:any = [];
  cards:any = []; 

  showCalendar: boolean;
  maxView = 'year';
  minuteStep = 5;
  minView = 'month';
  startView = 'month';
  views = ["minute", "hour", "day", "month", "year"];

  selectedDate: any;
  selDate: any;
  eventCounter: number = 0;
  customCal: boolean;
  eventCounter2: number = 0;

  constructor( 
    private printDateFormatPipe: PrintDateFormatPipe, 
    private service: AdminApiService, 
    private sharedService: SharedService,
    private toastr: ToastrService 
    ) { }
  session = new SessionStorage(); 

///////////////////----- Datepicker ------///////////////////

    displayCalendar(event) {
      if (event) {
         this.eventCounter++;
         console.log(this.eventCounter);
         if (this.eventCounter % 2 === 0) {
           this.showCalendar = false;
           this.customCal = false;
         } else {
          this.customCal = true;
          this.showCalendar = true;
        } 
      }      
    }

  onCustomDateChange(event){
    //there is a bootstrap bug and the function fires twice once page loads

        this.selectedMonth = moment(event.value, 'MM-YYYY').format('MM-YYYY');
        console.log('Formatted ' + this.selectedMonth);
          //  if(this.selectedMonth){
          //    this.showCalendar = false;
          //    this.customCal = false;
          //  }
        this.checkResources();
  }

  

///////////////////----- Datepicker ends ------///////////////////


  ngOnInit() {
    this.reportDate = new Date();

         this.service.getCountryListForEmployeeReport(this.session.loginID,this.session.sessionID)
         .subscribe( getCountryList => {
         this.countryList = getCountryList;      
         console.log("Response country " + JSON.stringify(this.countryList));
         });   
  }
/*
old
  public onDate(event, dp){
    this.year = event._i.year;
    this.month = event._i.month+1;
    this.selectedMonth = this.month + '-' + this.year;
    console.log("selected Month " + this.selectedMonth)
     this.getResources();
  }

  */

  checkResources(){ 
    try{
        if(this.selectedData !== undefined){
          this.selectedCountryCode = this.selectedData.country_code;
          this.selectedCountry = this.selectedData.country_name;
          console.log(this.selectedMonth);
          if(this.selectedMonth && this.selectedCountry !== undefined || null){
            this.getResources();
          } else {
            console.log('Select both, date and country');
            this.showInfo();
          } 
        }
        //this.showInfo();  
    } catch (error) {
      console.log('> Error is handled: ', error.name);
    } 
  } 

  getResources(){
    console.log("in resources " +this.selectedCountry + this.selectedMonth + this.selectedCountryCode);
               this.service.getAdminEmployeeResources(this.session.loginID,this.session.sessionID, this.selectedMonth,
                 this.selectedCountry)
               .subscribe( getResources => {
                 this.resourcesList = getResources;
                 console.log(this.resourcesList);
                 if(this.resourcesList !== null) {
                    this.shipmentRoutesList = this.resourcesList;                               
                    console.log("Response " + JSON.stringify(this.shipmentRoutesList));                
                    this.findCountryCode(this.selectedCountryCode);
                    this.displayCountryName = true;
                 } else {
                    console.log('no data found');
                    this.showNoDataFound();
                    this.displayCountryName = false;
                    this.selectedIndex = null;
                    this.filterRoutes = [];
                    this.filterVessels = [];
                 }
               });    
  }

  findCountryCode(countryCode){
    let filterShipmentRoutes2 = [];
    for(let shipmentRoute of this.shipmentRoutesList){ 
     if(shipmentRoute.country.includes(countryCode)){
       filterShipmentRoutes2.push(shipmentRoute.country);
       this.filtershipmentRoutes = filterShipmentRoutes2;
       //setting default first country code as selected
       this.onClickFindRoutes(this.filtershipmentRoutes[0]);   
     }
   }
 }



   onClickFindRoutes(route){ //MY-AU
     for(let routes of this.shipmentRoutesList){
       if(routes.country === route){
         this.filterRoutes = routes.route;
         console.log('this.filterRoutes onclick');
         console.log(this.filterRoutes);
         this.selectedIndex = route;
       } 
     }
 }

onSelectedRoutes(){
  this.selectedRouteName = this.selectedRoute.portName;
  this.selectedRouteId = this.selectedRoute.route_id;
  for(let routes of this.filterRoutes){
    if(routes.route_id === this.selectedRouteId){
      this.filterVessels = routes.vessel;
    } 
  }
}

////////----- Filtration ends here ------//////

/////////------ Calling List api ------///////

getEmployeeList() {
  // get list of payment
  console.log(this.selectedVessel);
  if(this.selectedVessel !== null){
  this.selectedVesselName = this.selectedVessel.vessel_name;
  this.selectedVesselId = this.selectedVessel.vessel_id;
      this.service.getAdminEmployeeList(this.session.loginID, this.session.sessionID, this.selectedVesselId)
        .subscribe( getEmployees => {
            this.EmployeeDetails = getEmployees;

            if(this.EmployeeDetails != null) {
                this.displayTable = true;
                this.displayGenerateButton = true;
                console.log(this.EmployeeDetails);

                for (let i = 0; i < this.EmployeeDetails.length; i++) {
                            this.printableEmployeeList.push({
                              no: i + 1,
                              company_name: this.EmployeeDetails[i]["company_name"], 
                              quotation_id: this.EmployeeDetails[i]["quotation_id"],
                              etd:"☐   " + this.EmployeeDetails[i]["etd"],
                              etd2: "☐   " + this.EmployeeDetails[i]["etd"],

                            });
                          }
          
          }

          }
        );
      } else {
        console.log('Select vessel first');
        this.showSelectVesselFirst();
      }
 }


  buildTableBody(data, columns) {
    var body = [];
    body.push([
        {
          text: "No",
          bold: true,
          margin: [0, 0, 0, 5],
          color: "#424242",
          fontSize: 11,
          fillColor: "#d1e2ff"
        },
      {
        text: "Supplier Agent",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 11,
        fillColor: "#d1e2ff"
      },
      {
        text: "Quotation ID",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 11,
        fillColor: "#d1e2ff"
      },
      {
        text: "Drop Order",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 11,
        fillColor: "#d1e2ff"
      },
      {
        text: "Order Lock In",
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#424242",
        fontSize: 11,
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
    console.log(data)
    return {
      layout: 'lightHorizontalLines',
      table: {
        headerRows: 1,
        widths: ['5%', '20%', '40%','17.5%', '17.5%'],
        
        body: this.buildTableBody(data, columns)
      }
    };
  }


  onGenerateReport() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
     pdfMake.fonts = {
       Roboto: {
         normal: 'Roboto-Regular.ttf',
         bold: 'Roboto-Medium.ttf',
         italics: 'Roboto-Italic.ttf',
         bolditalics: 'Roboto-MediumItalic.ttf'
       },
       Aller: {
         normal: 'Aller-lt.ttf',
         bold: 'Aller-lt.ttf',
         italics: 'Aller-lt.ttf',
         bolditalics: 'Aller-lt.ttf'
       },
       Symbola: {
        normal: 'Symbola.ttf',
        bold: 'Symbola.ttf',
        italics: 'Symbola.ttf',
        bolditalics: 'Symbola.ttf'
       }

     };
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
          ],
          // optional space between columns
          columnGap: 10
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

        { text: 'Admin Employee Worksheet Report', fontSize: 15, margin: [0, 30, 0, 30], alignment: 'center', color: "#424242", bold: true },

        {
          fontSize: 11, columns: [
               { 
                 width: 250, 
                 bold: true, text: 'Country: ' + this.selectedCountry,
                 margin: [0, 0, 0, 1],color: '#424242'
                           
               },
               { 
                width: 250, bold: true, 
                text: 'Month: ' + this.selectedMonth,
                margin: [130, 0, 0, 1],color: '#424242'
                           
               },
               
            ],

         },

         {
          fontSize: 11, columns: [
               { 
                 width: 250, 
                 bold: true, text: 'Route: ' + this.selectedRouteName,
                 margin: [0, 0, 0, 1],color: '#424242'
                           
               },
               
            ],

         },

               {
                 fontSize: 11, columns: [
                   {  
                      text: 'Vessel: ' + this.selectedVesselName, 
                      margin: [0, 0, 30, 15],
                      bold: true, color: '#424242'},
                 ],
               },
   
        // table starts here

        this.table(this.printableEmployeeList, ["no", "company_name", "quotation_id","etd", "etd2"]),

        //content ends here
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
      },
      

         defaultStyle: {
           font: "Symbola"
         }
    };


    pdfMake.createPdf(creditBlockReceiptPDF).download("Admin Employee Worksheet Report");
  }


  ////////----- Toastr messages -------//////////
  showNoDataFound() {
    this.toastr.error("No Data Found", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  showSelectVesselFirst() {
    this.toastr.error("Select Vessel First", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  showInfo() {
    this.toastr.info("Select both, month and country", "Information!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

}
