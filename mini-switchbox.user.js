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

    jQuery("#component_content > div:nth-child(4) > div.col-lg-4 > div:nth-child(4)").css("zoom", "0.9").prop('id', 'switchbox').css("padding-bottom", "5px");;
    jQuery("#switchbox > div").css("display", "inline-block").css("margin-bottom", "15px");
    jQuery("#switchbox > hr").css("display", "none");
    jQuery(".widget-icon > .wid-icon-info").css("margin-left", "auto");
    jQuery(".md").css("margin-right", "5px");
})();
