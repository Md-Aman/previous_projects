import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RiskAssessmentService {
  constructor(
    public http: HttpClient,
    private router: Router) { }


  setRaQuestionForSpecificInformation(raQuestion) {
    sessionStorage.setItem('raQuestion', JSON.stringify(raQuestion));
  }
  getRaQuestionForSpecificInformation() {
    return JSON.parse(sessionStorage.getItem('raQuestion'));
  }
  setApprovingManagerToApprove(approvingManager) {
    sessionStorage.setItem('approvingManager', JSON.stringify(approvingManager));
  }
  getApprovingManagerToApprove() {
    return JSON.parse(sessionStorage.getItem('approvingManager'));
  }
  setTemplate(templateData) {
    sessionStorage.setItem('templateData', JSON.stringify(templateData));
  }
  getTemplate() {
    return JSON.parse(sessionStorage.getItem('templateData'));
  }

  setRiskAssessment(riskAssessmentData) {
    sessionStorage.setItem('riskAssessmentData', JSON.stringify(riskAssessmentData));
  }
  getRiskAssessment() {
    return JSON.parse(sessionStorage.getItem('riskAssessmentData'));
  }
  deleteDoc(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/removeDoc', data);
  }
  removeRiskAssessmentSessionStorage() {
    sessionStorage.removeItem('approvingManager');
    sessionStorage.removeItem('templateData');
    sessionStorage.removeItem('riskAssessmentData');
  }


  // routing functions 
  raDetails(step = '') {
    if (step == "next") {
      return this.countryProfile("countryProfile", true);
    } else {  // another condition can be added here
      this.router.navigate(['/secure/ra/create/ra-details/' + this.getTemplate()._id + '/' + this.getRiskAssessment()._id]);
    }
  }

  countryProfile(step = '', navigate = true) {
    if (step == "next") {
      return this.riskMitigation("riskMitigation", true);
    } else if (step == "previous") {
      return this.raDetails("raDetails");
    } else {
      if (this.getTemplate().countryrequired == true) {
        this.router.navigate(['/secure/ra/create/country-profile/' + this.getTemplate()._id + '/' + this.getRiskAssessment()._id + '/' + this.getRiskAssessment().country], { queryParams: { countryProfile: true } });
      } else {
        if (navigate == true) {
          return this.riskMitigation("riskMitigation", true);
        } else {
          return this.raDetails("raDetails");
        }
      }
    }
  }

  riskMitigation(step = '', navigate = true) {
    if (step == "next") {
      return this.supplierInformation("supplierInformation", true);
    } else if (step == "previous") {
      return this.countryProfile("countryProfile", false);
    } else {
      if (this.getTemplate().questionRequired == true) {
        this.router.navigate(['/secure/ra/create/risk-mitigation/' + this.getTemplate()._id + '/' + this.getRiskAssessment()._id]);
      } else {
        if (navigate == true) {
          return this.supplierInformation("supplierInformation", true);
        } else {
          return this.countryProfile("countryProfile", false);
        }
      }
    }
  }

  supplierInformation(step = '', navigate = true) {
    if (step == "next") {
      return this.communication("communication", true);
    } else if (step == "previous") {
      return this.riskMitigation("riskMitigation", false);
    } else {
      if (this.getTemplate().supplierRequired == true) {
        this.router.navigate(['/secure/ra/create/supplier/' + this.getTemplate()._id + '/' + this.getRiskAssessment()._id]);
      } else {
        if (navigate == true) {
          return this.communication("communication", true);
        } else {
          return this.riskMitigation("riskMitigation", false);
        }
      }
    }
  }

  communication(step = '', navigate = true) {
    if (step == "next") {
      return this.contingency("contingency", true);
    } else if (step == "previous") {
      return this.supplierInformation("supplierInformation", false);
    } else {
      if (this.getTemplate().communicationRequired == true) {
        this.router.navigate(['/secure/ra/create/communication/' + this.getTemplate()._id + '/' + this.getRiskAssessment()._id]);
      } else {
        if (navigate == true) {
          return this.contingency("contingency", true);
        } else {
          return this.supplierInformation("supplierInformation", false);
        }
      }
    }
  }

  contingency(step = '', navigate = true) {
    if (step == "next") {
      return this.otherDetails("otherDetails", true);
    } else if (step == "previous") {
      return this.communication("communication", false);
    } else {
      if (this.getTemplate().contingenciesRequired == true) {
        this.router.navigate(['/secure/ra/create/contingency/' + this.getTemplate()._id + '/' + this.getRiskAssessment()._id]);
      } else {
        if (navigate == true) {
          return this.otherDetails("otherDetails", true);
        } else {
          return this.communication("communication", false);
        }
      }
    }
  }

  otherDetails(step = '', navigate = true) {
    if (step == "previous") {
      return this.contingency("contingency", false);
    } else {
      this.router.navigate(['/secure/ra/create/other-details/' + this.getTemplate()._id + '/' + this.getRiskAssessment()._id]);
    }
  }

  getAllRaTemplate(key) {
    return this.http
      .get(environment.baseUrl + 'traveller/getAllTypeOfRa?keyword=' + key);
  }


  getRaDetails(templateId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getRaDetails/' + templateId);
  }

  getDeptRelatedUsers(traveler) {
    return this.http
      .post(environment.baseUrl + 'traveller/getDeptRelatedUsers', traveler);
  }

  getDeptRelatedUsersAprovingmanger(templateId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getDeptRelatedUsersAprovingmanger/' + templateId);
  }

  getDepartmentList() {
    return this.http
      .get(environment.baseUrl + 'traveller/getDepartmentList');
  }

  addRa(raData) {
    return this.http
      .post(environment.baseUrl + 'traveller/addNewsRa', raData);
  }

  getNewRaDetails(raId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getNewsRaDetails/' + raId);
  }

  getRaAnswers(raId, templateId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getRaAnswers/' + raId + '/' + templateId);
  }

  getRaQuestions(templateId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getRaQuestions/' + templateId);
  }

  addQuestionToRa(questionData) {
    return this.http
      .post(environment.baseUrl + 'traveller/addQuestionToRa', questionData);
  }

  addQuestionToRaUpdate(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/addQuestionToRaupdate', data);
  }

  addAnyOtherInfo(otherData) {
    return this.http
      .post(environment.baseUrl + 'traveller/addAnyOtherInfo', otherData);
  }
  // generateGraph(data) {
  //   return this.http
  //     .post(environment.baseUrl + 'traveller/generateGraph', data);
  // }
  submitRAToManager(raData) {
    return this.http
      .post(environment.baseUrl + 'traveller/submitRAToManager', raData);
  }
  updateNewsRa(raData) {
    return this.http
      .post(environment.baseUrl + 'traveller/updateNewsRa', raData);
  }

  updateNewQuestionRa(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/insertToRa', data);
  }

  getAllNewsRa(data) {
    return this.http.post(environment.baseUrl + 'traveller/getAllNewsRa', data);
  }

  deleteNewsRa(raId) {
    return this.http
      .get(environment.baseUrl + 'traveller/deleteNewsRa/' + raId);
  }

  getAllpendingnewsRa(data) {
    return this.http
      .post(environment.baseUrl + 'approving_manager/getAllpendingnewsRa', data);
  }

  generatePDF(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/generatePDF', data);
  }

  approveRaByManager(data) {
    return this.http
      .post(environment.baseUrl + 'approving_manager/approveRaByManager', data);
  }

  moreInfoRaByManager(data) {
    return this.http
      .post(environment.baseUrl + 'approving_manager/moreInfoRaByManager', data);
  }

  forwardToManager(data) {
    return this.http
      .post(environment.baseUrl + 'approving_manager/forwardToManager', data);
  }

  getQueOfSelectedRiskLabel(data) {
    return this.http
      .post(environment.baseUrl + 'super_admin/getQueOfSelectedRiskLabel', data);
  }

  getAllQuestionnaire(data) {
    return this.http
      .post(environment.baseUrl + 'super_admin/getAllQuestionnaire', data);
  }


  
}
