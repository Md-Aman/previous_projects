import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'banner-ads',
  templateUrl: './banner-ads.component.html',
  styleUrls: ['./banner-ads.component.css']
})
export class BannerAdsComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }
  getQuoteBox() {
    this.sharedService.changeMessage({event: 'getQuoteBox', status: true});
  }
}
