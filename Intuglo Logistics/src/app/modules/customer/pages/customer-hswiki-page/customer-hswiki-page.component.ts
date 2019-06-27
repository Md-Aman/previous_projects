import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'customer-hswiki-page',
  templateUrl: './customer-hswiki-page.component.html',
  styleUrls: ['./customer-hswiki-page.component.css']
})
export class CustomerHswikiPageComponent implements OnInit {

  isSideBarOpen: boolean = true;  
  constructor() { }

  isOpen:boolean = true;

  ngOnInit() {
  }

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }
}
