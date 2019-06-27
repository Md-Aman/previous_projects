import { Router } from "@angular/router";
import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators
} from "@angular/forms";
import { SupplierApiService } from "./../../services/supplier-api.service";
import { MatDialog } from "@angular/material";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { ToastrService } from "ngx-toastr";
import { SessionStorage } from "../../../models/session-storage";
import { SupplierSessionExpiredDialogComponent } from "../supplier-session-expired-dialog/supplier-session-expired-dialog.component";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IMyOptions, IMyDateModel } from "mydatepicker";
import * as moment from 'moment';

@Component({
  selector: "supplier-quotation-template",
  templateUrl: "./supplier-quotation-template.component.html",
  styleUrls: ["./supplier-quotation-template.component.css"]
})
export class SupplierQuotationTemplateComponent implements OnInit {
  //Create instance of SessionStorage
  session = new SessionStorage();
  @Input () comingFrom: string;
  disableView: boolean = false;
  @ViewChild("quotationName")
  quotationName: ElementRef;

  quotationId: string;
  form: FormGroup; // form for create new quotation
  formm: FormGroup; // form for upload file
  formCalc: FormGroup; // form for handling charges
  myModel: any; // model for calculation
  isAgreed: boolean = false;
  todayDate;
  response: any[];
  SessionDetails: any[];
  sessionDetails: any[];
  supplierDetails: any[];
  supplierLoginDetails: any[];
  message: any[];
  rawJsonError: any[];

  // populate dropdown
  quotationInitData: any[];
  quotationInitDataValues: any[];
  portsValues: any[];
  shipmentTypes: any[];
  incotermValues: any[];
  termsAndCondition: any;
  containerTypeValues: any[];

  // var for form and two-way binding
  quotationNo: string;
  vesselFlightNo: string;
  customBroker: string;
  containerQuantity: string;
  containerSize: string;
  airSpaceQuantity: string;
  airSpaceSize: string;
  halalConsolidation: string;
  halalUnStuffing: string;
  consolidationWarehouse: string;
  unStuffing: string;
  selectedQuotationFor: string;
  selectedContainerType;
  selectedShipmentType;
  selectedIncoterms;
  selectedTransitTime: string;
  selectedDeparturePort: any;
  selectedArrivalPort: any;
  selectedNumberTransit: number;
  //selectedCustomBroker;
  selectedVesselId:string;
  departDate: any;
  arrivalDate: any;
  quotationData;
  quotationInfo;
  supplierQuotationInfo: any[];
  profileInfo: any[];
  isUpload: boolean = false;
  quotationChargesInfo;
  quotationCharges;
  measureUnit: any = [];
  quotationChargesData;
  totalPartA = 0;
  totalPartB: number = 0;
  locationD: string = "D"; //location departure for partB Departure
  locationA: string = "A"; //location arrival for partB Arrival
  file_name;
  uploaded_file_name: string = '';
  customAgentList;
  infoBasedVessel;
  vesselList;
  listFromVessel;
  port_id_departure: any;
  port_id_arrival: any;
  isSelected: boolean = true;
  partAValidate: boolean = false;

  shipmentCalendarHidden: boolean = true;
  selectedVesselFromCalendar: any;

  changeEtd(etd) {
    this.departDate = etd;
  }

  changeEta(eta) {
    this.arrivalDate = eta;
  }

