import { Component, OnInit } from '@angular/core';
import { PublicApiService } from '../../services/public-api.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'search-summary',
  templateUrl: './search-summary.component.html',
  styleUrls: ['./search-summary.component.css']
})
export class SearchSummaryComponent implements OnInit {
  subscribe: Subscription;
  searchboxDetails: any[];
  searchBoxDetailsFromSession:any[];
  portFrom: any;
  portTo: any;
  eta;
  etd;

  constructor(public publicApiService: PublicApiService) {
    this.subscribe = this.publicApiService.getNewSearchValue().subscribe( newSearchValue=> {
      this.ngOnInit();
    }); 
  }

  ngOnInit() {

    this.searchboxDetails = JSON.parse(sessionStorage.getItem("searchbox-session"));
    this.searchBoxDetailsFromSession = Object.values(this.searchboxDetails);
    
    this.etd = this.searchBoxDetailsFromSession[9];
    this.eta = this.searchBoxDetailsFromSession[8]
    this.portFrom = this.searchBoxDetailsFromSession[10];
    this.portTo = this.searchBoxDetailsFromSession[11];
    if(this.publicApiService.searchbox){
    this.portFrom = this.publicApiService.searchbox.PortFrom;
    this.portTo = this.publicApiService.searchbox.PortTo;
    this.eta = this.publicApiService.searchbox.ETA;
    this.etd = this.publicApiService.searchbox.ETD;
    }
  }

}
