// ==UserScript==
// @name         Cryptohopper Show all AI results
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.1
// @description  Shows all hidden results in AI Results view
// @author       @D051P0
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/show-all-ai-results.js
// @match        https://www.cryptohopper.com/*
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// ==/UserScript==

(function () {
    "use strict";

    function showAllResults() {
        jQuery('#best_scoring_markets_table tbody tr').removeAttr("style");
    }

    jQuery(() => showAllResults());
})();
