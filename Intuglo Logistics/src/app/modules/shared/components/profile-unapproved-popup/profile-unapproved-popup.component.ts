import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SharedService } from './../../../shared/services/shared.service';

@Component({
  selector: 'app-profile-unapproved-popup',
  templateUrl: './profile-unapproved-popup.component.html',
  styleUrls: ['./profile-unapproved-popup.component.css']
})
export class ProfileUnapprovedPopupComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<ProfileUnapprovedPopupComponent>, private sharedService:SharedService) { }
  customagent:boolean = false;
  supplier:boolean = false;
  ngOnInit() {
    if(this.sharedService.profilePermissionFlag == "customagent"){
        this.customagent= true;
    } else {
      this.supplier = true;
    }
  }
  onCloseCancel() {
    this.thisDialogRef.close();
  }
}
