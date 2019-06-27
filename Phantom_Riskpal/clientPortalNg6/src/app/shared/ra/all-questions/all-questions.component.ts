import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { AuthService } from './../../../core/guards/auth.service';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { RiskAssessmentService } from './../../../modules/ra/service/risk-assessment.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { RaService } from './../../../shared/ra/service/ra.service';
import { ConstantType } from './../../../core/services/constant.type';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-all-questions',
  templateUrl: './all-questions.component.html',
  styleUrls: ['./all-questions.component.scss'],
  // encapsulation: ViewEncapsulation.Native
})
export class AllQuestionsComponent implements OnInit {
  @ViewChild('_search') _search: ElementRef;
  constructor(
    private authService: AuthService,
    private raService: RaService,
    private riskAssessmentService: RiskAssessmentService,
    private responseService: ResponseService,
    public dialogRef: MatDialogRef<AllQuestionsComponent>,
    private raTemplateService: RaTemplateService) { }
  dataFromSearch: boolean = true;
  isModal: boolean = true;
  loading: boolean = false;
  riskLabels = [];
  rows = [];
  columns: any = [
    { prop: 'QUESTION', name: 'question' }
  ];
  riskMitigationTable: boolean = true;
  page: any = { count: 0, offset: 0, pageSize: 1000 };
  questionsBasedOnLabel = [];
  allQuestionsFromSearch = [];
  riskLabelData = [];
  assignedQuestionToLabel = [];
  templateQuestions: any = [];
  selection: string;
  search: string;
  riskLabel: any = {
    riskCategoryName: '',
    riskLabelId: '',
    templateId: '',
    raId: '',
    type: ''
  }

  isSearch: boolean = false;
  raTemplateDataFormat = {};
  categoryId: string;
  isExpandRow: boolean = true;
  rowId: string;
  status: string;

  ngOnInit() {
    this.riskLabel = this.raService.riskLabel;
    this.getAllRiskLabels();
    this.getSearchKey();
  }

  data = {
    // client_id: this.authService.getUser().client_id,
    count: 1000,
    page: 1,
    sortby: { categoryName: "asc" },
  };

  labelData = {
    count: 1000,
    page: 1,
    sortby: {}
  }

  getSearchKey() {
    const inputValue = fromEvent(this._search.nativeElement, 'keyup')
      .map((evt: any) => evt.target.value);
    const debouncedInput = inputValue.pipe(debounceTime(1500));
    const subscribe = debouncedInput.subscribe(inputVal => {
      if (inputVal.length > 2) {
        this.search = inputVal;
        this.getSearchQuestions(this.search);
      }
    });
  }

  getAllRiskLabels() {
    this.loading = true;
    this.data['page'] = 1;
    this.raService.getAllRiskLabels(this.data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.riskLabels = response.data;
        } else {
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  selectedLabel(categoryId) {
    // console.log("cat :", categoryId);
    this.search = null;
    this._search.nativeElement.value = '';
    this.isSearch = false;
    this.categoryId = categoryId;
    this.allQuestionsFromSearch = [];
    this.labelData['risk_label_id'] = categoryId;
    this.labelData['page'] = 1;
    this.getAllRiskQuestionnaire(this.labelData);
  }

  getAllRiskQuestionnaire(data) {
    this.loading = true;
    this.raService.getAllRiskQuestionnaire(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.page.count = response.count;
          this.questionsBasedOnLabel = response.data;
          if (this.riskLabel.type === 'raTemplate') {
            this.templateQuestionData();
          } else {
            this.prepareData();
          }
        } else {
          this.loading = false;
        }
      }, error => {
        this.loading = false;
      }
    )
  }

  prepareData() {
    this.loading = false;
    if (this.questionsBasedOnLabel.length > 0 && this.riskAssessmentService.getRaQuestionForSpecificInformation() != null) {
      const selectedQuestions: any = this.riskAssessmentService.getRaQuestionForSpecificInformation();
      this.rows = this.questionsBasedOnLabel.map(item => {
        for (let question of selectedQuestions) {
          if (item._id == question.questionnaire_id) {
            item.assign = true;
          }
        }
        item.bestPractice = "MITIGATION ADVICE";
        return item;
      });
    }
  }


  // searchQuestion() {
  //   setTimeout(() => {
  //     this.getSearchQuestions(this.search);
  //   }, 2000)

  // }

