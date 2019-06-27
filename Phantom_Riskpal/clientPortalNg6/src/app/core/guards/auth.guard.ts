import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    public loading:boolean = false;
    public currentUrl: string;
    localUser: any;
    val: boolean;
    constructor(private router: Router, private authService: AuthService) {
        this.currentUrl = router.url;
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            // this.loading = true;
            this.authService.setLoaderFlag('start');
            // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return this.authService.checkUser().pipe(map(
                (response: any) => {
                    if (response.code == 200) {
                        this.authService.setPermission(response.data);
                        this.authService.setLoaderFlag('stop');

                        return this.detectUser(response.data, state);
                    } else {
                        this.authService.removeUser();
                        this.authService.setLoaderFlag('stop');
                        this.router.navigate(['/login']);
                    }
                }, error => {
                    this.authService.removeUser();
                    this.loading = false;
                    this.router.navigate(['/login']);
                }
            )
            )
        }
        this.authService.removeUser();
        this.router.navigate(['/login']);
        return false;
    }

    detectUser(currentUser, state) {
        const currentUrl = state.url;
        const lasturl = currentUrl.split('/');
        const featureIdentifier = lasturl[2];
        if (currentUser.super_admin || featureIdentifier === 'dashboard') {
            return true; // if RPStaff or dashboard page
        }
        const permission = this.checkPermission(lasturl, currentUser);
        if (permission === true) {
            return true;
        } else {
            this.router.navigate(['/secure/dashboard']);
            return false;
        }
    }

    checkPermission(param, currentUser) {
        // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const roles = currentUser.roleId;
        const secondUrl = param[2];
        const thirdUrl = param[3];
        const fourthUrl = param[4];
        const fifthUrl = param[5];
        // loop through all features
        console.log('featureList', param);
        if (secondUrl === 'profile' || thirdUrl === 'setting') {
            return true;
        }
        // ................... Customize template ........................
        // for risk assessment templates
        if (secondUrl === 'ra-template' || fourthUrl === 'country-profile' || fourthUrl === 'risk-mitigation'
            || fourthUrl === 'supplier' || fourthUrl === 'communication' || fourthUrl === 'contingency') {
            if (roles.managesystem.riskassessmenttemplates === '1' || roles.managesystem.riskassessmenttemplates === 'true') {
                return true;
            }
        }
        // for departments
        if (secondUrl === 'department') {
            if (roles.managesystem.departments === '1' || roles.managesystem.departments === 'true') {
                return true;
            }
        }
        // for risk levels
        if (thirdUrl === 'risk-label' || thirdUrl === 'question') {
            if (roles.managesystem.risklabels === '1' || roles.managesystem.risklabels === 'true') {
                return true;
            }
        }
        // for edit country information, listing
        if (thirdUrl === 'country') {
            if (fourthUrl === 'update') {
                if (roles.managesystem.countrythreatcategories === '1' || roles.managesystem.countrythreatcategories === 'true') {
                    return true;
                }
            } else if (roles.managesystem.countryinfo === 'true' || roles.managesystem.countryinfo === '1'
                || roles.mytravel.countrylist === '1' || roles.mytravel.countrylist === 'true') {
                return true;
            }
        }
        // for edit country category
        if (thirdUrl === 'category') {
            if (roles.managesystem.countrythreatcategories === '1' || roles.managesystem.countrythreatcategories === 'true') {
                return true;
            }
        }


        // for suppliers
        if (secondUrl === 'supplier') {
            if (roles.managesystem.csuppliers === '1' || roles.managesystem.csuppliers === 'true'
                || roles.mytravel.suppliers === '1' || roles.mytravel.suppliers === 'true') {
                return true;
            }
        }

        // ...................User Information ........................
        // for user
        if (secondUrl === 'user' && thirdUrl !== 'group') {
            if (roles.userinformation.createeditusers === '1' || roles.userinformation.createeditusers === 'true') {
                return true;
            }
        }
        if ( secondUrl === 'user' && thirdUrl === 'update' && fifthUrl === 'personal-details' ) {
            return true;
        }
        // for User group
        if (thirdUrl === 'group' && secondUrl === 'user') {
            if (roles.userinformation.editusergroup === '1' || roles.userinformation.editusergroup === 'true') {
                return true;
            }
        }


        // ................... Track and Connect ........................
        if (thirdUrl === 'pending' && secondUrl === 'ra') {
            if (roles.trackmanage.riskassessments === '1' || roles.trackmanage.riskassessments === 'true') {
                return true;
            }
        }
        if (thirdUrl === 'override' && secondUrl === 'ra') {
            if (roles.trackmanage.riskassessmentsoverride === '1' || roles.trackmanage.riskassessmentsoverride === 'true') {
                return true;
            }
        }
        // ................... My Travel........................
        // ................... Risk Assessments ........................
        if (secondUrl === 'ra' || fourthUrl === 'country-profile' || fourthUrl === 'risk-mitigation'
            || fourthUrl === 'supplier' || fourthUrl === 'communication' || fourthUrl === 'contingency') {
            if (roles.mytravel.riskassessment === '1' || roles.mytravel.riskassessment === 'true') {
                return true;
            }
        }

        return false;

    }

    getCurrentUser() {
        if (this.localUser) {
            return this.localUser;
        } else {
            this.localUser = JSON.parse(localStorage.getItem('currentUser'));
            return this.localUser;
        }
    }
}
