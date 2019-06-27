import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'supplier-hswiki-page',
  templateUrl: './supplier-hswiki-page.component.html',
  styleUrls: ['./supplier-hswiki-page.component.css']
})
export class SupplierHswikiPageComponent implements OnInit {

  isSideBarOpen: boolean = true;
  constructor() { }
  isOpen:boolean = true;

  ngOnInit() {
  }

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }

}
