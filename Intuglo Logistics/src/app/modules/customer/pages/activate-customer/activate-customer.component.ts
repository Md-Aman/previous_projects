import { CustomerApiService } from './../../services/customer-api.service';
import { ConfigService } from '../../../../config/config.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'activate-customer',
  templateUrl: './activate-customer.component.html',
  styleUrls: ['./activate-customer.component.css']
})
export class ActivateCustomerComponent implements OnInit {

  tokenID:string;
  constructor(private activatedRoute:ActivatedRoute, private service: CustomerApiService, private configService: ConfigService) { 
    
  }
  public client_url = this.configService.client_url;
  ngOnInit() {

    this.activatedRoute.queryParams.filter(params => params.token)
    .subscribe(params => {
      this.tokenID = params.token;
    })
    let token = {
      "tokenID" : this.tokenID
    }
    this.service.patchActivateAccount(token)
      .subscribe(
        tokenValue => {
          token = tokenValue;
        });
  }

}
