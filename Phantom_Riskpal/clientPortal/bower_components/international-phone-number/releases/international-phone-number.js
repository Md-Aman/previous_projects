/*! international-phone-number 2015-04-25 */
(function() {
    "use strict";
    angular.module("internationalPhoneNumber", []).directive("internationalPhoneNumber", ["$timeout", function(a) {
        return {
            restrict: "A",
            require: "^ngModel",
            scope: {
                ngModel: "=",
                defaultCountry: "@"
            },
            link: function(b, c, d, e) {
                var f, g, h, i;
                return h = function() {
                    return e.$setViewValue(c.val())
                }, f = function(a) {
                    return a instanceof Array ? a : a.toString().replace(/[ ]/g, "").split(",")
                }, g = {
                    autoFormat: !0,
                    autoHideDialCode: !0,
                    defaultCountry: "",
                    nationalMode: !1,
                    numberType: "",
                    onlyCountries: void 0,
                    preferredCountries: ["us", "gb"],
                    responsiveDropdown: !1,
                    utilsScript: ""
                }, angular.forEach(g, function(a, b) {
                    var c;
                    if (d.hasOwnProperty(b) && angular.isDefined(d[b])) return c = d[b], "preferredCountries" === b ? g.preferredCountries = f(c) : "onlyCountries" === b ? g.onlyCountries = f(c) : "boolean" == typeof a ? g[b] = "true" === c : g[b] = c
                }), i = b.$watch("ngModel", function(a) {
                    return b.$$postDigest(function() {
                        return g.defaultCountry = b.defaultCountry, null !== a && void 0 !== a && "" !== a && c.val(a), c.intlTelInput(g), void 0 !== d.skipUtilScriptDownload || g.utilsScript || c.intlTelInput("loadUtils", "/bower_components/intl-tel-input/lib/libphonenumber/build/utils.js"), i()
                    })
                }), e.$formatters.push(function(b) {
                    return b ? (a(function() {
                        return c.intlTelInput("setNumber", b)
                    }, 0), c.val()) : b
                }), e.$parsers.push(function(a) {
                    return a ? a.replace(/[^\d]/g, "") : a
                }), e.$validators && (e.$validators.internationalPhoneNumber = function(a) {
                    return a ? c.intlTelInput("isValidNumber") : a
                }), c.on("blur keyup change", function(a) {
                    return b.$apply(h)
                }), c.on("$destroy", function() {
                    return c.intlTelInput("destroy"), c.off("blur keyup change")
                })
            }
        }
    }])
}).call(this);