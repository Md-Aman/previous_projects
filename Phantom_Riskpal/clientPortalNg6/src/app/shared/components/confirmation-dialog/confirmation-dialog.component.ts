import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() confirmMessage: String;
  
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
  }

}
