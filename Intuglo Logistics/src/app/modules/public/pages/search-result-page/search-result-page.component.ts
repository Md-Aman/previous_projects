import { Component, OnInit, Input } from "@angular/core";
import { PublicApiService } from "../../services/public-api.service";
import { Router } from "@angular/router";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Http } from "@angular/http";
import { ConfigService } from "../../../../config/config.service";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: "search-result-page",
  templateUrl: "./search-result-page.component.html",
  styleUrls: ["./search-result-page.component.css"]
})
export class SearchResultPageComponent implements OnInit {
  subscribe: Subscription;
  searchResultCollection;
  searchResultType;
  searchCollection = []; //pass value of records from json
  searchboxDetails: any;
  sessionDetails: any[];

  i: number;
  loopIndex: number;

  private server_url = this.configService.server_url;

  //var for searchbox
  cbm;
  weight;
  depart;
  arrive;
  halalStatus;
  shipperType;
  hscode;
  transportType;
  eta;
  etd;
  offset: string = "0";
  halal;
  shipper_type;
  transport_type;
  container_type;
  merchandise_value;

  constructor(
    private router: Router,
    private publicApiService: PublicApiService,
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.subscribe = this.publicApiService
      .getNewSearchValue()
      .subscribe(newSearchValue => {
        this.ngOnInit();
      });
    // getting searchbox session from searchbox component
    this.searchboxDetails = JSON.parse(
      sessionStorage.getItem("searchbox-session")
    );

    if (this.searchboxDetails) {
      this.cbm = this.searchboxDetails.CBM;
      this.weight = this.searchboxDetails.EstimatedWeight;
      this.depart = this.searchboxDetails.DeparturePort;
      this.arrive = this.searchboxDetails.ArrivalPort;
      this.halalStatus = this.searchboxDetails.HalalStatus;
      this.hscode = this.searchboxDetails.SixDigitHSCode;
      this.transport_type = this.searchboxDetails.TransportType;
      // console.log('search resulttt', this.transportType);
      // if (this.transportType == 'Sea Freight'){
      //   this.transport_type = 1;
      // } else if (this.transportType == 'Air Freight'){
      //   this.transport_type = 2;
      // } else if (this.transportType == 'Any'){
      //   this.transport_type = 3;
      // }
      this.shipperType = this.searchboxDetails.ShipperType;
      if (this.shipperType == "Importer") {
        this.shipper_type = "I";
      } else if (this.shipperType == "Exporter") {
        this.shipper_type = "E";
      }
      this.eta = this.searchboxDetails.ETA;
      this.etd = this.searchboxDetails.ETD;
      if (this.halalStatus == "Non-Halal") {
        this.halal = "N";
      } else if (this.halalStatus == "Halal") {
        this.halal = "H";
      }
      this.container_type = this.searchboxDetails.container;
      this.merchandise_value = this.searchboxDetails.MerchandiseValue;
    }
    // let searchResultCollectionService = new PublicApiService(null,null);
    // this.searchResultCollection = publicApiService.getSearchResultCollection();
    // this.i = 0;
    // this.loopIndex = 3;

    /*    for(let i=1; i<=2; i++){
          this.searchCollection.push(i);
        }
    /*    for(let i=1; i<=3; i++){
          this.searchResultCollection.push(i);
        } */
  }
  ngOnInit() {
    this.searchboxDetails = JSON.parse(
      sessionStorage.getItem("searchbox-session")
    );
    let filter = false;
    let quotation_id = '';
    let logistic_patner = '';
    let price_start ;
    let price_end;
    let incoterm = '';
    if (this.searchboxDetails) {
      this.cbm = this.searchboxDetails.CBM;
      this.weight = this.searchboxDetails.EstimatedWeight;
      this.depart = this.searchboxDetails.DeparturePort;
      this.arrive = this.searchboxDetails.ArrivalPort;
      this.halalStatus = this.searchboxDetails.HalalStatus;
      this.hscode = this.searchboxDetails.SixDigitHSCode.hs_code
        ? this.searchboxDetails.SixDigitHSCode.hs_code
        : this.searchboxDetails.SixDigitHSCode;
      this.transport_type = this.searchboxDetails.TransportType;
      // if (this.transportType == 'Sea Freight'){
      //   this.transport_type = 1;
      // } else if (this.transportType == 'Air Freight'){
      //   this.transport_type = 2;
      // } else if (this.transportType == 'Any'){
      //   this.transport_type = 3;
      // }
      this.shipperType = this.searchboxDetails.ShipperType;
      if (this.shipperType == "Importer") {
        this.shipper_type = "I";
      } else if (this.shipperType == "Exporter") {
        this.shipper_type = "E";
      }
      this.eta = this.searchboxDetails.ETA;
      this.etd = this.searchboxDetails.ETD;
      if (this.halalStatus == "Non-Halal") {
        this.halal = "N";
      } else if (this.halalStatus == "Halal") {
        this.halal = "H";
      }
      this.container_type = this.searchboxDetails.container;
      this.merchandise_value = this.searchboxDetails.MerchandiseValue;
      
      // add extra filter values on search reslut page
      filter = this.searchboxDetails.filter;
      quotation_id = this.searchboxDetails.quotation_id;
      logistic_patner = this.searchboxDetails.logistic_patner;
      price_start = this.searchboxDetails.price_start;
      price_end = this.searchboxDetails.price_end;
      incoterm = this.searchboxDetails.incoterm;

    }

    let params = new HttpParams();
    params = params.append("etd", this.etd);
    params = params.append("eta", this.eta);
    params = params.append("port_to", this.arrive);
    params = params.append("port_from", this.depart);
    params = params.append("cbm", this.cbm);
    params = params.append("halal_status", this.halal);
    params = params.append("weight", this.weight);
    params = params.append("shipper_type", this.shipper_type);
    params = params.append("transport_type", this.transport_type);
    params = params.append("hs_code", this.hscode);
    params = params.append("container_type", this.container_type);
    params = params.append("merchandise_value", this.merchandise_value);
    params = params.append("offset", this.offset);
    
    if ( filter ) {
      params = params.append("filter", filter.toString() );
      if ( typeof quotation_id != 'undefined' ) {
        params = params.append("quotation_id", quotation_id);
      }
      if ( typeof logistic_patner != 'undefined' ) {
        params = params.append("logistic_patner", logistic_patner);
      } 
      params = params.append("price_start", price_start);
      params = params.append("price_end", price_end);
      if ( incoterm ) {
        params = params.append('incoterm', incoterm);
      }
      
    }
   
    this.http
      .get(this.server_url + "/SearchFiltering" + "/", { params: params })
      .subscribe(searchInfo => {
        console.log(searchInfo);
        this.searchResultType = searchInfo["result_type"];
        this.searchResultCollection = searchInfo["result_set"];
        this.publicApiService.search_result_data_length =
          searchInfo["result_set"].length;
        this.publicApiService.search_result_type = searchInfo["result_type"];
      });
    // console.log("kala",this.searchResultCollection)
    // this.searchResultCollection = this.getSearchResultCollection();
    // console.log(this.searchResultCollection.length)
    if (this.searchboxDetails == null) {
      this.router.navigateByUrl("/");
    }
  }

  // getSearchResultCollection()
  // {
  //   let params = new HttpParams();
  //   params = params.append('etd', this.etd);
  //   params = params.append('eta', this.eta);
  //   params = params.append('port_to', this.arrive);
  //   params = params.append('port_from', this.depart);
  //   params = params.append('cbm', this.cbm);
  //   params = params.append('halal_status', this.halal);
  //   params = params.append('offset', this.offset);
  //   return this.http.get(this.server_url + '/SearchFiltering' + '/',{params: params})
  //   .map(response => response);
  // }

  ngNextStart() {
    this.i = 0;
    this.loopIndex = 3;
    let x: number;

    this.searchCollection = [];
    if (this.searchResultCollection) {
      x = this.searchResultCollection.length / 3 + 1;
      for (let i = 1; i <= x; i++) {
        this.searchCollection.push(i);
      }
    }
  }

  ngNextEnd() {
    this.loopIndex = this.loopIndex + 3;
    this.i = this.i + 3;
  }
}
