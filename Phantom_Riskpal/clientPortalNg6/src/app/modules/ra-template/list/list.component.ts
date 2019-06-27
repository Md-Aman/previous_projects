import { Component, OnInit } from '@angular/core';
import { RaTemplateService } from './../service/ra-template.service';
import { AuthService } from './../../../core/guards/auth.service';
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
    public raTemplateService: RaTemplateService,
    public router: Router,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private responseService: ResponseService) { }

  searchRaTemplateForm: FormGroup
  countries = [];
  classification = [];
  rows = [];
  loading: Boolean = false;
  columns: any = [
    { prop: 'Project Name', name: 'raName' },
    { prop: 'Classification', name: 'classifications' },
    { prop: 'Country', name: 'countries' },
    { prop: 'Author', name: 'AuthorName' },
    { prop: 'Status', name: 'status' },
  ];
  messages = {
    emptyMessage: "No templates to display"
  }
  page: any = { count: 0, offset: 0, pageSize: ConstantType.limit };
  breadCrum = [
    { name: 'Risk Assessment Templates', url: '/secure/ra-template/list' }
  ];

  ngOnInit() {
    this.raTemplateService.removeRATemplateSessionStorage();
    this.getAllRiskAssessment(this.data);
    this.responseService.createBreadCrum(this.breadCrum);
    this.searchRaTemplateForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }

  data = {
    count: 10,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc,
  }

  getAllRiskAssessment(data) {
    this.loading = true;
    // data['client_id'] = this.authService.getUser().client_id;
    this.raTemplateService.getAllRiskAssessment(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.page.count = response.count;
          this.rows = response.data;
          this.rows = response.data.map(item => {
            item.raName = item.ra_name;
            if(item.client_id != null && item.client_id != undefined){
              item.AuthorName = item.client_id.firstname ? item.client_id.firstname : ' ' +
              ' ' + item.client_id.lastname ? item.client_id.lastname : ' ';
            } else {
              item.AuthorName = 'N/A';
            }
            if (item.country != null) {
              if (item.country.length > 5) {
                item.country = item.country.slice(0, 5);
              }
              for (let country of item.country) {
                if (country.color === 'Green') {
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

  receiveEvent(raData) {
    if (raData.type === 'delete') {
      this.deleteRATemplate(raData.data._id);
    } else if (raData.type === 'edit') {
      this.router.navigate(['/secure/ra-template/create/template-details/' + raData.data._id]);
    } else if (raData.type === 'setPage') {
      this.data.page = 1 + raData.data.offset;
      this.getAllRiskAssessment(this.data);
    }
  }

  deleteRATemplate(raId) {
    this.raTemplateService.deleteRa(raId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.getAllRiskAssessment(this.data);
          // this.responseService.hanleSuccessResponse(response.message)
        }
        //  else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  searchRaTemplate(key) {
    const data = {
      count: 10,
      page: 1,
      sortby: ConstantType.sortCreatedAtDesc,
      keyword: key
    };
    this.getAllRiskAssessment(data);
  }

}
