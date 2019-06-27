import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { RaService } from './../service/ra.service';
import { AuthService } from './../../../core/guards/auth.service';
import { MatDialog } from "@angular/material";
import { AssignQuestionModalComponent } from './../assign-question-modal/assign-question-modal.component';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { Subscription } from 'rxjs/Subscription';
import { CreateComponent as CreateRiskLabelComponent } from './../../../modules/manage-riskpal/risk-label/create/create.component';
import { CreateComponent as CreateRiskQuestionComponent } from './../../../modules/manage-riskpal/risk-question/create/create.component';
import { PopupComponent } from '@app/modules/ra-template/popup/popup.component';
import { AllQuestionsComponent } from './../all-questions/all-questions.component';

@Component({
  selector: 'app-risk-mitigation',
  templateUrl: './risk-mitigation.component.html',
  styleUrls: ['./risk-mitigation.component.scss'],
  // encapsulation: ViewEncapsulation.Native
})
export class RiskMitigationComponent implements OnInit {
  subscriptionUpdateQuestion: Subscription;

  public loading = false;
  riskLabels: any = [];
  raRelatedQuestion: any = [];
  riskLabelData: any[];
  assignedQuestionToLabel = [];
  updateTemplateRisk: any = {};

  constructor(
    private raTemplateService: RaTemplateService,
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private raService: RaService,
    private authService: AuthService,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private toastarService: ToastarService) {
    this.subscriptionUpdateQuestion = this.raService.trackChanges.subscribe(updateTemplateRisk => {
      if (updateTemplateRisk != null) {
        if (updateTemplateRisk.type === 'updateTemplateRisk') {
          this.ngOnInit();
        }
      }
    })

  }

  columns: any = [
    { prop: 'QUESTION', name: 'question', width: 900 }
  ];
  page: any = { count: 0, offset: 0, pageSize: 1000 };
  isAssign: boolean;
  riskMitigationTable: boolean = true;
  templateId: string;
  ngOnInit() {
    this.loading = true;
     this.templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    if (this.templateId) {
      this.getAllRiskLabels();
      this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('riskMitigation'));
    } else {
      this.router.navigate(['/secure/ra-template/create/template-details']);
    }
  }

  getAllRiskLabels(page = 1) {
    let data = {
      // client_id: this.authService.getUser().client_id,
      count: 25,
      page: page,
      ra_id: this.templateId,
      sortby: { categoryName: "asc" },
      super_admin: false
    }
    this.raService.getAllRiskLabels(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.getRaRelatedQuestionData();
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
    )
  }
  getRaRelatedQuestionData() {
    this.raService.getRaRelatedQuestionData(this.templateId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.raRelatedQuestion = response.queData;
          this.page.count = response.queData.length;
          this.rowData();
        } else {
          this.loading = false;
          this.raRelatedQuestion = undefined;
        }
      },
      error => {
        this.loading = false;
        this.raRelatedQuestion = undefined;
      }
    )

  }

  rowData() {
    this.loading = false;
    if (this.riskLabels != undefined && this.raRelatedQuestion != undefined) {
      this.riskLabelData = this.riskLabels.map(label => {
        for (let question of this.raRelatedQuestion) {
          for (let category of question.category_id) {
            if (label._id === category._id) {
              this.assignedQuestionToLabel.push(question);
            }
          }
        }
        label.rows = this.assignedQuestionToLabel.map(element => {
          element.assign = true;
          element.bestPractice = "MITIGATION ADVICE";
          return element;
        });
        if(label.rows.length > 0){
          label.isOpen = true;
        } else {
          label.isOpen = false;
        }

        label.page = { count: this.assignedQuestionToLabel.length, offset: 0, pageSize: 1000 };
        this.assignedQuestionToLabel = [];
        return label;
      });
    } else {
      // this.toastarService.showNotification(this.toastarService.errorText, 'error');
    }

  }

  receiveDataFromChild(data) {
    this.loading = true;
    console.log('fffff', data);
    if (data.type === "assign") {
      this.isAssign = true;
      this.assignQuestionBk(data);
    } else if (data.type === "unassign") {
      this.isAssign = false;
      this.assignQuestionBk(data);
    } else if ( data.type === 'setPage' ) {
      this.setPage(data);
    } else {
      this.isAssign = undefined;
      this.assignQuestionBk(data);
    }
  }
  setPage(data) {
    this.getAllRiskLabels(data.id.offset);
  }
  assignQuestionBk(data) {
    const questionData = {
      _id: data.id,
      assign: this.isAssign,
      assignRaId: this.templateId
    };

    this.raService.assignQuesToRa(questionData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          // this.toastarService.showNotification(response.message, 'success');
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

  allQuestion(){
    let riskLabel = {
      templateId: this.templateId,
      type: 'raTemplate'
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

  assignQuestion(categoryName, labelId) {
    let riskLabel = {
      riskLabelId: labelId,
      riskCategoryName: categoryName,
      type: 'raTemplate'
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

  riskMitigation(step, value) {
    if (step == 'next') {
      this.checkRaTemplateStep(this.raTemplateService.getRaPages());
    } else {
      this.raTemplateService.riskMitigation(step, value);
    }
  }

  checkRaTemplateStep(data) {
    if (data.supplierRequired != true &&
      data.communicationRequired != true &&
      data.contingenciesRequired != true
    ) {
      this.createRaTemplate(this.templateId);
    } else {
      this.raTemplateService.riskMitigation("next");
    }
  }
  createRaTemplate(raId) {
    this.raTemplateService.createRaTemplate(raId);
  }

  ngOnDestroy() {
    this.subscriptionUpdateQuestion.unsubscribe();
  }

  showPopup(component) {
    const dialog = this.dialog.open(PopupComponent, {
      height: '100vw',
      width: '70%',
      disableClose: false,
      closeOnNavigation: true,
        position: {
          top: '0',
          right: '0',
          bottom: '0'
        },
        data: {
          comingFromOtherPage: true,
          component: component
        }
    });
    dialog.afterClosed().subscribe((data) => {
        // Do stuff after the dialog has closed
        console.log('closesdddd', data);
    });
  }

}
