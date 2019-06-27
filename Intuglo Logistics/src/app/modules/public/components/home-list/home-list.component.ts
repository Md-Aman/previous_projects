import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {

  adsCollection = [];
  flippableAdsCollection = [];

  constructor() { 
    for(let i=1; i<=4; i++){
      this.adsCollection.push(i);
    }
    for(let i=1;i<=3; i++){
      this.flippableAdsCollection.push(i);
    }
  }

  ngOnInit() {
  }

}
