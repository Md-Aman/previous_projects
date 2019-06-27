import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.css']
})
export class PackingListComponent implements OnInit {

  constructor(public DialogRef: MatDialogRef<PackingListComponent>) {
    
   }

  ngOnInit() {
  }

  /// close popup window
  onCloseCancel() {
    this.DialogRef.close();
  }

}
