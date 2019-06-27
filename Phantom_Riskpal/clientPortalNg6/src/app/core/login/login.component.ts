import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../core/services/user.service';
import { AuthService } from './../guards/auth.service';
import { ToastarService } from './../../shared/services/toastr/toastar.service';
import { Observable, timer, Subscription } from 'rxjs';
import { Router } from '@angular/router';

//......
// import { Keepalive } from '@ng-idle/keepalive';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
// import { MatDialog, MatDialogRef } from '@angular/material';
// import { TimeoutModalComponent } from './../timeout-modal/timeout-modal.component';
// import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private timer = timer(5000, 5000);
  subscription: Subscription;
  loginForm: FormGroup;
  authyForm: FormGroup;
  forgotPasswordForm: FormGroup;

  toggleTabs: String = 'authyToken';
  email: string;

  valid_user: boolean = true;
  sms: boolean = false;
  voice: boolean = false;

  count: number = 0;
  public loading = false;
  placeholder: string;
  smsPlacehoder: string = "Enter sms token";
  voicePlaceholder: string = "Enter voice token";
  authyPlaceholder: string = "Enter authy token";
  forgot_password: boolean = true;

  constructor(
    private idle: Idle,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private authService: AuthService,
    public toastarService: ToastarService,
    public router: Router,
  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // if (!currentUser) {
    //   idle.stop();
    // } else {
    //   idle.setIdle(1200);
    // }

  }


  ngOnInit() {
    this.isUserLoggedIn();
    this.placeholder = "Enter authy token"
    this.loginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.authyForm = this.formBuilder.group({
      AuthToken: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )]]
    });

    if(this.userService.isForgetPass === true){
      this.forgot_password = false;
    }
  }

  isUserLoggedIn(){
    if(localStorage.getItem('currentUser') != null){
        this.router.navigate(['secure/dashboard']);
    }
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      let user = {
        "email": this.loginForm.controls.Email.value,
        "password": this.loginForm.controls.Password.value
      }
      this.userService.getUser(user).subscribe((response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.valid_user = false;
          this.email = this.loginForm.controls.Email.value;
          this.toastarService.showNotification("2FA initialized", 'success');
        } else {
          this.toastarService.showNotification(response.err, 'warning');
          this.loading = false;
        }
      }, error => {
        this.toastarService.showNotification(error.name, 'error');
        this.loading = false;
      })
    }
  }

  onSubmitAuthy() {
    if (this.authyForm.valid) {
      this.loading = true;
      let auth_data = {
        "email": this.email,
        "smstoken": this.authyForm.controls.AuthToken.value
      }
      this.userService.verify2FA(auth_data).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.code === 200) {
            this.toastarService.showNotification(response.message, 'success');
            this.authService.setUser(response.data.duoToken);
            this.startIdle();
            this.router.navigate(['/secure/dashboard']);
          } else {
            this.toastarService.showNotification(response.err, 'warning');
          }
        },
        error => {
          this.loading = false;
          this.toastarService.showNotification('Something happend wrong please try again', 'error');
        })
    }
  }


  oneTouchVerify() {
    this.loading = true;
    let email = {
      "email": this.email
    }
    this.userService.sendOTVerification(email).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.toastarService.showNotification(response.message, 'success');
          this.subscription = this.timer.subscribe((t) => this.onTimeOut());
        } else {
          this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.toastarService.showNotification('Something went wrong please try again', 'error');
        this.loading = false;
      })
  }

  onTimeOut() {
    this.count++;
    let email = {
      "email": this.email
    }
    if (this.count <= 12) {
      this.userService.checkOTVerification(email).subscribe(
        (response: any) => {
          if (response.code === 200 && response.status == 'approved') {
            this.toastarService.showNotification(response.message, 'success');
            this.subscription.unsubscribe();
            this.count = 0;
            this.loading = false;
            this.authService.setUser(response.data.duoToken);
            this.startIdle();
            this.router.navigate(['/secure/dashboard']);
          } else if (response.status == 'denied') {
            this.toastarService.showNotification(response.err, 'warning');
            this.subscription.unsubscribe();
            this.loading = false;
          } else {
            this.toastarService.showNotification(response.err, 'warning');
          }
        },
        error => {
          this.loading = false;
          this.subscription.unsubscribe();
          this.toastarService.showNotification('Something went wrong please try again', 'error');
        })
    } else {
      this.subscription.unsubscribe();
      this.count = 0;
      this.loading = false;
    }
  }
  startIdle() {
    this.idle.setIdle(1200);
    console.log('started AM feature o');
    this.idle.watch();
    const status = { state: 'Started.' };
    console.log("started :", status);
    this.userService.setStatus(status);
  }


  getToggleTabs(type) {
    this.toggleTabs = type;
    console.log('tisss', this.toggleTabs);
  }
  tabOneTouch() {
    // this.touch = true;
  }
  tabSMS() {
    this.sms = false;
    this.placeholder = this.smsPlacehoder;
  }
  tabVoice() {
    this.voice = false;
    this.placeholder = this.voicePlaceholder;
  }
  tabAuthyToken() {
    this.placeholder = this.authyPlaceholder;
  }
  tabForgotPassword(type) {
    this.forgot_password = type;
  }

  smsToken() {
    this.sms = true;
    let email = {
      "email": this.email
    }
    this.userService.sendSmsToken(email).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.toastarService.showNotification(response.message, 'success');
        } else {
          this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.toastarService.showNotification('Something went wrong please try again', 'error');
      })
  }

  voiceToken() {
    this.voice = true;
    let email = {
      "email": this.email
    }
    this.userService.sendVoiceToken(email).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.toastarService.showNotification(response.message, 'success');
        } else {
          this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.toastarService.showNotification('Something went wrong please try again', 'error');
      })
  }



  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      let email = {
        "email": this.forgotPasswordForm.controls.Email.value
      }
      this.userService.forgotPassword(email).subscribe(
        (response: any) => {
          if (response.code === 200) {
            this.toastarService.showNotification(response.message, 'success');
            this.loading = false;
          } else {
            this.toastarService.showNotification(response.err, 'warning');
            this.loading = false;
          }
        },
        error => {
          this.toastarService.showNotification(error.name, 'error');
          this.loading = false;
        }
      )
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
