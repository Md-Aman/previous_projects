import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.css']
})
export class TermsAndConditionComponent implements OnInit {
  page: string;
  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'];
    });
    console.log('this.page', this.page);
  }

}
