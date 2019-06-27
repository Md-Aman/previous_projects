import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { SessionStorage } from '../../../models/session-storage';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  session = new SessionStorage();
  display:boolean = false;
  logisticMenu:boolean = false;

  @Output () controlSideBar = new EventEmitter()
  isToggle: boolean = true;

  constructor(
    private router: Router, 
    private sharedService: SharedService,
    public dialog:MatDialog) { }

  ngOnInit() {
  }

  toggleSideBar(){
    this.isToggle = !this.isToggle;
    this.controlSideBar.emit(this.isToggle);
  }

  clickDropdown(){
    this.display = !this.display;
  }

  clickLogisticMenu(){
    this.logisticMenu = !this.logisticMenu;
  }

  sessionExpiry(){
    this.router.navigateByUrl("/");
    sessionStorage.clear();
  }

  clickedInside($event: Event){
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener('document:click', ['event']) clickedOutside($event){
    this.display = false;
  }
  landingPage(){
    this.router.navigateByUrl("/");
  }
}
