import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/guards/auth.service';
import { ResponseService } from './../../shared/services/response-handler/response.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private responseService: ResponseService) { }

  ngOnInit() {
    this.responseService.createBreadCrum([]);
  }
  checkSecurity ( parent, childKey ) {
    return this.authService.checkMenuSecurity(parent, childKey);
   }
}
