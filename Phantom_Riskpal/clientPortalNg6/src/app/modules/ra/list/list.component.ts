import { Component, OnInit } from '@angular/core';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { ConstantType } from './../../../core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private riskAssessmentService: RiskAssessmentService,
    private responseService: ResponseService,
    private router: Router) { }

  searchRaForm: FormGroup;
  public loading: Boolean = false;
  rows: any = [];
  checkRaStatus: boolean = true;
  hideEditIcon:boolean = true;
  columns: any = [
    { prop: 'PROJECT NAME', name: 'projectName' },
    { prop: 'CLASSIFICATIONS', name: 'classifications' },
    { prop: 'COUNTRY', name: 'countries' },
    { prop: 'RA STATUS', name: 'status' },
  ];
  messages = {
    emptyMessage: "No risk assessments to display"
  }
  actions: Array<Object> = [
    { type: 'delete', text: 'Delete', icon: true, confirm: true, class: '_delete' },
    { type: 'edit', text: 'Edit', icon: true, confirm: false, class: '_edit' },
    { type: 'download', text: 'Download', icon: true, confirm: false, class: '_download' }
  ];
  colHead: any = [];
  page: any = { count: 0, offset: 0, pageSize: ConstantType.limit };
  countries = [];
  classification = [];
  data = {
    count: 10,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc
  }

  breadCrum = [
    { name: 'Risk Assessments', url: '/secure/ra/list' }
  ];

  ngOnInit() {
    this.loading = true;
    this.riskAssessmentService.removeRiskAssessmentSessionStorage();
    this.getRaList(this.data);
    this.responseService.createBreadCrum(this.breadCrum);

    this.searchRaForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }


  getRaList(data) {
    this.riskAssessmentService.getAllNewsRa(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.page.count = response.count;
          this.rows = this.getRowData(response.data);
        } else {
          this.loading = false;
          // this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  getRowData(data){
    return data.map(item => {
      item.projectName = item.project_name;
      if (item.is_submitted && item.is_approve) {
        item.status = 'Approved';
        item.editIcon = false;
      } else if(item.is_submitted && !item.is_approve && !item.is_reject && !item.is_more_info && !item.semi_approve){
        item.status = 'Pending';
        item.editIcon = true;
      } else if(item.is_submitted && item.is_reject){
        item.status = 'Rejected';
        item.editIcon = true;
      } else if(!item.is_submitted && !item.is_approve && !item.is_more_info && !item.is_reject){
        item.status = 'Yet to submit';
        item.editIcon = true;
      } else if(item.is_submitted && item.is_more_info){
        item.status = 'Resubmit';
        item.editIcon = true;
      } else if(item.is_submitted && item.semi_approve && !item.is_approve){
        item.status = 'Partially approved';
        item.editIcon = true;
      }
      if (item.country != null) {
        for (let country of item.country) {
          if(country.color === 'Green'){
            country.color = 'green'
         }
          this.countries.push(' ' + country.name);
          if (country.color == 'red') {
            this.classification.push('<span class="red">' + ' ' + country.color + "</span>");
          } else if (country.color == 'green') {
            this.classification.push('<span class="green">' + ' ' + country.color + "</span>");
          } else if (country.color == 'yellow') {
            this.classification.push('<span class="yellow">' + ' ' + country.color + "</span>");
          } else if (country.color == 'amber') {
            this.classification.push('<span class="amber">' + ' ' + country.color + "</span>");
          } else {
            this.classification.push(' ' + country.color);
          }
        }
        item.countries = this.countries;
        item.classifications = this.classification;
        this.countries = [];
        this.classification = [];
      }
      return item;
    })
  }

  receiveEvent(row) {
    if (row.type === 'delete') {
      this.deleteRa(row.data);
    } else if (row.type === 'setPage') {
      this.loading = true;
      this.data.page = 1 + row.data.offset;
      this.getRaList(this.data);
    } else {
      //  edit 
      this.router.navigate(['/secure/ra/create/ra-details/'+row.data.types_of_ra_id._id+'/'+row.data._id]);
    }
  }

  deleteRa(raDetails) {
    this.loading = true;
    this.riskAssessmentService.deleteNewsRa(raDetails._id).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.ngOnInit();
          // this.responseService.hanleSuccessResponse(response);
        } else {
          this.loading = false;
          // this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  searchRa(key){
    this.loading = true;
    this.data['keyword'] = key;
    this.getRaList(this.data);
  }



}
