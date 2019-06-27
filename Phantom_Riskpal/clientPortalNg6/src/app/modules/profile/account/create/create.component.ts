import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/guards/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { UserFeatureService } from './../../../user/service/user-feature.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  currentUser: any;
  loading: false;
  selectedTab: string;
  subscription: Subscription;
  currentTab: any = {};
  constructor(private authService: AuthService, public userFeatureService: UserFeatureService,) { 
    this.subscription = this.userFeatureService.currentTabChanges.subscribe(currentTab => {
      console.log("currr :", currentTab);
      this.currentTab = currentTab;
      if(this.currentTab.type === 'userProfileTab'){
        this.selectedTab = this.currentTab.data.tab;
      }
    })
  }

  ngOnInit() {
    this.selectedTab = 'account';
    this.currentUser = this.authService.getPermission();
  }

  tabSelected(tab){
    this.selectedTab = tab;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
