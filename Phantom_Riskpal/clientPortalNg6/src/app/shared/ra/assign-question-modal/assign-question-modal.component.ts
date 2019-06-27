import { Component, OnInit } from '@angular/core';
import { RaService } from './../service/ra.service';
import { ConstantType } from './../../../core/services/constant.type';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { MatDialogRef } from "@angular/material";
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { RiskAssessmentService } from './../../../modules/ra/service/risk-assessment.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';

@Component({
  selector: 'app-assign-question-modal',
  templateUrl: './assign-question-modal.component.html',
  styleUrls: ['./assign-question-modal.component.scss']
})
export class AssignQuestionModalComponent implements OnInit {

  public loading = false;
  riskMitigationTableRa: boolean = true;
  riskLabel: any = {
    riskCategoryName: '',
    riskLabelId: '',
    templateId: '',
    raId: '',
    type: ''
  }
  constructor(
    private raService: RaService,
    private toastarService: ToastarService,
    private riskAssessmentService: RiskAssessmentService,
    private responseService: ResponseService,
    public dialogRef: MatDialogRef<AssignQuestionModalComponent>,
    private raTemplateService: RaTemplateService) { }

  rows = [];
  columns: any = [
    { prop: 'QUESTION', name: 'question' }
  ];
  riskMitigationTable: boolean = true;
  page: any = { count: 0, offset: 0, pageSize: 1000 };
  isAssign: boolean;
  raRelatedQuestion: any = [];
  riskQuestionsBasedonCategory: any = [];
  formatedQuestionsId = [];

  data = {
    count: 1000,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc,
  }
  ngOnInit() {
    this.riskLabel = this.raService.riskLabel;
    this.getAllQuestion(this.data);
    this.loading = true;
  }

  rowData() {
    if (this.raRelatedQuestion != undefined && this.riskQuestionsBasedonCategory != undefined) {
      this.rows = this.riskQuestionsBasedonCategory.map(item => {
        for (let question of this.raRelatedQuestion) {
          if (item._id === question._id) {
            item.assign = true;
          }
        }
        item.bestPractice = "MITIGATION ADVICE";
        return item;
      })
    } else {
      // this.toastarService.showNotification(this.toastarService.errorText, 'error');
    }

  }

 
  getAllQuestion(data) {
    this.loading = true;
    data['risk_label_id'] = this.riskLabel.riskLabelId;
    this.raService.getAllRiskQuestionnaire(this.data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.riskQuestionsBasedonCategory = response.data;
          this.page.count = response.count;
          if (this.riskLabel.type === 'ra') {
            this.getRaAnswers(this.riskLabel.raId, this.riskLabel.templateId);
          } else {
            this.getRaRelatedQuestionData();
          }
        } else {
          this.loading = false;
          this.riskQuestionsBasedonCategory = undefined;
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.loading = false;
        this.riskQuestionsBasedonCategory = undefined;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }


  getRaRelatedQuestionData() {
    this.raService.getRaRelatedQuestionData(this.raTemplateService.getRa()._id).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.raRelatedQuestion = response.queData;
          this.rowData();
          this.loading = false;
        } else {
          this.loading = false;
          this.raRelatedQuestion = undefined;
          // this.toastarService.showNotification(response.err, 'warning');
        }

      },
      error => {
        this.loading = false;
        this.raRelatedQuestion = undefined;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }


  receiveDataFromChild(data) {
    console.log("data :", data);
    this.loading = true;
    if (data.type === "assign") {
      this.isAssign = true;
      this.assignQuestion(data);
    } else if (data.type === "unassign") {
      this.isAssign = false;
      this.assignQuestion(data);
    } else if ( data.type === 'setPage' ) {
      this.getAllQuestion(data.id.offset + 1);
    } else {
      this.isAssign = undefined;
      this.assignQuestion(data);
    }
   
  }

