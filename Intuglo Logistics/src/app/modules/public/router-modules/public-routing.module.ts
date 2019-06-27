import { AffiliateSponsorshipComponent } from './../pages/affiliate-sponsorship/affiliate-sponsorship.component';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeListComponent } from './../../public/components/home-list/home-list.component';
import { HomePageComponent } from './../../public/pages/home-page/home-page.component';
import { SearchResultPageComponent } from './../../public/pages/search-result-page/search-result-page.component';
import { PrivacyPolicyComponent } from './../../public/pages/privacy-policy/privacy-policy.component';
import { ActivateCustomerComponent } from './../../customer/pages/activate-customer/activate-customer.component';
import { OurStoryComponent } from './../../public/pages/our-story/our-story.component';
import { OurVisionMissionComponent } from './../../public/pages/our-vision-mission/our-vision-mission.component';
import { OurCoreTechnologyComponent } from './../../public/pages/our-core-technology/our-core-technology.component';
import { OurTeamComponent } from './../../public/pages/our-team/our-team.component';
import { JoinUsComponent } from './../../public/pages/join-us/join-us.component';
import { SharedLogisticComponent } from './../../public/pages/shared-logistic/shared-logistic.component';
import { SharedWarehouseComponent } from './../../public/pages/shared-warehouse/shared-warehouse.component';
import { ProductionManagementComponent } from './../../public/pages/production-management/production-management.component';
import { QcForHireComponent } from './../../public/pages/qc-for-hire/qc-for-hire.component';
import { ShowcaseComponent } from './../../public/pages/showcase/showcase.component';
import { MultiPlatformComponent } from './../../public/pages/multi-platform/multi-platform.component';
import { MarketValidationComponent } from './../../public/pages/market-validation/market-validation.component';
import { ProjectManagementComponent } from './../../public/pages/project-management/project-management.component';
import { OurAffiliateComponent } from './../pages/our-affiliate/our-affiliate.component';
import { OurPartnersComponent } from './../pages/our-partners/our-partners.component';
import { CommunitySponsorshipComponent } from '../pages/community-sponsorship/community-sponsorship.component';
import { ContactUsComponent } from './../pages/contact-us/contact-us.component';
import { PricingComponent } from './../pages/pricing/pricing.component';
import { TermsAndConditionComponent } from './../pages/terms-and-condition/terms-and-condition.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: '',
        component: HomeListComponent
      },
      // {
      //   path: "searchresult",
      //   component: SearchResultPageComponent
      // },
    ]
  },
  {
    path: 'searchresult',
    component: SearchResultPageComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'customer/activate',
    component: ActivateCustomerComponent
  },
  {
    path: 'our-story',
    component: OurStoryComponent
  },
  {
    path: 'our-vision-mission',
    component: OurVisionMissionComponent
  },
  {
    path: 'our-core-technology',
    component: OurCoreTechnologyComponent
  },
  {
    path: 'our-team',
    component: OurTeamComponent
  },
  {
    path: 'join-us',
    component: JoinUsComponent
  },
  {
    path: 'shared-logistic',
    component: SharedLogisticComponent
  },
  {
    path: 'shared-warehouse',
    component: SharedWarehouseComponent
  },
  {
    path: 'production-management',
    component: ProductionManagementComponent
  },
  {
    path: 'qc-for-hire',
    component: QcForHireComponent
  },
  {
    path: 'showcase',
    component: ShowcaseComponent
  },
  {
    path: 'multi-platform',
    component: MultiPlatformComponent
  },
  {
    path: 'market-validation',
    component: MarketValidationComponent
  },
  {
    path: 'project-management',
    component: ProjectManagementComponent
  },
  {
    path: 'our-affiliate',
    component: OurAffiliateComponent
  },
  {
    path: 'our-partners',
    component: OurPartnersComponent
  }
  ,
  {
    path: 'affiliate-sponsorship',
    component: AffiliateSponsorshipComponent
  },
  {
    path: 'community-sponsorship',
    component: CommunitySponsorshipComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'terms-and-condition',
    component: TermsAndConditionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
