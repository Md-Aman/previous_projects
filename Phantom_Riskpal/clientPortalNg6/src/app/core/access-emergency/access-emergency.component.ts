import { Component, OnInit } from '@angular/core';
import { UserService } from './../../core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-access-emergency',
  templateUrl: './access-emergency.component.html',
  styleUrls: ['./access-emergency.component.scss']
})
export class AccessEmergencyComponent implements OnInit {
  loading: Boolean = false;
  id: String;
  valid: Boolean = false;
  message: String = '';
  status: String = '';
  constructor(private activeRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    // this.id = this.activeRoute.parent.snapshot.paramMap.get('id'); // get user id from parent component
    // const status = this.activeRoute.parent.snapshot.paramMap.get('status'); // get user id from parent component
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.status = params.get('status')
    })
    console.log('fff', this.status, '---', this.id);
    this.submitAccessStatus();
  }
  submitAccessStatus() {
    this.loading = true;
    const data = {status: this.status, id: this.id}
    this.userService.submitAccessStatus(data).subscribe(
      (response: any) => {
        if (response.code == 200) {
          this.valid = true;
          this.loading = false;
          this.message = response.message;
        } else {
          this.valid = false;
          this.loading = false;
          this.message = response.message;
        }
      },
      error => {
        this.valid = false;
        this.loading = false;
        this.message = error.error.message;
      }
    )
  }
}
