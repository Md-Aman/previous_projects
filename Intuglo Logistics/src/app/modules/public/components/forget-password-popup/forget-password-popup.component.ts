import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-forget-password-popup',
  templateUrl: './forget-password-popup.component.html',
  styleUrls: ['./forget-password-popup.component.css']
})
export class ForgetPasswordPopupComponent implements OnInit {

  constructor( public thisDialogRef: MatDialogRef<ForgetPasswordPopupComponent>,) { }

  ngOnInit() {
  }
  onCloseCancel() {
    this.thisDialogRef.close();
  }
}
