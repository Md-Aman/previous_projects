import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SupplierApiService } from '@app/modules/supplier/services/supplier-api.service';

@Component({
  selector: 'supplier-view-quotation',
  templateUrl: './supplier-view-quotation.component.html',
  styleUrls: ['./supplier-view-quotation.component.css']
})
export class SupplierViewQuotationComponent implements OnInit {

  isSideBarOpen: boolean = true;
  isOpen: boolean = true;
  // supplierDetails

  constructor(private service:SupplierApiService) { 
    // getting supplier session from login
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"));
  }

  receiveDataFromHeader(toggle) {
    this.isSideBarOpen = toggle;
  }

  ngOnInit() {
  }

}
