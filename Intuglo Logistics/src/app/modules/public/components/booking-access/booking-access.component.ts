import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'booking-access',
  templateUrl: './booking-access.component.html',
  styleUrls: ['./booking-access.component.css']
})
export class BookingAccessComponent implements OnInit {

  constructor( public thisDialogRef: MatDialogRef<BookingAccessComponent>) { }

  ngOnInit() {
  }
  onCloseCancel() {
    this.thisDialogRef.close();
  }
}
