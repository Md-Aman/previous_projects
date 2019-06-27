import { PublicApiService } from "./../../services/public-api.service";
import { Component, OnInit, NgModule } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IMyDpOptions } from "mydatepicker";
import { IMyOptions, IMyDateModel } from "mydatepicker";
import { SharedService } from '@shared/services/shared.service';

@NgModule({
  imports: [Ng2AutoCompleteModule]
})
@Component({
  selector: "searchbox",
  templateUrl: "./searchbox.component.html",
  styleUrls: ["./searchbox.component.css"]
})
export class SearchboxComponent implements OnInit {
  form: FormGroup;
  myControl: FormControl = new FormControl();

  listItems: any[];
  listValues: any[];
  portsValues: any[];
  hsCodeValues: any[];
  containerTypeValues:any[];
  session: any[];
  searchBoxDetails: any[];

  // to store data for searchbox-session
  selectedDeparturePort: string;
  selectedArrivalPort: string;
  selectedContainerType:number;
  merchandiseValue: number;
  port_to;
  port_from;
  CBM: number;
  estimatedWeight: string;
  sixDigitHSCode: string;
  departDate: string;
  arrivalDate: string;
  displayQuote: false;
  constructor(
    private sharedService: SharedService,
    private service: PublicApiService,
    private formBuilder: FormBuilder,

    public router: Router,
    private _sanitizer: DomSanitizer
  ) {
    this.service.getSearchboxLists().subscribe(searchboxLists => {
      this.listItems = searchboxLists;
      this.listValues = Object.values(this.listItems);
      this.portsValues = Object.values(this.listValues[2]);
      this.hsCodeValues = Object.values(this.listValues[1]);
      this.containerTypeValues = Object.values(this.listValues[0]);
      // console.log(this.containerTypeValues);
    });
  }

  ngOnInit() {
    this.sharedService.currentMessage.subscribe(data => {
      if ( data.event === 'getQuoteBox' ) {
        this.displayQuote = data.status;
      }
    });
    if (this.router.url === '/') {
      sessionStorage.removeItem('searchbox-session');
    }
    this.form = this.formBuilder.group({
      depart: [null, Validators.required],
      arrive: [null, Validators.required],
      weight: [null, Validators.required],
      hs: [null, Validators.required],
      cbm: [null, Validators.required],
      halalNonhalalStatus: [null, Validators.required],
      transport: [null, Validators.required],
      shipper: [null, Validators.required],
      eta: [null, Validators.required],
      etd: [null, Validators.required],
      container: [null, Validators.required],
      merchandise:[null, Validators.required]
    });

    this.selectedContainerType = 1;

    this.session = JSON.parse(sessionStorage.getItem("searchbox-session"));

    if (sessionStorage.getItem("searchbox-session")>""){
    this.searchBoxDetails = Object.values(this.session);

    this.selectedDeparturePort = this.searchBoxDetails[0];
    this.selectedArrivalPort = this.searchBoxDetails[1];
    this.CBM = this.searchBoxDetails[2];
    this.estimatedWeight = this.searchBoxDetails[3];
    this.sixDigitHSCode = this.searchBoxDetails[4];
    this.selectedHalalNonhalalStatus = this.searchBoxDetails[5];
    this.selectedTransportType = this.searchBoxDetails[6];
    this.selectedShipperType = this.searchBoxDetails[7];
    this.arrivalDate = this.searchBoxDetails[8];
    this.departDate = this.searchBoxDetails[9];
    this.port_from = this.searchBoxDetails[10];
    this.port_to = this.searchBoxDetails[11];
    this.selectedContainerType = this.searchBoxDetails[12];
    this.merchandiseValue = this.searchBoxDetails[13];
    }
  }

  public mytime: Date = new Date();
  currentYear: any = this.mytime.getUTCFullYear();
  currentDate: any = this.mytime.getUTCDate();
  currentMonth: any = this.mytime.getUTCMonth() + 1; //months from 1-12

  public myStartDateOptions: IMyOptions = {
    dateFormat: "yyyy-mm-dd",
    // disableUntil: {year: this.currentYear, month: this.currentMonth, day: this.currentDate}
  };

  public myEndDateOptions: IMyOptions = {
    dateFormat: "yyyy-mm-dd",
    disableUntil: { year: 0, month: 0, day: 0 }
  };

  public onStartDateChanged(event: IMyDateModel) {
    if (!event.jsdate) {
      return;
    }

    let d: Date = new Date(event.jsdate.getTime());

    // set previous of selected date
    d.setDate(d.getDate());

    // Get new copy of options in order the date picker detect change
    let copy: IMyOptions = this.getCopyOfOptions();
    copy.disableUntil = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
    this.myEndDateOptions = copy;
  }

  // Returns copy of myStartDateOptions
  getCopyOfOptions(): IMyOptions {
    return JSON.parse(JSON.stringify(this.myStartDateOptions));
  }
  closeGetQuoteDialog() {
    this.displayQuote = false;
  }
  public onEndDateChanged(event: IMyDateModel) {
    if (!event.jsdate) {
      return;
    }

    let d: Date = new Date(event.jsdate.getTime());

    // set next of selected date
    d.setDate(d.getDate() + 1);

    // Get new copy of options in order the date picker detect change
    let copy: IMyOptions = this.getCopyOfEndOptions(this.myStartDateOptions);
    copy.disableSince = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
    this.myStartDateOptions = copy;
  }

  public getCopyOfEndOptions(options): IMyOptions {
    return JSON.parse(JSON.stringify(options));
  }

  // display the hscode dropdown
  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.hs_code}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  // display the port dropdown
  autocomplePortListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.port_name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  halalNonhalastatus: Array<Object> = ["Halal", "Non-Halal"];
  selectedHalalNonhalalStatus = this.halalNonhalastatus[0];

  transportType: any = [{id: 0, type: "Any"}, {id: 1, type: "Sea Freight" }, {id: 2, type: "Air Freight"} ];
  selectedTransportType = this.transportType[0].id;

  shipperType: Array<Object> = ["Importer", "Exporter"];
  selectedShipperType = this.shipperType[0];

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      "has-error": this.isFieldValid(field),
      "has-feedback": this.isFieldValid(field)
    };
  }

  onSubmit() {
    let searchBoxSessionDetails = {
      DeparturePort: this.selectedDeparturePort["port_id"],
      ArrivalPort: this.selectedArrivalPort["port_id"],
      CBM: this.CBM,
      EstimatedWeight: this.estimatedWeight,
      SixDigitHSCode: this.sixDigitHSCode["hs_code"],
      HalalStatus: this.selectedHalalNonhalalStatus,
      TransportType: this.selectedTransportType,
      ShipperType: this.selectedShipperType,
      ETA: this.arrivalDate["formatted"],
      ETD: this.departDate["formatted"],
      PortFrom: this.selectedDeparturePort["port_name"],
      PortTo: this.selectedArrivalPort["port_name"],
      container: this.selectedContainerType,
      MerchandiseValue: this.merchandiseValue
    };
    
    
    if (this.form.valid) {
      sessionStorage.setItem(
        "searchbox-session",
        JSON.stringify(searchBoxSessionDetails)
      );
      this.service.searchbox = searchBoxSessionDetails;
      this.service.sendUpdateSearchResult();
      console.log(searchBoxSessionDetails)
      this.router.navigate(["/searchresult"]);
      // window.scrollBy({ top: 900, left: 0, behavior: "smooth" });
      
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
