import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {

  isSideBarOpen: boolean = true;
  isOpen: boolean = true;

  constructor() { }

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }

  ngOnInit() {
  }

}
