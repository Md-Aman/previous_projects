import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SupplierApiService } from '../../services/supplier-api.service';

@Component({
  selector: 'supplier-modify-quotation',
  templateUrl: './supplier-modify-quotation.component.html',
  styleUrls: ['./supplier-modify-quotation.component.css']
})
export class SupplierModifyQuotationComponent implements OnInit {

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
