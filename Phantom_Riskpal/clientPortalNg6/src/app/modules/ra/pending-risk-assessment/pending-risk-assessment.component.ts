import { Component, OnInit } from '@angular/core';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { ConstantType } from './../../../core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';


@Component({
  selector: 'app-pending-risk-assessment',
  templateUrl: './pending-risk-assessment.component.html',
  styleUrls: ['./pending-risk-assessment.component.scss']
})
export class PendingRiskAssessmentComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private riskAssessmentService: RiskAssessmentService,
    private responseService: ResponseService,
    private router: Router) { }

  searchRaForm: FormGroup;
  public loading: Boolean = false;
  rows: any = [];
  hideEditIcon: boolean = true;
  columns: any = [
    { prop: 'PROJECT NAME', name: 'project_name' },
    { prop: 'COUNTRY', name: 'countries' },
    { prop: 'DEPARTMENT', name: 'departments' },
    { prop: 'AUTHOR', name: 'author' },
    { prop: 'No. Travellers', name: 'numberOfTravelller' },
    { prop: 'STATUS', name: 'status' },
  ];
  messages = {
    emptyMessage: "No risk assessments to display"
  }
  actions: Array<Object> = [
    { type: 'edit', text: 'Edit', icon: true, confirm: false, class: '_edit' },
    { type: 'download', text: 'Download', icon: true, confirm: false, class: '_download' }
  ];

  page: any = { count: 0, offset: 0, pageSize: ConstantType.limit };
  countries = [];
  departments = [];
  data = {
    count: 10,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc
  };
  breadCrum = [
    { name: 'Pending Risk Assessments', url: '/secure/ra/pending' }
  ];

  ngOnInit() {
    this.getPendingRaList(this.data);
    this.riskAssessmentService.removeRiskAssessmentSessionStorage();
    this.responseService.createBreadCrum(this.breadCrum);
    this.searchRaForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }

  getPendingRaList(data) {
    this.loading = true;
    this.riskAssessmentService.getAllpendingnewsRa(data).subscribe(
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

  getRowData(data) {
    return data.map(item => {
      item.author = item.traveller_id.firstname + ' ' + item.traveller_id.lastname;
      if (item.travellerTeamArr != null) {
        item.numberOfTravelller = 1 + item.travellerTeamArr.length;
      } else {
        item.numberOfTravelller = 1;
      }
      if (item.is_approve) {
        item.status = '<span class="approved">Approved</span>';
        item.editIcon = false;
      } else if (item.is_reject) {
        item.status = 'Rejected';
        item.editIcon = true;
      } else if (item.is_more_info) {
        item.status = 'More Information Requested';
        item.editIcon = true;
      } else if (item.semi_approve && !item.userExists && !item.is_approve && !item.is_modified) {
        item.status = '<span class="unread">Unread</span>';
        item.editIcon = true;
      } else if (!item.semi_approve && !item.userExists && !item.is_reject && !item.is_approve && !item.is_more_info && !item.is_modified) {
        item.status = '<span class="unread">Unread</span>';
        item.editIcon = true;
      } else if (!item.semi_approve && !item.userExists && !item.is_reject && !item.is_approve && !item.is_more_info && item.is_modified) {
        item.status = 'Modified';
        item.editIcon = true;
      } else if (!item.is_approve && item.semi_approve && item.userExists) {
        item.status = 'Referred';
        item.editIcon = true;
      }
      if (item.department != null) {
        for (let department of item.department) {
          this.departments.push(' ' + department.department_name);
        }
        item.departments = this.departments;
        this.departments = [];
      }
      if (item.country != null) {
        for (let country of item.country) {
          this.countries.push(' ' + country.name);
        }
        item.countries = this.countries;
        this.countries = [];
      }
      return item;
    })
  }

  receiveEvent(row) {
    console.log('row :', row)
    if (row.type === 'edit') {
      this.riskAssessmentService.setApprovingManagerToApprove(true);
      this.router.navigate(['/secure/ra/create/ra-details/' + row.data.types_of_ra_id._id + '/' + row.data._id],{ queryParams: { status: 'pending'}});
    } else {
      this.data.page = 1 + row.data.offset;
      this.getPendingRaList(this.data);
    }

  }

  searchRa(key) {
    const data = {
      count: 10,
      page: 1,
      sortby: ConstantType.sortCreatedAtDesc,
      keyword: key
    };
    this.getPendingRaList(data);
  }

}
