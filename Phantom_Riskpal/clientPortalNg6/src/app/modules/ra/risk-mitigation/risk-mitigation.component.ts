import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { RiskAssessmentService } from './../service/risk-assessment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RaService } from './../../../shared/ra/service/ra.service';
import { AuthService } from './../../../core/guards/auth.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { MatDialog } from "@angular/material";
import { AssignQuestionModalComponent } from './../../../shared/ra/assign-question-modal/assign-question-modal.component';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { Subscription } from 'rxjs/Subscription';
import { AllQuestionsComponent } from './../../../shared/ra/all-questions/all-questions.component';

@Component({
  selector: 'app-risk-mitigation',
  templateUrl: './risk-mitigation.component.html',
  styleUrls: ['./risk-mitigation.component.scss'],
  // encapsulation: ViewEncapsulation.Native
})
export class RiskMitigationComponent implements OnInit, OnDestroy {
  subscription:Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private raService: RaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private responseService: ResponseService,
    private raTemplateService: RaTemplateService,
    private riskAssessmentService: RiskAssessmentService) {
      this.subscription = this.raService.trackChanges.subscribe(updateTemplateRisk => {
        if (updateTemplateRisk != null) {
          if (updateTemplateRisk.type === 'updateTemplateRisk') {
            this.ngOnInit();
          }
        }
      });
    }

  public loading: boolean = false;
  raId: string;
  templateId: string;
  riskLabels: any = [];
  questions: any = [];
  answers: any = [];
  assignedQuestionToLabel: any = [];
  questionWithAnswers: any = [];
  riskMitigationTableRa: boolean = true;
  riskLabelData: any = [];


  columns: any = [
    { prop: 'QUESTION', name: 'question'}
  ];
  page: any = { count: 0, offset: 0, pageSize: 1000 };

  ngOnInit() {
    this.loading = true;
    const raId = this.activatedRoute.snapshot.paramMap.get("raId");
    const templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    if (raId) {
      this.raId = raId;
    }
    if (templateId) {
      this.templateId = templateId;
    }
    this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('riskMitigation'));
    this.getAllRiskLabels();
  }

  getAllRiskLabels() {
    let data = {
      // client_id: this.authService.getUser().client_id,
      count: 25,
      page: 1,
      ra_id: this.templateId,
      sortby: { categoryName: "asc" },
      super_admin: false
    };
    this.raService.getAllRiskLabels(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.getRaAnswers(this.raId,this.templateId);
          this.riskLabels = response.data;
        } else {
          this.loading = false;
          this.riskLabels = undefined;
        }
      },
      error => {
        this.loading = false;
        this.riskLabels = undefined
      }
    );
  }

  count: number = 0;
  getRaAnswers(raId, templateId) {
    this.count++;
    console.log("count :", this.count);
    this.riskAssessmentService.getRaAnswers(raId, templateId).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.answers = response.data;
          this.riskAssessmentService.setRaQuestionForSpecificInformation(this.answers);
          this.getTableData();
        } else {
          this.answers = undefined;
        }
      }, error => {
        this.loading = false;
        this.answers = undefined;
      }
    )
  }

  getTableData() {
    if (this.riskLabels != undefined && this.answers != undefined) {
      this.riskLabelData = this.riskLabels.map(label => {
        for (let answer of this.answers) {
          for (let i = 0; i < answer.category_id.length; i++) {
            if (label._id === answer.category_id[i]) {
              this.assignedQuestionToLabel.push(answer);
            }
          }
        }
        label.rows = this.assignedQuestionToLabel
          .map(element => {
            element.bestPractice = "MITIGATION ADVICE";
            return element;
          });
        label.isOpen = true;
        label.page = { count: this.assignedQuestionToLabel.length, offset: 0, pageSize: 1000 };

        this.assignedQuestionToLabel = [];
        return label;
      })
    }
  }

  receiveDataFromChild(row) {
    console.log("row :", row.id);
    if (row.type === "additionalInfo") {
      this.saveSpecificInformationData(row.id);
    } else {
      if (row.type === 'no') {
        row.id['ticked'] = false;
      } else {
        row.id['ticked'] = true;
      }
      const selectedQuestion ={
        news_ra_id: this.raId,
        questionnaire_id : row.id.questionnaire_id,
        ticked: row.id.ticked
      }
      row.id['types_of_ra_id'] = this.templateId;
      row.id['newsRa_id'] = this.raId;
      this.addQuestionToRa(selectedQuestion);
    }
  }


  addQuestionToRa(questionData) {
    this.loading = true;
    this.riskAssessmentService.addQuestionToRa(questionData).subscribe(
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

  addQuestion(categoryName, labelId) {
    let riskLabel = {
      riskLabelId: labelId,
      riskCategoryName: categoryName,
      templateId: this.templateId,
      raId: this.raId,
      type: 'ra'
    }
    this.raService.riskLabel = riskLabel;
    this.dialog.open(AssignQuestionModalComponent, {
      height: '100vw',
      width: '70%',
      disableClose: false,
      closeOnNavigation: true,
        position: {
          top: '0',
          right: '0',
          bottom: '0'
        }
    });
  }

  viewAllQuestions(){
    let riskLabel = {
      templateId: this.templateId,
      raId: this.raId,
      type: 'ra'
    }
    
    this.raService.riskLabel = riskLabel;
    this.dialog.open(AllQuestionsComponent, {
      height: '100vw',
      width: '70%',
      disableClose: false,
      closeOnNavigation: true,
        position: {
          top: '0',
          right: '0',
          bottom: '0'
        }
    });
  }

  riskMitigation(step, value) {
    if (step == 'next') {
      sessionStorage.removeItem('raQuestion');
      this.riskAssessmentService.riskMitigation('next');
    } else {
      this.riskAssessmentService.riskMitigation(step, value);
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
  
  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
  expandAll() {
    this.riskLabels = this.riskLabels.map(item => {
      item.isOpen = true;
      return item;
    })
  }

  collapseAll() {
    this.riskLabels = this.riskLabels.map(item => {
      item.isOpen = false;
      return item;
    })
  }

}
