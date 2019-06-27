"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AuthGuard = (function () {
    function AuthGuard(router) {
        this.router = router;
        this.currentUrl = router.url;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        if (localStorage.getItem('currentUser')) {
            var currentUser = JSON.parse(localStorage.getItem('currentUser'));
            var featureList = currentUser.userInfo.featureList;
            var currentUrl = state.url;
            var lasturl = currentUrl.split('/');
            var permission = this.checkPermission(lasturl[2]);
            if (permission.indexOf(true) > -1) {
                return true;
            }
            else {
                // console.log('innnnnnn',featureList[0].featureIndentifier);
                this.router.navigate(['community/' + featureList[0].featureIndentifier]);
                return false;
            }
            // console.log(lasturl);
            // return true;
        }
        this.router.navigate(['/login']);
        return false;
    };
    AuthGuard.prototype.checkPermission = function (param) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var featureList = currentUser.userInfo.featureList;
        // loop through all features
        //console.log(featureList);
        return Object.keys(featureList).map(function (key) {
            var featureIndentifier = featureList[key].featureIndentifier;
            if (param === 'communitysetup') {
                if (featureIndentifier === 'ramanagement') {
                    return true;
                }
            }
            else {
                if (param === featureIndentifier) {
                    return true;
                }
            }
        });
        // return featureList.forEach( object => {
        //
        // });
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    core_1.Injectable()
], AuthGuard);
exports.AuthGuard = AuthGuard;
