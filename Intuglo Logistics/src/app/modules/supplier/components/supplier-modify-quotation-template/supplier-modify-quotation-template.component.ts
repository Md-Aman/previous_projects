import { Router } from '@angular/router';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SupplierApiService } from "./../../services/supplier-api.service";
import { MatDialog } from '@angular/material';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ToastrService } from 'ngx-toastr';
import { SessionStorage } from '../../../models/session-storage';
import { SupplierSessionExpiredDialogComponent } from '../supplier-session-expired-dialog/supplier-session-expired-dialog.component';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
// import { Injectable } from '@angular/core';
// import { RequestOptions, ResponseContentType } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { InterceptorService } from 'ng2-interceptors';

// import { ConfigService } from 'app/common/services/config.service';
// import { getFileNameFromResponseContentDisposition, saveFile } from 'app/core/helpers/file-download-helper';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'supplier-modify-quotation-template',
  templateUrl: './supplier-modify-quotation-template.component.html',
  styleUrls: ['./supplier-modify-quotation-template.component.css']
})
export class SupplierModifyQuotationTemplateComponent implements OnInit {

  //Create instance of SessionStorage
  session = new SessionStorage();

  @ViewChild('quotationName') quotationName: ElementRef;

  form: FormGroup;                  // form for create new quotation
  formm: FormGroup;                 // form for upload file
  formCalc: FormGroup;              // form for handling charges
  myModel:any;                      // model for calculation
  isAgreed: boolean = false;
  todayDate;
  totalA;                           // total for table A
  totalB;                           // total for table B
  response: any[];
  SessionDetails: any[];
  sessionDetails: any[];
  supplierDetails: any[];
  supplierLoginDetails: any[];
  message: any[];
  rawJsonError: any[];
  quotationId;                      // var to represent quotation_id for file upload naming

  // populate dropdown
  portsAndHsCode: any[];
  portsAndHsCodeValues: any[];
  portsValues: any[];
  hsCodeValues: any[];
  shipsValues: any[];
  incotermValues: any[];

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
  selectedContainerType: string;
  selectedShipmentType;
  selectedIncoterms;
  selectedTransitTime: string;
  selectedDeparturePort: string;
  selectedArrivalPort: string;
  selectedNumberTransit: number;
  etd: Date;
  eta: Date;
  q_id;                                 // quotation id for modify quotation
  quotationData;
  quotationInfo;
  supplierQuotationInfo: any[];
  profileInfo: any[];
  isUpload: boolean = true;
  port;
  port_from;
  port_to;
  file_name;
  customBrokerId;
  isSelected: boolean = false;
  infoBasedVessel;
  departDate;
  arrivalDate;
  port_id_departure;
  port_id_arrival;
  vesselFlightId;
  selectedDeparturePortId;
  selectedArrivalPortId;
  customAgentList;
  vesselList;
  download;
  quotationChargesInfo;
  quotationCharges;
  measureUnit;
  quotationChargesData;

  changeEtd(etd) {
    this.etd = etd;
  }

