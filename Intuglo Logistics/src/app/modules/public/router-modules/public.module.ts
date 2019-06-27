import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { InvalidTooltipModule } from "ng-invalid-tooltip";

import { PublicRoutingModule } from './public-routing.module';
import { HomeListComponent } from "./../../public/components/home-list/home-list.component";
import { HomePageComponent } from "./../../public/pages/home-page/home-page.component";
import { SearchResultPageComponent } from "./../../public/pages/search-result-page/search-result-page.component";

import { NavbarComponent } from "./../../public/components/navbar/navbar.component";
import { BannerAdsComponent } from "./../../public/components/banner-ads/banner-ads.component";
import { PartnersComponent } from "./../../public/components/partners/partners.component";
import { SearchboxComponent } from "./../../public/components/searchbox/searchbox.component";
import { NewsAnnouncementsComponent } from "./../../public/components/news-announcements/news-announcements.component";
import { FlippableAdsComponent } from "./../../public/components/flippable-ads/flippable-ads.component";
import { FixedAdsComponent } from "./../public/../components/fixed-ads/fixed-ads.component";
import { ResultPaginationComponent } from "./../../public/components/result-pagination/result-pagination.component";
import { SearchSummaryComponent } from "./../../public/components/search-summary/search-summary.component";
import { ResultFilterComponent } from "./../../public/components/result-filter/result-filter.component";
import { ResultSortingComponent } from "./../../public/components/result-sorting/result-sorting.component";
import { SearchResultComponent } from "./../../public/components/search-result/search-result.component";
import { LoginComponent } from "./../../public/components/login/login.component";
import { SignupOptionComponent } from "./../../public/components/signup-option/signup-option.component";
import { ActivateCustomerComponent } from './../../customer/pages/activate-customer/activate-customer.component'
import { OurServicesComponent } from './../components/our-services/our-services.component';
import { WhyIntugloComponent } from './../components/why-intuglo/why-intuglo.component';
import { TestimonialsComponent } from './../components/testimonials/testimonials.component';
import { ContactComponent } from './../components/contact/contact.component';
import { MainFooterComponent } from './../components/main-footer/main-footer.component';
import { DatePipe } from '@angular/common';
import { SearchboxNavbarComponent } from './../../public/components/searchbox-navbar/searchbox-navbar.component';
import { PrivacyPolicyComponent } from '../pages/privacy-policy/privacy-policy.component';
import { OurStoryComponent } from '../pages/our-story/our-story.component';
import { OurVisionMissionComponent } from '../pages/our-vision-mission/our-vision-mission.component';
import { OurCoreTechnologyComponent } from '../pages/our-core-technology/our-core-technology.component';
import { OurTeamComponent } from '../pages/our-team/our-team.component';
import { JoinUsComponent } from '../pages/join-us/join-us.component';
import { AffillatesAndPartnersComponent } from '../pages/affillates-and-partners/affillates-and-partners.component';
import { SharedLogisticComponent } from '../pages/shared-logistic/shared-logistic.component';
import { SharedWarehouseComponent } from '../pages/shared-warehouse/shared-warehouse.component';
import { ProductionManagementComponent } from '../pages/production-management/production-management.component';
import { QcForHireComponent } from '../pages/qc-for-hire/qc-for-hire.component';
import { ShowcaseComponent } from '../pages/showcase/showcase.component';
import { MultiPlatformComponent } from '../pages/multi-platform/multi-platform.component';
import { MarketValidationComponent } from '../pages/market-validation/market-validation.component';
import { ProjectManagementComponent } from '../pages/project-management/project-management.component';
import { OurAffiliateComponent } from '../pages/our-affiliate/our-affiliate.component';
import { OurPartnersComponent } from '../pages/our-partners/our-partners.component';
import { AffiliateSponsorshipComponent } from '../pages/affiliate-sponsorship/affiliate-sponsorship.component';
import { CommunitySponsorshipComponent } from '../pages/community-sponsorship/community-sponsorship.component';
import { ContactUsComponent } from '../pages/contact-us/contact-us.component';
import { PricingComponent } from '../pages/pricing/pricing.component';
import {SharedModule} from '@shared/modules/shared.module';
import { TermsAndConditionComponent } from '../pages/terms-and-condition/terms-and-condition.component';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MyDatePickerModule,
    IonRangeSliderModule,
    InvalidTooltipModule,
    SharedModule
  ],
  declarations: [
    HomePageComponent,
    HomeListComponent,
    SearchResultPageComponent,
    NavbarComponent,
    BannerAdsComponent,
    PartnersComponent,
    SearchboxComponent,
    SearchboxNavbarComponent,
    NewsAnnouncementsComponent,
    FlippableAdsComponent,
    FixedAdsComponent,
    ResultPaginationComponent,
    SearchSummaryComponent,
    ResultFilterComponent,
    ResultSortingComponent,
    SearchResultComponent,
    LoginComponent,
    SignupOptionComponent,
    ActivateCustomerComponent,
    OurServicesComponent,
    WhyIntugloComponent,
    TestimonialsComponent,
    ContactComponent,
    MainFooterComponent,
    PrivacyPolicyComponent,
    OurStoryComponent,
    OurVisionMissionComponent,
    OurCoreTechnologyComponent,
    OurTeamComponent,
    JoinUsComponent,
    AffillatesAndPartnersComponent,
    SharedLogisticComponent,
    SharedWarehouseComponent,
    ProductionManagementComponent,
    QcForHireComponent,
    ShowcaseComponent,
    MultiPlatformComponent,
    MarketValidationComponent,
    ProjectManagementComponent,
    OurAffiliateComponent,
    OurPartnersComponent,
    AffiliateSponsorshipComponent,
    CommunitySponsorshipComponent,
    ContactUsComponent,
    PricingComponent,
    TermsAndConditionComponent
    ],
    providers: [DatePipe]
})
export class PublicModule { }
