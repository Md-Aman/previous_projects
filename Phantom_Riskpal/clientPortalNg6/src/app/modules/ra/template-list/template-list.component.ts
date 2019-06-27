import { Component, OnInit } from '@angular/core';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { ConstantType } from './../../../core/services/constant.type';
import { Router } from '@angular/router';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';


@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private riskAssessmentService: RiskAssessmentService,
    public router: Router,  
    private dialogRef: MatDialogRef<TemplateListComponent>) { }
    
  searchRaTemplateForm: FormGroup;
  public loading:boolean = false;
  rows = [{ 'ra_name': 'test' }];
  columns: any = [
    { prop: 'Template Name', name: 'ra_name' }
  ];
  page: any = { count: 0, offset: 0, pageSize: 1000 };

  actions: any = [
    { type: 'raTemplate', text: 'Select', icon: false, confirm: false, class: 'answer' }
  ];


  ngOnInit() {
    this.getAllRaTemplate();
    this.searchRaTemplateForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }
  onClose() {
    this.dialogRef.close();
  }
  getAllRaTemplate(key = '') {
    this.loading = true;
    this.riskAssessmentService.getAllRaTemplate(key).subscribe(
      (response: any) => {
        this.page.count = response.data.length;
        this.rows = response.data;
        this.loading = false;
      }, error=>{
        this.loading = false;
      }
    )
  }
  search(key) {
    this.getAllRaTemplate(key);
  }
  receiveEvent(event) {
    this.router.navigate(['secure/ra/create/ra-details/' + event.data._id]);
    this.dialogRef.close();
  }
  closeModal(){
    this.dialogRef.close();
    this.router.navigate(['secure/ra/list']);
  }



}
