import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-payment-report',
  templateUrl: './admin-payment-report.component.html',
  styleUrls: ['./admin-payment-report.component.css']
})
export class AdminPaymentReportComponent implements OnInit {

  isSideBarOpen: boolean = true;
  isOpen: boolean = true;
  selectedRoute;


  constructor(private router:Router, private service:AdminApiService) { }


  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }
  receiveRoute(route){
    this.selectedRoute = route;
  }


  ngOnInit() {
  }

}
