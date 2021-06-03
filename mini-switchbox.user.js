// ==UserScript==
// @name         Cryptohopper Mini Switchbox
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.1
// @description  Makes the switchbox smaller
// @author       @falcontx
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    jQuery("#component_content > div:nth-child(4) > div.col-lg-4 > div.card-box").prop('id', 'switchbox').css("padding-bottom", "5px");
    var w = jQuery("#switchbox").width();
    var z = w <= 320 ? w/320*0.9 : 0.9;
    jQuery("#switchbox").css("zoom", z);
    jQuery("#switchbox > div").css("display", "inline-block").css("margin-bottom", "15px");
    jQuery("#switchbox > hr").css("display", "none");
    jQuery("#switchbox > div > .wid-icon-info").css("margin-left", "auto");
    jQuery("#switchbox > div > .md").css("margin-right", "5px");
})();
