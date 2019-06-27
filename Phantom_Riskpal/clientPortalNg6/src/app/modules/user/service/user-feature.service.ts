import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import {forkJoin} from 'rxjs';
import { AuthService } from "@app/core/guards/auth.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UserFeatureService {
  isMedicalEmergcny: boolean;
  private userSubject = new BehaviorSubject('');
  currentTabChanges = this.userSubject.asObservable();

  changeUserTab(data: any) {
    this.userSubject.next(data);
  }
  detectTabChanges(type, data) {
    const changes = {
      type: type,
      data: data
    };
    this.changeUserTab(changes);
  }
  constructor(public http: HttpClient, private authService: AuthService) { }



  getAllClientUser(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllUser', data);
  }
  getAllUserGroups(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllusergroup', data);
  }
  deleteUser(data) {
    return this.http
      .post(environment.baseUrl + 'super_admin/deleteUsers', data);
  }
  getUserGroups(id) {
    return this.http
    .get( environment.baseUrl + 'super_admin/getUsergroups/' + id);
  }

  getUserProofOfLifeQuestions(id) {
    return this.http
    .get( environment.baseUrl + 'super_admin/getProofOfLifeQuestions');
  }
  getAllClients() {
    return this.http
    .get( environment.baseUrl + 'super_admin/getAllClients');
  }
  getChainDataForUser(superAdmin, clientId) {
    const source = [];
    if ( !superAdmin ) {
      source.push(this.http.get( environment.baseUrl + 'super_admin/getUsergroups/'+ clientId));
      source.push(this.http.get(environment.baseUrl + 'super_admin/getDepartmentusers/'+ clientId));
    } else {
      source.push(this.http.get(environment.baseUrl + 'super_admin/getAllClients'));
    }
    return forkJoin(...source );
  }
  getCommonChainDataForUser() {
    const source = [this.http.get(environment.baseUrl + 'super_admin/getCountries' ),
    this.http.get(environment.baseUrl + 'admin/getProofOfLifeQuestions' )];
    return forkJoin(...source );
  }

  getCountries() {
    return this.http.get(environment.baseUrl + 'super_admin/getCountries')
  }
  getLanguages(){
    return this.http.get(environment.baseUrl + 'super_admin/getLanguages')
  }
  saveUser(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/saveUser', data);
  }
  updateUser(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateUser', data);
  }
  updateProfile(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateProfile', data);
  }
  getUserDetails(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/getUserDetails/' + id);
  }
  getAccessEmergencyInfoApproval(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/accessEmergencyInfoApproval/' + id);
  }
  getEmgApprovingManager() {
    return this.http
      .get( environment.baseUrl + 'super_admin/emgApprovingManager');
  }
  askForApproval(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/accessEmergencyInfoApproval', data);
  }
  getUserProfile() {
    return this.http
      .get( environment.baseUrl + 'super_admin/getUserProfile');
  }
  saveUserGroup(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/saveUsergroup', data);
  }
  updateUserGroup(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateUsergroup', data);
  }
  getUsergroupDetails(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/getUsergroupDetails/' + id);
  }
  deleteUserGroup(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/deleteUsergroup/' + id);
  }
  getAllRPstaff (data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllRPstaff', data);
  }
  deActivateRPstaff (user_id) {
    return this.http
      .put( environment.baseUrl + 'super_admin/deActivateRPStaffAccount', user_id);
  }
  saveRPstaff(data) {
    return this.http
    .post( environment.baseUrl + 'super_admin/saveNewRPstaff', data);
  }
  updateRPstaff(data) {
    
    return this.http
    .post( environment.baseUrl + 'super_admin/updateAdminDetails', data);
  }
  getUserDetailsMaster (data) {
    return this.http
    .post( environment.baseUrl + 'super_admin/getMasterAdminDetails', data);
  }
  reSendActivationEmail(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/reSendUserActivationEmail', data);
  }

  deactivateUser(data) {
    return this.http
      .post(environment.baseUrl + 'super_admin/deactivateUser', data);
  }

  updateUserMedicalInfo(data){
    return this.http
      .post( environment.baseUrl + 'super_admin/updateUserMedicalInfo', data);
  }

  updateProfileMedicalInfo(data){
    return this.http
      .post( environment.baseUrl + 'super_admin/updateProfileMedicalInfo', data);
  }



  getUserMedicalInfo(user_id){
    return this.http
    .get( environment.baseUrl + 'super_admin/getUserMedicalInfo/'+ user_id);
  }

  getProfileMedicalInfo(){
    return this.http
    .get( environment.baseUrl + 'super_admin/getProfileMedicalInfo');
  }

  updateUserTrainingInfo(data){
    return this.http
      .post( environment.baseUrl + 'super_admin/updateUserTrainingInfo', data);
  }

  updateProfileTrainingInfo(data){
    return this.http
      .post( environment.baseUrl + 'super_admin/updateProfileTrainingInfo', data);
  }

  getUserTrainingInfo(user_id){
    return this.http
    .get( environment.baseUrl + 'super_admin/getUserTrainingInfo/'+ user_id);
  }
  getProfileTrainingInfo(){
    return this.http
    .get( environment.baseUrl + 'super_admin/getProfileTrainingInfo');
  }
  updateUserEmergencyDetails(data){
    return this.http
      .post( environment.baseUrl + 'super_admin/updateUserEmergencyDetails', data);
  }
  updateProfileEmergencyDetails(data){
    return this.http
      .post( environment.baseUrl + 'super_admin/updateProfileEmergencyDetails', data);
  }
  getUserEmergencyDetails(user_id){
    return this.http
    .get( environment.baseUrl + 'super_admin/getEmergencyDetails/'+ user_id);
  }
  getUserProfileEmergencyDetails(){
    return this.http
    .get( environment.baseUrl + 'super_admin/getProfileEmergencyDetails');
  }

  checkEmergencyInfoApproval(user_id){
    return this.http
    .get( environment.baseUrl + 'super_admin/accessEmergencyInfoApproval/'+ user_id);
  }

}