  changeEta(eta) {
    this.eta = eta;
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

    this.service.getPortHsCode()
      .subscribe(searchPortsAndHsCode => {
        this.portsAndHsCode = searchPortsAndHsCode;
        this.portsAndHsCodeValues = Object.values(this.portsAndHsCode);
        this.incotermValues = this.portsAndHsCodeValues[0];
        this.portsValues = Object.values(this.portsAndHsCodeValues[1]);
        this.shipsValues = this.portsAndHsCodeValues[2];
      });

    // initializing a model for the form to keep in sync with. 
    // usually you'd grab this from a backend API
    this.myModel = {
      partA: [
        {}
      ],
      partB: [
        {}
      ],
      partB2: [
        {}
      ]
    }

    // initialize form with empty FormArray for partA, partB, partB2
    this.formCalc = new FormGroup({
      name: new FormControl(''),
      partA: new FormArray([]),
      partB: new FormArray([]),
      partB2: new FormArray([]),
    });
    // now we manually use the model and push a FormGroup into the form's FormArray for each Part
    this.myModel.partA.forEach( 
      (po) => 
        (<FormArray>this.formCalc.controls.partA).push(this.createPayOffFormGroup(po))
    );
    this.myModel.partB.forEach( 
      (po) => 
        (<FormArray>this.formCalc.controls.partB).push(this.createPayOffFormGroup(po))
    );
    this.myModel.partB2.forEach( 
      (po) => 
        (<FormArray>this.formCalc.controls.partB2).push(this.createPayOffFormGroup(po))
    );
    this.formCalc.controls.partA.valueChanges.subscribe((change) => {
      const calculateAmount = (partA: any[]): number => {
        return partA.reduce((acc, current) => {
           return acc + parseFloat(current.usd || 0);
        }, 0);
      }

      console.log(calculateAmount(this.formCalc.controls.partA.value));
    });
    this.formCalc.controls.partB2.valueChanges.subscribe((change) => {
      const calculateAmount = (partB2: any[]): number => {
        return partB2.reduce((acc, current) => {
           return acc + parseFloat(current.price2 || 0);
        }, 0);
      }

      console.log(calculateAmount(this.formCalc.controls.partB2.value));
    });
    this.formCalc.controls.partB.valueChanges.subscribe((change) => {
      const calculateAmount = (partB: any[]): number => {
        return partB.reduce((acc, current) => {
           return acc + parseFloat(current.price || 0);
        }, 0);
      }

      console.log(calculateAmount(this.formCalc.controls.partB.value));
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.formm.get('quotationUploader').setValue(file);
      let namefile = <HTMLInputElement>document.getElementById("quotationName");
      namefile.innerHTML=file.name;    
    }
  }

  onFileReset() {
    let namefile = <HTMLInputElement>document.getElementById("quotationName");
    namefile.innerHTML="";
    let newfile = <HTMLInputElement>document.getElementById("quotationUploader");
    newfile.value="";
    this.isUpload = false;
  }

  private prepareSave(): any {
    let input = new FormData();
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    // input.append('name', this.form.get('name').value);
    input.append('quotationUploader', this.formm.get('quotationUploader').value);
    input.append('quotation_id', this.quotationId);
    return input;
  }

  ngOnInit() {
    this.formm = this.fb.group({
      quotationUploader: null,
    });

    //validation that required before sending out the data
    this.form = new FormGroup({
      referenceNo: new FormControl('', [
        Validators.required
      ]),
      quotationFor: new FormControl('', [
        Validators.required
      ]),
      vesselFlightNo: new FormControl('', [
        Validators.required
      ]),
      etd: new FormControl('', [
        Validators.required
      ]),
      eta: new FormControl('', [
        Validators.required
      ]),
      departurePort: new FormControl('', [
        Validators.required
      ]),
      arrivalPort: new FormControl('', [
        Validators.required
      ]),
      customBroker: new FormControl('', [
        Validators.required,
      ]),
      containerTypes: new FormControl('', [
        Validators.required
      ]),
      shipmentTypes: new FormControl('', [
        Validators.required
      ]),
      containerQuantity: new FormControl('', [
        Validators.required
      ]),
      containerSize: new FormControl('', [
        Validators.required
      ]),
      incoterms: new FormControl('', [
        Validators.required
      ]),
      airSpaceQuantity: new FormControl('', [
        Validators.required
      ]),
      airSpaceSize: new FormControl('', [
        Validators.required
      ]),
      transitTime: new FormControl('', [
        Validators.required
      ]),
      noTransitPort: new FormControl('', [
        Validators.required
      ]),
      quotationUpload: new FormControl('', [
        Validators.required
      ])
    });

    this.q_id = this.service.getQId();        //get quotation id for modify quotation
    
    
   
    this.service.getQuotationData(this.session.loginID, this.session.sessionID, this.q_id)
      .subscribe(quotationDetails => {
        this.quotationData = quotationDetails;
        this.quotationInfo = Object.values(this.quotationData[0])
        this.airSpaceQuantity = this.quotationInfo[1];
        this.airSpaceSize = this.quotationInfo[2];
        this.arrivalDate = this.quotationInfo[3];
        this.selectedTransitTime = this.quotationInfo[4];
        this.consolidationWarehouse = this.quotationInfo[5];
        this.containerQuantity = this.quotationInfo[6];
        this.containerSize = this.quotationInfo[7];
        this.selectedContainerType = this.quotationInfo[8];
        this.customBroker = this.quotationInfo[9];
        this.customBrokerId = this.quotationInfo[0];
        this.departDate = this.quotationInfo[10];
        this.file_name = this.quotationInfo[11];
        this.halalConsolidation = this.quotationInfo[12];
        this.halalUnStuffing = this.quotationInfo[13];
        this.selectedIncoterms = this.quotationInfo[15];
        this.selectedNumberTransit = this.quotationInfo[16];
        this.port_id_departure = this.quotationInfo[17];
        this.port_id_arrival = this.quotationInfo[18];
        this.selectedArrivalPortId = this.quotationInfo[19];
        this.selectedDeparturePortId = this.quotationInfo[20];
        this.quotationId = this.quotationInfo[21];
        this.quotationNo = this.quotationInfo[23];
        this.selectedShipmentType = this.quotationInfo[24];
        this.selectedQuotationFor = this.quotationInfo[25];
        this.unStuffing = this.quotationInfo[27];
        this.vesselFlightNo = this.quotationInfo[28];
        this.vesselFlightId = this.quotationInfo[29];        
        // let hs_code = this.quotationInfo[14];
        // let quotation_status = this.quotationInfo[22];
        if(this.file_name == ""){
          this.isUpload = false
        }else if (this.file_name != ""){
          this.isUpload = true
        }
      },
    error =>{
      if(error.status == 400){
        this.dialog.open(SupplierSessionExpiredDialogComponent,{disableClose: true});
      }
    });
    // not using this service anymore
    // this.service
    //   .getQuotationCharges()
    //   .subscribe(searchChargesAndMeasureUnit => {
    //     this.quotationChargesInfo = searchChargesAndMeasureUnit;
    //     this.quotationChargesData = Object.values(this.quotationChargesInfo);
    //     // this.quotationCharges = this.quotationChargesData[0];
    //     this.measureUnit = this.quotationChargesData[0];
    //     return this.quotationCharges, this.measureUnit;
    //   });

    this.service.getCustomAgentList(this.session.loginID, this.session.sessionID).subscribe(getCustomAgent => {
      this.customAgentList = getCustomAgent;
    });

    this.service.getVesselList(this.session.loginID, this.session.sessionID)
    .subscribe(getVesselInfo => {
      this.vesselList = getVesselInfo;
    });
  }

  onSelectVessel(vessel: boolean){
    this.isSelected = vessel;
    this.service.getListBasedOnVessel(this.session.loginID, this.session.sessionID, this.vesselFlightNo)
    .subscribe(getListInfo => {
      this.infoBasedVessel = getListInfo;
      this.selectedDeparturePort = this.infoBasedVessel[0]['port_name_departure'];
      this.selectedArrivalPort = this.infoBasedVessel[0]['port_name_arrival'];
      this.departDate = this.infoBasedVessel[0]['etd'];
      this.arrivalDate = this.infoBasedVessel[0]['eta'];
      this.port_id_departure = this.infoBasedVessel[0]['port_id_departure'];
      this.port_id_arrival = this.infoBasedVessel[0]['port_id_arrival'];
    });
  }

  autocomplePortListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.port_name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  createPayOffFormGroup(payOffObj) {
    console.log("payOffObj", payOffObj);
    return new FormGroup({
      freight: new FormControl(payOffObj.freight),
      usd: new FormControl(payOffObj.usd),
      // item: new FormControl(payOffObj.item),
      desc: new FormControl(payOffObj.desc),
      // supplier: new FormControl(payOffObj.supplier),
      price: new FormControl(payOffObj.price),
      unit: new FormControl(payOffObj.unit),
      desc2: new FormControl(payOffObj.desc2),
      // supplier2: new FormControl(payOffObj.supplier2),
      price2: new FormControl(payOffObj.price2),
      unit2: new FormControl(payOffObj.unit2),
    });
  }

  get formData() { return <FormArray>this.formCalc.get('partA'); }

  get formDataB() { return <FormArray>this.formCalc.get('partB'); }

  get formDataB2() { return <FormArray>this.formCalc.get('partB2'); }

  // add row in partA
  addPartA(event) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    var emptyPayOff = {freight: null, usd: null};

    this.myModel.partA.push(emptyPayOff);
    (<FormArray>this.formCalc.controls.partA).push(this.createPayOffFormGroup(emptyPayOff));
    console.log("Added New Pay Off", this.formCalc.controls.partA)
  }