  getSearchQuestions(key) {
    this.loading = true;
    this.selection = '';
    this.questionsBasedOnLabel = [];
    this.loading = true;
    this.data['questionnaire_name'] = key;
    this.data['page'] = 1;
    this.riskAssessmentService.getAllQuestionnaire(this.data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.allQuestionsFromSearch = response.data;
          if (this.riskLabel.type === 'raTemplate') {
            this.templateQuestionData();
          } else {
            this.formatRaSearchData();
          }
        } else {
          this.loading = false;
        }
      }, error => {
        this.loading = false;
      }
    )
  }

  clickAccordian(label) {
    label.isOpen = !label.isOpen;
  }

  formatRaSearchData() {
    this.loading = false;
    if (this.riskLabels.length > 0 && this.allQuestionsFromSearch.length > 0) {
      this.riskLabelData = this.riskLabels.map(label => {
        for (let question of this.allQuestionsFromSearch) {
          for (let category of question.category_id) {
            if (label._id === category._id) {
              this.assignedQuestionToLabel.push(question);
            }
          }
        }
        label.rows = this.assignedQuestionToLabel.map(element => {
          const selectedQuestions: any = this.riskAssessmentService.getRaQuestionForSpecificInformation();
          for (let question of selectedQuestions) {
            if (element._id == question.questionnaire_id) {
              element.assign = true;
            }
          }
          // element.questionKey = element.question;
          // element.practiceKey = element.best_practice_advice;
          element.question = element.question.replace(new RegExp(this.search, "gi"), match => {
            return '<span class="highlightText">' + match + '</span>';
          });
          element.best_practice_advice = element.best_practice_advice.replace(new RegExp(this.search, "gi"), match => {
            return '<span class="highlightText">' + match + '</span>';
          });
          element.bestPractice = "MITIGATION ADVICE";
          return element;
        });
        label.isOpen = true;
        label.page = { count: this.assignedQuestionToLabel.length, offset: 0, pageSize: 1000 };
        this.assignedQuestionToLabel = [];
        return label;
      });
    }
  }

  formatTemplateSearchData() {
    this.loading = false;
    this.riskLabelData = this.riskLabels.map(label => {
      for (let question of this.allQuestionsFromSearch) {
        for (let category of question.category_id) {
          if (label._id === category._id) {
            this.assignedQuestionToLabel.push(question);
          }
        }
      }

      label.rows = this.assignedQuestionToLabel.map(element => {
        for (let quest of this.templateQuestions) {
          if (element._id == quest._id) {
            element.assign = true;
          }
        }
        // element.questionKey = element.question;
        // element.practiceKey = element.best_practice_advice;
        element.question = element.question.replace(new RegExp(this.search, "gi"), match => {
          return '<span class="highlightText">' + match + '</span>';
        });
        element.best_practice_advice = element.best_practice_advice.replace(new RegExp(this.search, "gi"), match => {
          return '<span class="highlightText">' + match + '</span>';
        });
        element.bestPractice = "MITIGATION ADVICE";
        return element;
      });
      label.isOpen = true;
      label.page = { count: this.assignedQuestionToLabel.length, offset: 0, pageSize: 1000 };
      this.assignedQuestionToLabel = [];
      return label;
    });
    // console.log("dddd :", this.riskLabelData)
  }

  templateQuestionData() {
    this.loading = true;
    this.raService.getRaRelatedQuestionData(this.riskLabel.templateId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          if (this.search != null) {
            this.templateQuestions = response.queData;
            this.formatTemplateSearchData();
          } else {
            this.loading = false;
            this.rows = this.questionsBasedOnLabel.map(item => {
              for (let question of response.queData) {
                if (item._id == question._id) {
                  item.assign = true;
                }
              }
              item.bestPractice = "MITIGATION ADVICE";
              return item;
            });
          }
        } else {
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
      }
    )
  }


  receiveLabelDataFromChild(row) {
    // console.log("row :", this.questionsBasedOnLabel, row);
    this.rowId = row.id;
    this.status = row.type;
    this.isSearch = false;
    this.riskLabel = this.raService.riskLabel;
    const dataFilter = this.questionsBasedOnLabel.find(item => item._id === row.id);
    dataFilter['news_ra_id'] = this.riskLabel.raId;
    dataFilter['types_of_ra_id'] = this.riskLabel.templateId;
    const getIds = [];
    if (typeof (dataFilter.category_id[0]) === 'object') {
      dataFilter.category_id = ConstantType.getItemIds(dataFilter.category_id, getIds);
    }

    // for template         
    this.raTemplateDataFormat['assignRaId'] = this.riskLabel.templateId;
    this.raTemplateDataFormat['_id'] = row.id;

    if (row.type === 'assign') {
      if (this.riskLabel.type === 'raTemplate') {
        this.raTemplateDataFormat['assign'] = true;
        this.assignQuestionToTemplate(this.raTemplateDataFormat);
      } else {
        dataFilter['ticked'] = true;
        this.addQuestionToRa(dataFilter);
      }
    } else if (row.type === 'unassign') {
      if (this.riskLabel.type === 'raTemplate') {
        this.raTemplateDataFormat['assign'] = false;
        this.assignQuestionToTemplate(this.raTemplateDataFormat);
      } else {
        dataFilter['ticked'] = false;
        this.addQuestionToRa(dataFilter);
      }
    } else {
      // this else block is for pagination
      this.labelData['page'] = 1 + row.id.offset;
      this.getAllRiskQuestionnaire(this.labelData);
    }
  }



  receiveDataFromChildOnSearch(row) {
    console.log("search dfd:", row, row.id);
    this.rowId = row.id._id;
    this.status = row.type;

    this.isSearch = true;
    this.riskLabel = this.raService.riskLabel;
    const filteredData = row.id;
    const test1 = row.id.question.split('<span class="highlightText">').join('');
    const result1 = test1.split('</span>').join('');
    console.log("result 1:", result1);
    const test = row.id.best_practice_advice.split('<span class="highlightText">').join('');
    const result = test.split('</span>').join('');
    console.log("result best:", result);
    filteredData['question'] = result1;
    console.log("filter data 100 :", filteredData);
    filteredData['best_practice_advice'] = result;
    console.log("filter data 200 :", filteredData);
    filteredData['news_ra_id'] = this.riskLabel.raId;
    filteredData['types_of_ra_id'] = this.riskLabel.templateId;
    const getIds = [];
    if (typeof (filteredData.category_id[0]) === 'object') {
      filteredData.category_id = ConstantType.getItemIds(filteredData.category_id, getIds);
    }

    // for template         
    this.raTemplateDataFormat['assignRaId'] = this.riskLabel.templateId;
    // this.raTemplateDataFormat['_id'] = row.id;

    if (row.type === 'assign') {
      if (this.riskLabel.type === 'raTemplate') {
        this.raTemplateDataFormat['_id'] = row.id._id;
        this.raTemplateDataFormat['assign'] = true;
        this.assignQuestionToTemplate(this.raTemplateDataFormat);
      } else {
        filteredData['ticked'] = true;
        this.addQuestionToRa(filteredData);
      }
    } else if (row.type === 'unassign') {
      if (this.riskLabel.type === 'raTemplate') {
        this.raTemplateDataFormat['_id'] = row.id._id;
        this.raTemplateDataFormat['assign'] = false;
        this.assignQuestionToTemplate(this.raTemplateDataFormat);
      } else {
        filteredData['ticked'] = false;
        this.addQuestionToRa(filteredData);
      }
    } else {
      // this else block is for pagination
      this.labelData['page'] = 1 + row.id.offset;
      this.getAllRiskQuestionnaire(this.labelData);
    }
  }

  assignQuestionToTemplate(questionData) {
    this.raService.assignQuesToRa(questionData).subscribe(
      (response: any) => {
        if (response.code === 200) {
          const data = {
            type: 'updateTemplateRisk'
          }
          this.raService.setSubject(data);
          // if (this.isSearch === true) {
          this.formateRowData();
          // } else {
          //   this.formateRowData();
          // }
        }
      },
      error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  addQuestionToRa(data) {
    this.loading = true;
    this.riskAssessmentService.updateNewQuestionRa(data).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          const data = {
            type: 'updateTemplateRisk'
          }
          this.raService.setSubject(data);
          // if (this.isSearch === true) {
          //   this.formateRowData();
          // } else {
          this.formateRowData();
          // }
        }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  formateRowData() {
    // console.log("rows :", this.riskLabel, this.rows);
    if (this.isSearch != true) {
      this.rows = this.rows.map(item => {
        item.question = item.question.replace(new RegExp(this.search, "gi"), match => {
          return '<span class="highlightText">' + match + '</span>';
        });
        item.best_practice_advice = item.best_practice_advice.replace(new RegExp(this.search, "gi"), match => {
          return '<span class="highlightText">' + match + '</span>';
        });
        if (item._id === this.rowId) {
          if (this.status === 'assign') {
            item.assign = true;
          } else {
            item.assign = false;
          }
        }
        return item;
      })
    } else {
      this.riskLabelData = this.riskLabelData.map(item => {
        if (item.rows.length > 0) {
          item.rows = item.rows.map(ele => {
            ele.question = ele.question.replace(new RegExp(this.search, "gi"), match => {
              return '<span class="highlightText">' + match + '</span>';
            });
            ele.best_practice_advice = ele.best_practice_advice.replace(new RegExp(this.search, "gi"), match => {
              return '<span class="highlightText">' + match + '</span>';
            });
            ele.ticked = false;
            if (ele._id === this.rowId) {
              if (this.status === 'assign') {
                ele.assign = true;
              } else {
                ele.assign = false;
              }
            }
            return ele;
          })
        }
        return item;
      });
    }

    console.log("this.riskLabelData :", this.riskLabelData);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
