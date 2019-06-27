import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RaService } from './../service/ra.service';
import { AuthService } from './../../../core/guards/auth.service';
import { RiskAssessmentService } from './../../../modules/ra/service/risk-assessment.service';


@Component({
  selector: 'app-country-profile',
  templateUrl: './country-profile.component.html',
  styleUrls: ['./country-profile.component.scss'],
  // encapsulation: ViewEncapsulation.Native
})
export class CountryProfileComponent implements OnInit {
  public loading = false;
  isFirstOpen: boolean = true;
  // For charts
  view = [];
  showYAxis = true;
  showLegend = false;
  tooltipDisabled = true;
  countryDetails: any;
  graphData = [];
  label: number;
  color;
  customColors = [];
  displayCountryProfile: boolean = true;
  graphs: any = [];
  realTime: String = 'true';
  constructor(
    private raTemplateService: RaTemplateService,
    public raService: RaService,
    private riskAssessmentService: RiskAssessmentService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  raId: string;
  selectedIndex: string;
  countryObj: any = { country_id: { name: " " }, code: " " };

  ngOnInit() {
    this.loading = true;
    this.raId = this.activatedRoute.snapshot.paramMap.get("raId");
    const countryId = this.activatedRoute.snapshot.paramMap.get("countryIds");
    this.realTime = this.activatedRoute.snapshot.paramMap.get('realTime');
    this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('countryProfile'));

    if (countryId) {
      this.getQueryParam(countryId);
    } else {
      this.router.navigate(['/secure/ra-template/create/template-details']);
    }
  }

  getQueryParam(countryId) {
    const countryIdsCommaSeperated = countryId.split(',');
    this.activatedRoute.queryParams.subscribe(params => {
      const countryProfile = params.countryProfile;
      if (countryProfile === 'false') {
        this.loading = false;
        this.displayCountryProfile = false;
      } else {
        const countryIds = {
          country: countryIdsCommaSeperated,
          realTimeDataFromLiveApi: false // need to change to true
        };
        this.raService.getCountryThreatMatrix(countryIds).subscribe(
          (response: any) => {
            if (response.code === 200) {

              this.countryDetails = response.countryObj.map(item => {
                if (item.country_id.specific_info == undefined) {
                  item.country_id.specific_info = '';
                }
                item.threatMatrix.forEach(element => {
                  if (element.country_risk === 'High') {
                    this.label = 3;
                    this.color = 'red';
                  } else if (element.country_risk === 'Medium') {
                    this.label = 2;
                    this.color = 'yellow';
                  } else if (element.country_risk === 'Low') {
                    this.label = 1;
                    this.color = 'green';
                  } else {
                    this.label = 0;
                    this.color = 'white';
                  }
                  if ( element.country_risk != '' ) {
                    this.graphData.push({ name: element.category_id.categoryName, value: this.label });
                    this.customColors.push({ name: element.category_id.categoryName, value: this.color });
                  }

                });
                item.graphData = this.graphData;
                item.customColors = this.customColors;
                this.graphData = [];
                this.customColors = [];

                if (item.threatMatrix.length >= 15) {
                  this.view.push(480, 290);
                } else if (item.threatMatrix.length >= 10 && item.threatMatrix.length < 15) {
                  this.view.push(480, 230);
                } else if (item.threatMatrix.length >= 5 && item.threatMatrix.length < 10) {
                  this.view.push(480, 150);
                } else {
                  this.view.push(480, 70);
                }
                item.view = this.view;
                this.view = [];
                let countOne = 0;
                let countTwo = 0;
                let countThree = 0;
                let hasPresentOn = item.graphData.find(
                  function (ele) {
                    if (ele.value === 1) {
                      countOne++;
                    } else if (ele.value === 2) {
                      countTwo++;
                    } else if (ele.value === 3) {
                      countThree++;
                    }
                  }

                );
                console.log("count :", '1 .', countOne, '2 .', countTwo, '3 .', countThree);

                return item;
              });
              this.countryDetails[0].active = true;
              console.log(" this.countryDetails :", this.countryDetails)
              this.selectedIndex = this.countryDetails[0].country_id.name;
              this.getData(this.countryDetails[0]._id);
            }

            // if (this.countryDetails.length == response.countryObj.length && this.realTime == 'true') {
            //   setTimeout(() => { this.convertSVGToImage(); console.log('outttt'); this.loading = false; }, 8000);
            // } 
            // else {
            this.loading = false;
            // }


          });
      }
    });


  }


  // convertSVGToImage() {
  //   const svg = Array.from(document.querySelectorAll(".graphs svg")); // document.querySelector('svg');
  //   svg.forEach(item => {
  //     const xml = new XMLSerializer().serializeToString(item);
  //     const svg64 = btoa(unescape(encodeURIComponent(xml))); // for utf8: btoa(unescape(encodeURIComponent(xml)))
  //     const b64start = 'data:image/svg+xml;base64,';
  //     const image64 = b64start + svg64;
  //     this.graphs.push(image64);
  //   });
  //   this.authService.setSessionStorage('countryGraphs', this.graphs);
  // }
  countryProfileStep(step, value) {
    if (this.raId) {
      this.riskAssessmentService.countryProfile(step, value)
    } else {
      if (step == 'next') {
        this.checkRaTemplateStep(this.raTemplateService.getRaPages());
      } else {
        this.raTemplateService.countryProfile(step, value);
      }
    }
  }

  checkRaTemplateStep(data) {
    if (data.questionRequired != true &&
      data.supplierRequired != true &&
      data.communicationRequired != true &&
      data.contingenciesRequired != true
    ) {
      this.createRaTemplate(this.raTemplateService.getRa()._id);
    } else {
      this.raTemplateService.countryProfile("next");
    }
  }

  createRaTemplate(raId) {
    this.raTemplateService.createRaTemplate(raId);
  }

  onClickSelectedCountry(selectedCountry, objctId) {
    this.selectedIndex = selectedCountry;
    this.getData(objctId);

  }
  getData(objId) {
    this.countryObj = this.countryDetails.find(item => item._id === objId);
  }

}