  // calculate a sum of all partA
  sumPartA() {
    return this.myModel.partA.reduce((sum, val) => sum + val.usd, 0);
  }

  // remove row in partA
  deletePartA(index:number) {
    this.myModel.partA.splice(index, 1);
    (<FormArray>this.formCalc.controls.partA).removeAt(index);
  }

  // add row in partB
  addPartB(event) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    var emptyPayOff = {supplier: null, price: null, unit: null};

    this.myModel.partB.push(emptyPayOff);
    (<FormArray>this.formCalc.controls.partB).push(this.createPayOffFormGroup(emptyPayOff));
    console.log("Added New Pay Off", this.formCalc.controls.partB)
  }

  // delete row in partB
  deletePartB(index:number) {
    this.myModel.partB.splice(index, 1);
    (<FormArray>this.formCalc.controls.partB).removeAt(index);
  }

  // add row in partB2
  addPartB2(event) {
    event.preventDefault(); // ensure this button doesn't try to submit the form
    var emptyPayOff = {supplier2: null, price2: null, unit2: null};

    this.myModel.partB2.push(emptyPayOff);
    (<FormArray>this.formCalc.controls.partB2).push(this.createPayOffFormGroup(emptyPayOff));
    console.log("Added New Pay Off", this.formCalc.controls.partB2)
  }

  // delete row in partB2
  deletePartB2(index:number) {
    this.myModel.partB2.splice(index, 1);
    (<FormArray>this.formCalc.controls.partB2).removeAt(index);  
  }

  // calculate a sum of all partB and partB2
  sumPartB2() {
    this.totalA = this.myModel.partB2.reduce((sum, val) => sum + val.price2, 0);
    this.totalB = this.myModel.partB.reduce((sum, val) => sum + val.price, 0);
    return (this.totalA + this.totalB);
  }

  //disabling and enabling save button in html
  statusAgreed() {
    this.isAgreed = !this.isAgreed;
  }

  //once user clicks, it will check whether quotation information are valid and save the details
  updateQuotation() {
    if (this.form.valid) {
      // this.selectedArrivalPort = String(this.port_to);
      // this.selectedDeparturePort = String(this.port_from);
        if(this.quotationId == this.quotationId){
          let supplierQuotationData = {
            cargo_transit_duration: this.selectedTransitTime,
            departure_date: this.departDate,
            number_of_transit_ports: this.selectedNumberTransit,
            container_box_size : this.containerSize,
            shipment_type_id : this.selectedShipmentType,
            quote_for: this.quotationNo,
            incoterm_code: this.selectedIncoterms,
            shipper_type : this.selectedQuotationFor,
            arrival_date: this.arrivalDate, 
            custom_broker : this.customBroker,
            vessel_flight_no : this.vesselFlightNo,
            container_box_count : this.containerQuantity,
            air_space_size: this.airSpaceSize,
            air_space_count: this.airSpaceQuantity,
            container_types : this.selectedContainerType,
            halal_consolidation: this.halalConsolidation ? this.halalConsolidation:"",
            halal_unstuffing: this.halalUnStuffing ? this.halalUnStuffing:"",
            unstuffing: this.unStuffing ? this.unStuffing:"",
            consolidation: this.consolidationWarehouse ? this.consolidationWarehouse:"",
            quotation_id: this.quotationId,
            port_id_from : String(this.port_id_departure),
            port_id_to : String(this.port_id_arrival),
        }
        this.service.modifyQuotation(this.session.loginID,this.session.sessionID,supplierQuotationData)
          .subscribe(
          status => {
            this.response = Object.values(status);
            this.rawJsonError = status;
            this.message = Object.values(this.rawJsonError);
            console.log(this.message)
            this.quotationId = this.message[0];
            if(this.response[1] == 200 ) {
              this.showSuccess();     //to show success notification
              this.router.navigate(['supplier/quotation']);
              const formModel = this.prepareSave(); //pass file data in one var
              this.service.uploadFile(formModel).subscribe(); //call uploadFile API
            }
        },
          error => {
            this.response = Object.values(error)
            if (this.response[1] == 400) {
              this.showFailure();         //to show failure notification
            }
          }
        );
        this.router.navigateByUrl('supplier/quotation');
      }
    } else {
      this.showFailure(); 
    }
  }

  
  onDeleteFile(){
    let quotationId = {"quotationId": this.quotationId}
    console.log(quotationId);
    this.service.removeFileUser(this.session.loginID,this.session.sessionID, quotationId)
    .subscribe(
      status => {
        this.response = Object.values(status)
        console.log (this.response)
        if (this.response[1] == 200) {
          this.isUpload = false;
          console.log('File deleted!');
          this.showRemoveFileSuccess();     //to show success notification
      }
    },
    error => {
      this.response = Object.values(error)
      if (this.response[1] == 400) {
        this.showRemoveFileFailure();     //to show failure notification
    }
  }
);
}

