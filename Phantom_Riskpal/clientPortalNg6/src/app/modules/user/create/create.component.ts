import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserFeatureService } from './../service/user-feature.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  subscription: Subscription;
  selectedTab:string;
  currentTab: any = {};
  isShowTabs: boolean = true;
  constructor(public userFeatureService: UserFeatureService, private cdref: ChangeDetectorRef,) {
    this.subscription = this.userFeatureService.currentTabChanges.subscribe(currentTab => {
      this.currentTab = currentTab;
      if(this.currentTab.type === 'userTab'){
        this.selectedTab = this.currentTab.data.tab;
        this.isShowTabs = this.currentTab.data.isShowTabs;
      }
    })
  }



  ngOnInit() {
   
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