  constructor(
    public router: Router,
    private service: SupplierApiService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer
  ) {
    this.todayDate = new Date();

    // populate incoterms, ports and shipment type
    this.service.getPortHsCode().subscribe(quotationInitData => {
      this.quotationInitData = quotationInitData;
      this.quotationInitDataValues = Object.values(this.quotationInitData);

      this.containerTypeValues = this.quotationInitDataValues[0];
      this.incotermValues = this.quotationInitDataValues[1];
      this.portsValues = Object.values(this.quotationInitDataValues[2]);
      this.shipmentTypes = this.quotationInitDataValues[3];
      this.measureUnit = this.quotationInitDataValues[5];
      this.termsAndCondition = this.quotationInitDataValues[4][0].terms_conditions_text;
    });

    // this.createForm();
    // this.supplierQuotation.quotationReference = "Quotation-Reference";
    // this.createForm();
    // initializing a model for the form to keep in sync with.
    // usually you'd grab this from a backend API
    this.myModel = {
      partA: [
        {
          amount: null,
          charges_description: null
        }
      ],
      partBDeparture: [
        {
          charges_description: null,
          amount: null,
          unit_of_measure_id: 1,
          charges_location: this.locationD
        }
      ],
      partBArrival: [
        {
          charges_description: null,
          amount: null,
          unit_of_measure_id: null,
          charges_location: this.locationA
        }
      ]
    };

    // initialize form with empty FormArray for partA, partB Departure, partB Arrival
    this.formCalc = new FormGroup({
      partA: new FormArray([]),
      partBDeparture: new FormArray([]),
      partBArrival: new FormArray([])
    });


    //now we manually use the model and push a FormGroup into the form's FormArray for each Part
    this.myModel.partA.forEach(po =>
      (<FormArray>this.formCalc.controls.partA).push(
        this.createPayOffFormGroup(po, 'part_A')
      )
    );
    //now we manually use the model and push a FormGroup into the form's FormArray for each Part
    this.myModel.partBDeparture.forEach(po =>
      (<FormArray>this.formCalc.controls.partBDeparture).push(
        this.createPayOffFormGroup(po)
      )
    );
    // now we manually use the model and push a FormGroup into the form's FormArray for each Part
    this.myModel.partBArrival.forEach(po =>
      (<FormArray>this.formCalc.controls.partBArrival).push(
        this.createPayOffFormGroup(po)
      )
    );
    // calculation for any changes happened in the array
    this.formCalc.controls.partA.valueChanges.subscribe(change => {
      const calculateAmount = (partA: any[]): number => {
        return partA.reduce((acc, current) => {
          return acc + parseFloat(current.amount || 0);
        }, 0);
      };
    });
    // calculation for any changes happened in the array
    this.formCalc.controls.partBArrival.valueChanges.subscribe(change => {
      const calculateAmount = (partBArrival: any[]): number => {
        return partBArrival.reduce((acc, current) => {
          return acc + parseFloat(current.priceArrival || 0);
        }, 0);
      };
    });
    // calculation for any changes happened in the array
    this.formCalc.controls.partBDeparture.valueChanges.subscribe(change => {
      const calculateAmount = (partBDeparture: any[]): number => {
        return partBDeparture.reduce((acc, current) => {
          return acc + parseFloat(current.priceDeparture || 0);
        }, 0);
      };
    });
  }
  toggleShipmentCalendar() {
    this.shipmentCalendarHidden = !this.shipmentCalendarHidden;
  }
  