onDownloadFile(){
  let quotationId = {"quotationId": this.quotationId}
  console.log(quotationId);
  this.service.downloadFileUser(this.session.loginID,this.session.sessionID, this.quotationId)
  .subscribe(
    status => {
      this.response = Object.values(status)
      if (this.response[1] == 200) {
        console.log('File downloaded!');
        this.download = this.response[0];
        console.log(this.download)
        // window.URL.re
        // var url = window.URL.createObjectURL(this.download);
        var a = document.createElement('a');
        console.log(Object.values(status))
        // a.href=window.URL.createObjectURL(this.download);
        document.body.appendChild(a);
        // window.open= this.download;
        window.open(this.download, "_blank");
        a.click();
        // window.URL.revokeObjectURL(url);
        a.remove();
        this.showDownloadFileSuccess();     //to show success notification
      }
    if (this.response[1] == 204) {
      console.log('File not downloaded!');
      this.showDownloadFileFailure();     //to show failure notification
      }
  },
  error => {
    this.response = Object.values(error)
    if (this.response[1] == 400) {
      this.showDownloadFileFailure();     //to show failure notification
  }
  

}
);
}

  //to show success notification properties
  showSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success('Your quotation added successfully!', 'Successful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showRemoveFileSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success('File removed successfully!', 'Successful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showDownloadFileSuccess() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.success('File downloaded successfully!', 'Successful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  //to show failure notification properties
showFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('Please check your details!', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showRemoveFileFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('File not removed!', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }

  showDownloadFileFailure() {
    // window.scrollBy({ top:-900, left:0, behavior: 'smooth'});
    this.toastr.error('File not downloaded!', 'Unsuccessful!', {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
  }
}