import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "@app/core/guards/auth.service";
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(public http: HttpClient, private authService: AuthService) { }
  getAllQuestions(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getAllQuestionnaire', data);
  }
  getSingleQuestion(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/getQuestionnairDetail/' + id);
  }
  getCategories(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/getCategories', data);
  }
  save(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/addQuestionnaire', data);
  }
  update(data) {
    return this.http
      .post( environment.baseUrl + 'super_admin/updateQuestionnaire', data);
  }

  delete(id) {
    return this.http
      .get( environment.baseUrl + 'super_admin/deleteQuestionnair/' + id);
  }
}
