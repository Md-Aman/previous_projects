import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'user-onboard',
  templateUrl: './user-onboard.component.html',
  styleUrls: ['./user-onboard.component.css']
})
export class UserOnboardComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<UserOnboardComponent>, public dialog:MatDialog) { }
  onCloseCancel() {
    this.thisDialogRef.close();
  }
  ngOnInit() {
  }

}
