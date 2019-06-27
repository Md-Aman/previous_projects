import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/guards/auth.service';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  breadCrum: any;
  alive: boolean = false;
  constructor(private userService: UserService, public router: Router, private authService: AuthService,
      private responseService: ResponseService, private cdref:ChangeDetectorRef ) { }

  ngOnInit() {
    this.alive = true;
    this.responseService.currentMessage.pipe(takeWhile(() => this.alive)).subscribe(
      ( data: any ) => {
        if ( data.type == 'breadcrum' ) {
          this.breadCrum = data.data;
        }
      }
    );
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    console.log('[takeWhile] ngOnDestory');
    this.alive = false;
  }
  logout() {
    this.userService.logout()
      .subscribe(
        data => {
          this.authService.removeUser();
          this.router.navigate(['/login']);
        },
        error => {

        }
      );
  }
  userProfile(){
    this.router.navigate(['/secure/profile/update']);
    // this.router.navigate(['/secure/user/update/' + this.authService.getPermission()._id + '/personal-details']);
  }
}
