import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class RaService {

  constructor(public http: HttpClient) { }
  riskLabel = {};
  shareData = {};

  public trackChanges: BehaviorSubject<any> = new BehaviorSubject(null);
  setSubject(value) {
    if (value) {
      this.trackChanges.next(value);
    } else {
      this.trackChanges.next(null)
    }
  }



  // API call
  getCountryListForRa() {
    return this.http
      .get(environment.baseUrl + 'super_admin/getCountries');
  }

  getDepartmentList(clientId) {
    return this.http
      .get(environment.baseUrl + 'super_admin/getDepartmentusers/'+ clientId);
  }

  createRa(templateData) {
    return this.http
      .post(environment.baseUrl + 'admin/createIndividualRa', templateData);
  }

  getCountryThreatMatrix(countryIds) {
    return this.http
      .post(environment.baseUrl + 'traveller/getCountryThreatMatrix', countryIds);
  }

  getAllRiskLabels(riskData) {
    return this.http
      .post(environment.baseUrl + 'admin/getAllRiskLabels', riskData);
  }

  getAllRiskQuestionnaire(risklabelData) {
    return this.http
      .post(environment.baseUrl + 'admin/getAllRiskQuestionnaire', risklabelData);
  }

  assignQuesToRa(questionData) {
    return this.http
      .post(environment.baseUrl + 'admin/assignQuesToRa', questionData);
  }

  getRaRelatedQuestionData(raId) {
    return this.http
      .get(environment.baseUrl + 'admin/getRaPreviewData/' + raId);
  }

  assignSupplierToRa(supplierData) {
    return this.http
      .put(environment.baseUrl + 'admin/supplier/assignSupplierToRa', supplierData);
  }

  addRaCommunicationByClientAdmin(communicationData) {
    return this.http
      .post(environment.baseUrl + 'admin/addRaCommunicationByClientAdmin', communicationData);
  }

  addRaContingencyByClientAdmin(contingencyData) {
    return this.http
      .post(environment.baseUrl + 'admin/addRaContingencyByClientAdmin', contingencyData);
  }

  getRaDetailsCreatedByClient(raId) {
    return this.http
      .get(environment.baseUrl + 'admin/getRaDetailsCreatedByClient/' + raId);
  }

  updateIndividualRa(raUpdateData) {
    return this.http
      .post(environment.baseUrl + 'admin/updateIndividualRa', raUpdateData);
  }

  // getRaCommunicationData(communicationId) {
  //   return this.http
  //     .get(environment.baseUrl + 'admin/getRaCommunicationData/' + communicationId);
  // }

  updateRaCommunicationByClientAdmin(communicationData) {
    return this.http
      .post(environment.baseUrl + 'admin/updateRaCommunicationByClientAdmin', communicationData);
  }

  getContingencyData(contingencyId) {
    return this.http
      .get(environment.baseUrl + 'admin/getContingencyData/' + contingencyId);
  }

  updateRaContingencyByClientAdmin(contingencyData) {
    return this.http
      .post(environment.baseUrl + 'admin/updateRaContingencyByClientAdmin', contingencyData);
  }

  getSupplierRaData(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/getSupplierRaData', data);
  }


  getSupplierDetailsOfRaOther(raId, templateId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getSupplierDetailsOfRaOther/' + raId + '/' + templateId);
  }

  addNewsRaSupplier(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/addNewsRaSupplier', data);
  }

  assignSupplierToRiskAssessment(supplierData) {
    return this.http
      .put(environment.baseUrl + 'admin/supplier/assignSupplierToRiskAssessment', supplierData);
  }

  getCommunicationData(raId, templateId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getCommunicationData/' + raId + '/' + templateId);
  }


  getRaCommunicationDataTraveller(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/getRaCommunicationData', data);
  }

  addNewsRaCommunication(communicationData) {
    return this.http
      .post(environment.baseUrl + 'traveller/addNewsRaCommunication', communicationData);
  }

  updateNewsRaCommunication(communicationData) {
    return this.http
      .post(environment.baseUrl + 'traveller/updateNewsRaCommunication', communicationData);
  }

  getContingencyDataTraveller(raId, templateId) {
    return this.http
      .get(environment.baseUrl + 'traveller/getContingencyData/' + raId + '/' + templateId);
  }

  getRaContingencyData(data) {
    return this.http
      .post(environment.baseUrl + 'traveller/getRaContingencyData', data);
  }

  addNewsRaContingencies(contingencyData) {
    return this.http
      .post(environment.baseUrl + 'traveller/addNewsRaContingencies', contingencyData);
  }
  updateNewsRaContingencies(contingencyData) {
    return this.http
      .post(environment.baseUrl + 'traveller/updateNewsRaContingencies', contingencyData);
  }


  timeZone = [
    { name: '(GMT -12:00) Eniwetok, Kwajalein', value: "-12:00" },
    { name: '(GMT -11:00) Midway Island, Samoa', value: "-11:00" },
    { name: '(GMT -10:00) Hawaii', value: "-10:00" },
    { name: '(GMT -9:30) Taiohae', value: "-09:30" },
    { name: '(GMT - 9: 00) Alaska', value: "-09:00" },
    { name: '(GMT - 8: 00) Pacific Time(US & Canada)', value: "-08:00" },
    { name: '(GMT - 7: 00) Mountain Time(US & Canada)', value: "-07:00" },
    { name: '(GMT - 6: 00) Central Time(US & Canada), Mexico City', value: "-06:00" },
    { name: '(GMT - 5: 00) Eastern Time(US & Canada), Bogota, Lima', value: "-05:00" },
    { name: '(GMT - 4: 30) Caracas', value: "-04:30" },
    { name: '(GMT - 4: 00) Atlantic Time(Canada), Caracas, La Paz', value: "-04:00" },
    { name: '(GMT - 3: 30) Newfoundland', value: "-03:30" },
    { name: '(GMT - 3: 00) Brazil, Buenos Aires, Georgetown', value: "-03:00" },
    { name: '(GMT - 2: 00) Mid - Atlantic ', value: "-02:00" },
    { name: '(GMT - 1: 00) Azores, Cape Verde Islands', value: "-01:00" },
    { name: '(GMT + 0: 00) Western Europe Time, London, Lisbon, Casablanca', value: "+00:00" },
    { name: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris', value: "+01:00" },
    { name: '(GMT +2:00) Kaliningrad, South Africa', value: "+02:00" },
    { name: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg', value: "+03:00" },
    { name: '(GMT +3:30) Tehran', value: "+03:30" },
    { name: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi', value: "+04:00" },
    { name: '(GMT +4:30) Kabul', value: "+04:30" },
    { name: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent', value: "+05:00" },
    { name: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi', value: "+05:30" },
    { name: '(GMT +5:45) Kathmandu, Pokhara', value: "+05:45" },
    { name: '(GMT +6:00) Almaty, Dhaka, Colombo', value: "+06:00" },
    { name: '(GMT +6:30) Yangon, Mandalay', value: "+06:30" },
    { name: '(GMT +7:00) Bangkok, Hanoi, Jakarta', value: "+07:00" },
    { name: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong', value: "+08:00" },
    { name: '(GMT +8:45) Eucla', value: "+08:45" },
    { name: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk', value: "+09:00" },
    { name: '(GMT +9:30) Adelaide, Darwin', value: "+09:30" },
    { name: '(GMT +10:00) Eastern Australia, Guam, Vladivostok', value: "+10:00" },
    { name: '(GMT +10:30) Lord Howe Island', value: "+10:30" },
    { name: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia', value: "+11:00" },
    { name: '(GMT +11:30) Norfolk Island', value: "+11:30" },
    { name: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka', value: "+12:00" },
    { name: '(GMT +12:45) Chatham Islands', value: "+12:45" },
    { name: '(GMT +13:00) Apia, Nukualofa', value: "+13:00" },
    { name: '(GMT +14:00) Line Islands, Tokelau', value: "+14:00" }
  ]


}
