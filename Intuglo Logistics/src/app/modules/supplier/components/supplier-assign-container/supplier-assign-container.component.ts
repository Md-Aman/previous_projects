import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { SupplierApiService } from './../../services/supplier-api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'supplier-assign-container',
  templateUrl: './supplier-assign-container.component.html',
  styleUrls: ['./supplier-assign-container.component.css']
})
export class SupplierAssignContainerComponent implements OnInit {

  form: FormGroup;

  constructor(private service: SupplierApiService, public thisDialogRef: MatDialogRef<SupplierAssignContainerComponent>, public dialog: MatDialog, fb: FormBuilder) {
    this.form = new FormGroup({})
   }
   show_message:boolean;
   onCloseCancel(){
    this.thisDialogRef.close();
  }

  updateContainerNo(){

  }

  ngOnInit() {
  }
}
