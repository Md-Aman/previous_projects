import { Router } from '@angular/router';
import { AdminApiService } from '../../services/admin-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-employee-report',
  templateUrl: './admin-employee-report.component.html',
  styleUrls: ['./admin-employee-report.component.css']
})
export class AdminEmployeeReportComponent implements OnInit {

  
  constructor(private router:Router, private service:AdminApiService) { }

  isSideBarOpen: boolean  = true;
  isOpen: boolean = true;


  ngOnInit() {
  }

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }
}
