import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fixed-ads',
  templateUrl: './fixed-ads.component.html',
  styleUrls: ['./fixed-ads.component.css']
})
export class FixedAdsComponent implements OnInit {

  gotoLink() : void {
    window.location.href='http://www.11street.my/';
  }

  constructor() { }

  ngOnInit() {
  }

}