  assignQuestion(data) {
    const questionData = {
      _id: data.id,
      assign: this.isAssign,
      assignRaId: this.raTemplateService.getRa()._id
    }

    this.questionAssign(questionData);
  }
  assignAll() {
    const assignAllQuestionData = {
      _id: ConstantType.getItemIds(this.riskQuestionsBasedonCategory, this.formatedQuestionsId),
      assign: true,
      assignRaId: this.raTemplateService.getRa()._id
    }
    this.questionAssign(assignAllQuestionData);
  }

  unassignAll() {
    const assignAllQuestionData = {
      _id: ConstantType.getItemIds(this.riskQuestionsBasedonCategory, this.formatedQuestionsId),
      assign: false,
      assignRaId: this.raTemplateService.getRa()._id
    }
    this.questionAssign(assignAllQuestionData);
  }

  // call this function to assign and unassign question
  questionAssign(question) {
    this.raService.assignQuesToRa(question).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          // this.toastarService.showNotification(response.message, 'success');
          const data = {
            type: 'updateTemplateRisk'
          }
          this.raService.setSubject(data);
          this.ngOnInit();

        } else {
          this.loading = false;
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }


  questionWithAnswers: any = [];
  getRaAnswers(raId, templateId) {
    this.riskAssessmentService.getRaAnswers(raId, templateId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.questionWithAnswers = response.data;
          console.log("getRaAnswers :", response.data);
          this.getTableData();
        } else {
          this.questionWithAnswers = undefined;
        }
      }, error => {
        this.questionWithAnswers = undefined;
      }
    )
  }

  getTableData() {
    if (this.riskQuestionsBasedonCategory != undefined && this.questionWithAnswers != undefined) {
      // console.log("riskQuestionsBasedonCategory :", this.riskQuestionsBasedonCategory);
      // console.log("questionWithAnswers :", this.questionWithAnswers);
      this.rows = this.riskQuestionsBasedonCategory.map(item => {
        this.questionWithAnswers.forEach(element => {
          if (item._id === element.questionnaire_id) {
            item.specific_mitigation = element.specific_mitigation;
            item.ticked = true;
          }
        });
        item.bestPractice = "MITIGATION ADVICE";
        return item;
      })
      this.loading = false;
      // console.log(" rows :", this.rows);
    } else {
      // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      this.loading = false;
    }
  }

  receiveSelectedQuestionData(row) {
    console.log("row :", row)
    if (row.type === 'setPage') {
      this.data.page = 1 + row.id.offset;
      this.getAllQuestion(this.data);
    } else if(row.type === 'additionalInfo'){
      const question = this.riskAssessmentService.getRaQuestionForSpecificInformation();
      const data = question.find(item=> item.questionnaire_id === row.id._id);
      const filterData = row.id;
      filterData['_id'] = data._id;
      this.saveSpecificInformationData(filterData);
    }else if (row.type === 'no') {
      row.id['ticked'] = false;
      row.id['types_of_ra_id'] = this.riskLabel.templateId;
      row.id['news_ra_id'] = this.riskLabel.raId;
      const category_id = [];
      row.id['category_id'] = this.formateRow(row.id, category_id);
      this.updateNewQuestionRa(row.id);
    } else {
      row.id['ticked'] = true;
      row.id['types_of_ra_id'] = this.riskLabel.templateId;
      row.id['news_ra_id'] = this.riskLabel.raId;
      const category_id = [];
      row.id['category_id'] = this.formateRow(row.id, category_id);
      this.updateNewQuestionRa(row.id);
    }
  }
  saveSpecificInformationData(row) {
    this.loading = true;
      this.riskAssessmentService.addQuestionToRaUpdate(row).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.code === 200) {
            // this.responseService.hanleSuccessResponse(response);
          } 
          // else {
          //   this.responseService.handleErrorResponse(response);
          // }
        }, error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      )
  }

  formateRow(row, category_id) {
    return ConstantType.getItemIds(row.category_id, category_id);
  }

  updateNewQuestionRa(questionData) {
    this.riskAssessmentService.updateNewQuestionRa(questionData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          const data = {
            type: 'updateTemplateRisk'
          }
          this.raService.setSubject(data);
          this.ngOnInit();
        } else {
          // this.responseService.handleErrorResponse(response);
        }
      }, error => {
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  closeModal() {
    this.dialogRef.close();
  }

}
