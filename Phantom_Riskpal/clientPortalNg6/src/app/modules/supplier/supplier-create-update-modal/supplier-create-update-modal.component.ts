import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-create-update-modal',
  templateUrl: './supplier-create-update-modal.component.html',
  styleUrls: ['./supplier-create-update-modal.component.scss']
})
export class SupplierCreateUpdateModalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SupplierCreateUpdateModalComponent>,
    private responseService: ResponseService,
    private router: Router) { }

  breadCrum = [
    { name: 'Suppliers', url: '/secure/supplier/list' }
  ];

  ngOnInit() {
  }

  closeDialog() {
    this.responseService.createBreadCrum(this.breadCrum);
    this.dialogRef.close();
    this.router.navigate(['/secure/supplier']);
  }
  
}
