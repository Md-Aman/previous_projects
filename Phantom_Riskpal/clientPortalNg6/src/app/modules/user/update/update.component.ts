import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserFeatureService } from './../service/user-feature.service';
import { AuthService } from "./../../../core/guards/auth.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  subscription: Subscription;
  selectedTab: string;
  currentTab: any = {};
  isShowTabs: boolean = true;
  isAuthorizedAccess: boolean = false;
  constructor(
    public userFeatureService: UserFeatureService,
    private cdref: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    public authService: AuthService) {
    this.subscription = this.userFeatureService.currentTabChanges.subscribe(currentTab => {
      this.currentTab = currentTab;
      if (this.currentTab.type === 'userTab') {
        console.log("data can be found :", this.currentTab);
        this.selectedTab = this.currentTab.data.tab;
        this.isShowTabs = this.currentTab.data.isShowTabs;
        // this.checkCurrentUserId(this.currentTab.data.userId);
      }
    })
  }

  ngOnInit() {
   this.activeRoute.paramMap.subscribe(params => {
    const id  = params.get("id");
    this.checkCurrentUserId(id);
  })
  }

  checkCurrentUserId(userId) {
    if (userId) {
      if (this.authService.getPermission()._id == userId) {
        console.log("user oid :", userId)
        this.isAuthorizedAccess = true;
        this.userFeatureService.isMedicalEmergcny = true;
      } else {
        console.log("Not user oid :", userId)
        this.medicalInfoAccessStatus(userId);
      }
    }
  }

  medicalInfoAccessStatus(userId) {
    this.userFeatureService.checkEmergencyInfoApproval(userId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          if (response.data.length > 0) {
            console.log("bala al");
            this.isAuthorizedAccess = true;
            this.userFeatureService.isMedicalEmergcny = true;
          } else {
            console.log("bala al-al di");
            this.isAuthorizedAccess = false;
            this.userFeatureService.isMedicalEmergcny = false;
          }
        }
        else {
          this.isAuthorizedAccess = false;
          this.userFeatureService.isMedicalEmergcny = false;
        }
      }, error => {
        this.isAuthorizedAccess = false;
        this.userFeatureService.isMedicalEmergcny = false;
      }
    )
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