   // data coming form child componenet "shared/shipment-calendar"
   selectedVesselFromCalendarParent(events) {
     console.log("testing vesel")
     console.log(events)
    this.departDate = moment(events.viewDate).format('YYYY-MM-DD');
    this.setVesselData(events);
    this.shipmentCalendarHidden = true;
  }
  setVesselData(vessel) {
console.log('veessel', vessel, '--', this.selectedArrivalPort);
    // this.selectedDeparturePort = vessel[
    //   "port_name_departure"
    // ];
    // this.selectedArrivalPort = vessel["port_name_arrival"];
    this.departDate = vessel["etd"];
    this.arrivalDate = vessel["eta"];
    
    // set value to form group object to form gets validated
    this.form.patchValue({
      etd: this.departDate,
      eta: this.arrivalDate,
      vesselFlightNo: vessel.vessel_no
    });
    if ( typeof this.selectedArrivalPort === 'object') {
      this.port_id_arrival = this.selectedArrivalPort.port_id;
      this.form.patchValue({
        arrivalPort: this.selectedArrivalPort.port_name
      });
    }
    if ( typeof this.selectedDeparturePort === 'object' ) {
      this.port_id_departure = this.selectedDeparturePort.port_id;
      this.form.patchValue({
        departurePort: this.selectedDeparturePort.port_name
      });
    }
  }
  // if change in depart port or arrival port field occure then remove data from ETD,ETA and vessel
  changeEvent(selectedPort, event, type = 'arrivalPort') {
    if ( selectedPort != '' && typeof selectedPort != 'undefined'
      && ( ( type == 'arrivalPort' && this.selectedArrivalPort != selectedPort ) 
      || ( type == 'departurePort' && this.selectedDeparturePort != selectedPort ) ) ) 
      {
        this.departDate = null;
        this.arrivalDate = null;
        this.form.patchValue({
          etd: this.departDate,
          eta: this.arrivalDate,
          vesselFlightNo: null
        });
      }
  }
  //function for file upload
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.formm.get("quotationUploader").setValue(file);
      let namefile = <HTMLInputElement>document.getElementById("quotationName");
      namefile.innerHTML = file.name;
    }
  }

  // reset file
  onFileReset() {
    if ( this.file_name ) {
      let namefile = <HTMLInputElement>document.getElementById("quotationName");
      namefile.innerHTML = "";
      let newfile = <HTMLInputElement>(
        document.getElementById("quotationUploader")
      );
      newfile.value = "";
      this.file_name = '';
      
        this.form.patchValue({
          quotationUpload: null
        })
    }

    this.isUpload = false;
     // check if we have file save in s3 bucket then should call backend api
     if ( this.uploaded_file_name ) {
      this.form.patchValue({
        quotationUpload: null
      })
      this.removeFile();
    }
  }
  // remove file from db and s3
  removeFile () {
    this.service.removeFileUser(
      this.session.loginID,
      this.session.sessionID,
      this.quotationId
    )
    .subscribe(
      data => {
        if ( data.text() ) {
          this.uploaded_file_name = ''; // set file name empty
        }
      }
    )
  }
  private prepareSave(): any {
    let input = new FormData();
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    // input.append('name', this.form.get('name').value);
    input.append(
      "quotationUploader",
      this.formm.get("quotationUploader").value
    );
    input.append("quotation_id", this.quotationId);
    return input;
  }

  ngOnInit() {
    // if coming from view then disable all fields 
    if ( this.comingFrom == 'view' ) {
      this.disableView = true;
    }
    // if we are creating quotation then don't run this code
    if ( this.comingFrom == 'modify' || this.comingFrom == 'view' ) {
      this.quotationId = this.service.getQId();

      var sessionQId = sessionStorage.getItem('quotationId');
      if ( sessionQId && typeof sessionQId != 'undefined' ) {
        if ( this.quotationId != sessionQId  && this.quotationId != '' && typeof this.quotationId != 'undefined') {
          sessionStorage.setItem('quotationId', this.quotationId);
        } else {
          this.quotationId = sessionQId;
        }
      } else {
        sessionStorage.setItem('quotationId', this.quotationId);
      }
      if (parseInt(this.quotationId) > 0) {
        this.fetchQuotationDetails();
        this.fetchPartA();
        this.fetchPartB();
      } else {
        this.customBroker = "0";
      }
    }


    this.formm = this.fb.group({
      quotationUploader: null
    });

    //validation that required before sending out the data
    this.form = new FormGroup({
      referenceNo: new FormControl("", [Validators.required]),
      quotationFor: new FormControl("", [Validators.required]),
      vesselFlightNo: new FormControl("", [Validators.required]),
      etd: new FormControl("", [Validators.required]),
      eta: new FormControl("", [Validators.required]),
      departurePort: new FormControl("", [Validators.required]),
      arrivalPort: new FormControl("", [Validators.required]),
      customBroker: new FormControl("", [Validators.required]),
      containerTypes: new FormControl("", [Validators.required]),
      shipmentTypes: new FormControl("", [Validators.required]),
      containerQuantity: new FormControl("", [Validators.required]),
      containerSize: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d{0,3}(\.\d{1,2})?$/)
      ]),
      incoterms: new FormControl("", [Validators.required]),
      airSpaceQuantity: new FormControl(null),
      airSpaceSize: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)
      ]),
      transitTime: new FormControl("", [Validators.required]),
      noTransitPort: new FormControl("", [Validators.required]),
      quotationUpload: new FormControl("", [Validators.required]),
      statusAgreed: new FormControl('', [Validators.required])
    });
    
    //populate custom agent list
    this.service
      .getCustomAgentList(this.session.loginID, this.session.sessionID)
      .subscribe(getCustomAgent => {
        this.customAgentList = getCustomAgent;
      });

    //populate vessel list
    this.service
      .getVesselList(this.session.loginID, this.session.sessionID)
      .subscribe(getVesselInfo => {
        this.vesselList = getVesselInfo;
      });
  }
  /**
   * set validity to null if we have uploaded file
   */
  updateUploadFileValidity() {
    if ( this.uploaded_file_name ) {
      this.form.controls['quotationUpload'].setValidators(null)
      this.form.controls['quotationUpload'].updateValueAndValidity()
    }
  }
  // on select vessel get related fields
  onSelectVessel(vessel: boolean) {
    this.isSelected = vessel;
    // this.fillVesselData();
  }

  //displaying port_name in autocompleter
  autocomplePortListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.port_name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  createPayOffFormGroup(payOffObj, type = 'part_B') {
    
    const formObj = {
      charges_description: new FormControl(payOffObj.charges_description),
      amount: new FormControl(payOffObj.amount),
      // item: new FormControl(payOffObj.item),
      descDeparture: new FormControl(payOffObj.descDeparture),
      // supplier: new FormControl(payOffObj.supplier),
      priceDeparture: new FormControl(payOffObj.priceDeparture),
      unitDeparture: new FormControl(payOffObj.unitDeparture),
      // port: new FormControl(payOffObj.port),
      // port2: new FormControl(payOffObj.port2),
      descArrival: new FormControl(payOffObj.descArrival),
      // supplier2: new FormControl(payOffObj.supplier2),
      priceArrival: new FormControl(payOffObj.priceArrival),
      unitArrival: new FormControl(payOffObj.unitArrival),
      arrival: new FormControl(payOffObj.arrival),
      departure: new FormControl(payOffObj.departure)
    };
    if ( type == 'part_A' ) {
      formObj.charges_description = new FormControl(payOffObj.charges_description, [Validators.required]);
      formObj.amount = new FormControl(payOffObj.amount, [Validators.required]);
    }
    return new FormGroup(formObj);
  }

  get formData() {
    return <FormArray>this.formCalc.get("partA");
  }

  get formDataBDeparture() {
    return <FormArray>this.formCalc.get("partBDeparture");
  }

  get formDataBArrival() {
    return <FormArray>this.formCalc.get("partBArrival");
  }

  fetchQuotationDetails() {
    this.service
      .getQuotationData(
        this.session.loginID,
        this.session.sessionID,
        this.quotationId
      )
      .subscribe(
        quotationDetails => {
          this.quotationData = quotationDetails;
          console.log(this.quotationData);
          this.quotationInfo = Object.values(this.quotationData[0]);
          console.log(this.quotationInfo);
          this.airSpaceQuantity = this.quotationInfo[1];
          this.airSpaceSize = this.quotationInfo[2];
          this.arrivalDate = this.quotationInfo[3];
          this.selectedTransitTime = this.quotationInfo[4];
          this.consolidationWarehouse = this.quotationInfo[5];
          this.containerQuantity = this.quotationInfo[6];
          this.containerSize = this.quotationInfo[7];
          this.selectedContainerType = this.quotationInfo[8];
          this.customBroker = this.quotationInfo[9]
            ? this.quotationInfo[9]
            : "0";
          //this.selectedCustomBroker = this.quotationInfo[0];
          this.departDate = this.quotationInfo[10];
          this.uploaded_file_name = this.quotationInfo[11];
          this.halalConsolidation = this.quotationInfo[12];
          this.halalUnStuffing = this.quotationInfo[13];
          this.selectedIncoterms = this.quotationInfo[15];
          this.selectedNumberTransit = this.quotationInfo[16];
          this.port_id_departure = this.quotationInfo[17];
          this.port_id_arrival = this.quotationInfo[18];
          // this.port_id_arrival = this.quotationInfo[19];
          // this.port_id_departure = this.quotationInfo[20];
          this.quotationId = this.quotationInfo[21];
          this.quotationNo = this.quotationInfo[23];
          this.selectedShipmentType = this.quotationInfo[24];
          this.selectedQuotationFor = this.quotationInfo[25];
          this.unStuffing = this.quotationInfo[27];
          this.vesselFlightNo = this.quotationInfo[29];
          // this.fillVesselData();
          // let hs_code = this.quotationInfo[14];
          // let quotation_status = this.quotationInfo[22];
          const arrivalObj = {
            port_name: quotationDetails[0].port_name_arrival,
            port_id: this.port_id_arrival
          }
          const departureObj = {
            port_name: quotationDetails[0].port_name_departure,
            port_id: this.port_id_departure
          }

          this.selectedDeparturePort = departureObj;
          this.selectedArrivalPort = arrivalObj;
          this.setVesselData({etd: quotationDetails[0].departure_date, 
              eta: quotationDetails[0].arrival_date, vessel_id: quotationDetails[0].vessel_id});
          if (this.uploaded_file_name == "") {
            this.isUpload = true;
          } else if (this.uploaded_file_name != "") {
            this.isUpload = false;
          }
          this.updateUploadFileValidity();
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

  // download files from quotation
  download () {
    if ( this.quotationId && typeof this.quotationId != 'undefined' ) {
      // call backend api for download
      this.service
        .downloadFileUser(
          this.session.loginID,
          this.session.sessionID,
          this.quotationId
        )
        .subscribe(data => {
          if ( data ) {
            window.location.href = data.text();
          }
        })
    }
  }
  // to populate data for part a while modifying quotation
  fetchPartA() {
    this.service
      .getSeaFreightCharges(
        this.session.loginID,
        this.session.sessionID,
        this.quotationId
      )
      .subscribe(freightcharges => {
        if ( freightcharges.part_a.length > 0 ) {
          this.myModel.partA = Object.values(freightcharges["part_a"]);
          (<FormArray>this.formCalc.controls.partA).removeAt(0);
          this.myModel.partA.forEach(po =>
            (<FormArray>this.formCalc.controls.partA).push(
              this.createPayOffFormGroup(po, 'part_A')
            )
          );
        }
        
      });
  }

  // to populate data for part B Departure while modifying quotation
  fetchPartB() {
    this.service
      .getQuotationChargesBlock(
        this.session.loginID,
        this.session.sessionID,
        this.quotationId
      )
      .subscribe(chargesData => {
        if ( chargesData.location_A.length > 0 ) {
          
          this.myModel.partBArrival = Object.values(chargesData["location_A"]);
          (<FormArray>this.formCalc.controls.partBArrival).removeAt(0);
          this.myModel.partBArrival.forEach(po =>
            (<FormArray>this.formCalc.controls.partBArrival).push(
              this.createPayOffFormGroup(po)
            )
          );

        }
        if ( chargesData.location_D.length > 0 ) 
        {
          this.myModel.partBDeparture = Object.values(chargesData["location_D"]);
          (<FormArray>this.formCalc.controls.partBDeparture).removeAt(0);
          this.myModel.partBDeparture.forEach(po =>
            (<FormArray>this.formCalc.controls.partBDeparture).push(
              this.createPayOffFormGroup(po)
            )
          );
  
         
        }
       
      });
  }

  // to populate vessel data in fields
  // fillVesselData() {
  //   this.service
  //     .getListBasedOnVessel(
  //       this.session.loginID,
  //       this.session.sessionID,
  //       this.vesselFlightNo
  //     )
  //     .subscribe(getListInfo => {
  //       this.infoBasedVessel = getListInfo;
  //       this.selectedDeparturePort = this.infoBasedVessel[
  //         "port_name_departure"
  //       ];
  //       this.selectedArrivalPort = this.infoBasedVessel["port_name_arrival"];
  //       this.departDate = this.infoBasedVessel["etd"];
  //       this.arrivalDate = this.infoBasedVessel["eta"];
  //       this.port_id_departure = this.infoBasedVessel["port_id_departure"];
  //       this.port_id_arrival = this.infoBasedVessel["port_id_arrival"];
  //       // set value to form group object to form gets validated
  //       this.form.patchValue({
  //         etd: this.departDate,
  //         eta: this.arrivalDate,
  //         departurePort: this.selectedDeparturePort,
  //         arrivalPort: this.selectedArrivalPort
  //       });
  //       this.vesselFlightNo = this.infoBasedVessel['vessel_id'];
  //     });
  // }
  
  // add row in partA
  addPartA(event) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    
    var emptyPayOff = { amount: null, charges_description: null };

    if (
      this.myModel.partA[this.myModel.partA.length - 1].charges_description >
        "" &&
      this.myModel.partA[this.myModel.partA.length - 1].amount > 0
    ) {
      this.myModel.partA.push(emptyPayOff);
      (<FormArray>this.formCalc.controls.partA).push(
        this.createPayOffFormGroup(emptyPayOff, 'part_A')
      );
      this.setFocus(this.myModel.partA.length, 'parta');
      
    }
  }
  setFocus(length = 1, elementId = 'default') {
    const lengthCal = length - 1;
    setTimeout(function () {
      document.getElementById(elementId + lengthCal  ).focus();
    }, 500);
  }
  // remove row in partA
  deletePartA(index: number) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    if (this.myModel.partA.length > 1) {
      this.myModel.partA.splice(index, 1);
      (<FormArray>this.formCalc.controls.partA).removeAt(index);
    }
  }

  // add row in partB Departure
  addPartBDeparture(event) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    var emptyPayOff = {
      charges_description: null,
      amount: null,
      unit_of_measure_id: null,
      charges_location: this.locationD
    };
    if (
      this.myModel.partBDeparture[this.myModel.partBDeparture.length - 1]
        .charges_description > "" &&
      this.myModel.partBDeparture[this.myModel.partBDeparture.length - 1]
        .amount > 0
    ) {
      this.myModel.partBDeparture.push(emptyPayOff);
      (<FormArray>this.formCalc.controls.partBDeparture).push(
        this.createPayOffFormGroup(emptyPayOff)
      );
      this.setFocus(this.myModel.partBDeparture.length, 'partBD');
    }
  }

  // delete row in partB Departure
  deletePartBDeparture(index: number) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    if (this.myModel.partBDeparture.length > 1) {
      this.myModel.partBDeparture.splice(index, 1);
      (<FormArray>this.formCalc.controls.partBDeparture).removeAt(index);
    }
  }

  // add row in partB Arrival
  addPartBArrival(event) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    var emptyPayOff = {
      charges_description: null,
      amount: null,
      unit_of_measure_id: null,
      charges_location: this.locationA
    };
    if (
      this.myModel.partBArrival[this.myModel.partBArrival.length - 1]
        .charges_description > "" &&
      this.myModel.partBArrival[this.myModel.partBArrival.length - 1].amount > 0
    ) {
      this.myModel.partBArrival.push(emptyPayOff);
      (<FormArray>this.formCalc.controls.partBArrival).push(
        this.createPayOffFormGroup(emptyPayOff)
      );
      this.setFocus(this.myModel.partBArrival.length, 'partBA');
    }
  }

  // delete row in partB Arrival
  deletePartBArrival(index: number) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    if (this.myModel.partBArrival.length > 1) {
      this.myModel.partBArrival.splice(index, 1);
      (<FormArray>this.formCalc.controls.partBArrival).removeAt(index);
    }
  }

  // calculate a sum of all partB and partB2s
  sumPartB2() {
    const totalA = this.myModel.partBDeparture.reduce(
      (sum = 0, val) => sum + val.amount,
      0
    );
    const totalB = this.myModel.partBArrival.reduce(
      (sum = 0, val) => sum + val.amount,
      0
    );
    return totalA + totalB;
   
  }

  //disabling and enabling save button in html
  statusAgreed() {
    this.isAgreed = !this.isAgreed;
    if ( !this.isAgreed ) {
      this.form.patchValue({
        statusAgreed: false
      })
    }
  }

  //once user clicks, it will check whether quotation information are valid and save the details
  updateQuotation() {
    
    // calculate total part a
    this.totalPartA = this.myModel.partA.reduce(
      (sum = 0, val) => sum + val.amount,
      0
    );
    this.totalPartB = this.sumPartB2();
    let quotationChargesBlock = {'part_D':this.myModel.partBDeparture, 'part_A':this.myModel.partBArrival};
    // console.log(this.myModel.partA);
    // console.log(this.myModel.partBDeparture);
    // console.log(this.myModel.partBArrival);
    // console.log(quotationChargesBlock);
    let method = 'post';
    let successMessage = 'added';
    // return;
    // if we updating then send patch request
    if ( this.quotationId != '' && typeof this.quotationId != 'undefined' ) {
      method = 'patch';
      successMessage = 'updated';
    }
    if (this.form.valid && this.isAgreed ) {
    let supplierQuotationData = {
      quotationId: this.quotationId,
      shipper_type: this.selectedQuotationFor,
      vessel_flight_no: this.vesselFlightNo,
      custom_broker: this.customBroker == "0" ? null : this.customBroker,
      container_types: this.selectedContainerType,
      shipment_type_id: this.selectedShipmentType,
      container_box_count: this.containerQuantity,
      container_box_size: this.containerSize,
      incoterm_code: this.selectedIncoterms,
      air_space_count: null,
      air_space_size: this.airSpaceSize,
      cargo_transit_duration: this.selectedTransitTime,
      number_of_transit_ports: this.selectedNumberTransit,
      halal_consolidation: this.halalConsolidation
        ? this.halalConsolidation
        : "",
      halal_unstuffing: this.halalUnStuffing ? this.halalUnStuffing : "",
      consolidation: this.consolidationWarehouse
        ? this.consolidationWarehouse
        : "",
      unstuffing: this.unStuffing ? this.unStuffing : "",
      departure_date: this.departDate,
      arrival_date: this.arrivalDate,
      hs_code: "1",
      quotation_status: "DRAFT",
      quote_for: this.quotationNo,
      port_id_from: String(this.port_id_departure),
      port_id_to: String(this.port_id_arrival),
      part_a: this.totalPartA,
      part_b: this.totalPartB
    };
    //send json data of NQT
    this.service
      .updateNewQuotation(
        this.session.loginID,
        this.session.sessionID,
        supplierQuotationData
      )
      .subscribe(
        status => {
          this.response = Object.values(status);
          this.rawJsonError = status;
          this.message = Object.values(this.rawJsonError);
          this.quotationId = this.message[0]; //get the quotation id and pass it to upload API for file naming
          if (this.response[1] == 200) {
            this.showSuccess(successMessage); //to show success notification
            const formModel = this.prepareSave(); //pass file data in one var
            this.service.uploadFile(formModel).subscribe(); //call uploadFile API
            this.service
              .postHandlingCharges(
                this.session.loginID,
                this.session.sessionID,
                this.quotationId,
                quotationChargesBlock,
                method
                // this.myModel.partBDeparture
              )
              .subscribe(); //call quotationhandlingcharges API
            // this.service
            //   .postHandlingCharges(
            //     this.session.loginID,
            //     this.session.sessionID,
            //     this.quotationId,
            //     this.myModel.partBArrival
            //   )
            //   .subscribe(); //call quotationhandlingcharges API
            this.service
              .postSeaFreightCharges(
                this.session.loginID,
                this.session.sessionID,
                this.quotationId,
                this.myModel.partA,
                method
              )
              .subscribe(); //call postSeaFreightCharges API
            this.router.navigateByUrl("supplier/quotation"); //if successful navigate to quotation dashboard
            this.isUpload = true;
          }
        },
        error => {
          this.response = Object.values(error);
          if (this.response[1] == 400) {
            this.showFailure(); //to show failure notification
          }
        }
      );
    // }
    }
  }
  
  //to show success notification properties
  showSuccess(method = 'added') {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success("Your quotation "+method+" successfully!", "Successful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  //to show failure notification properties
  showFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error("Please check your details!", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  showuploadSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success("Your document uploaded successfully!", "Successful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }

  //to show failure notification properties
  showuploadFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error("Your document failed to upload", "Unsuccessful!", {
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      positionClass: "toast-top-right"
    });
  }
  showuploadError() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error(
      "Something wrong happend. Pease refresh your browser and try again",
      "Unsuccessful!",
      {
        closeButton: true,
        progressBar: true,
        progressAnimation: "increasing",
        positionClass: "toast-top-right"
      }
    );
  }
}
