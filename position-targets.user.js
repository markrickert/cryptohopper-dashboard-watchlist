// ==UserScript==
// @name         Cryptohopper Position Targets
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.0.1
// @description  Adds a red or green icon after position names when currently targeted by the bot..
// @author       @markrickert
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/position-targets.user.js
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  function addStyles() {
    GM_addStyle(`
      table.dataTable tr td.target-buy::after, table.dataTable tr td.target-sell::after {
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;

        font-family:'Material Design Iconic Font';
        padding-left:3px;
        font-size: 0.9em;
        content:"\\f140";
        color: #06cc98;
      }

      table.dataTable tr td.target-sell::after {
        color: #f6887d;
      }
    `);
  }

  function processResponse(event, xhr, settings) {
    const response = JSON.parse(xhr.responseText);
    if (response.data && response.data.current_sells) {
      const { current_sells, new_target } = response.data;

      const allCoinTDs = jQuery(
        `table:contains('Currency'):contains('Action') tr td:has("a[data-target='.chart-modal'] strong")`
      );
      allCoinTDs.removeClass("target-buy target-sell");

      if (current_sells && current_sells.length > 0) {
        const sellTargets = current_sells.split(",");
        allCoinTDs.each((i, td) => {
          if (sellTargets.includes(td.innerText)) {
            jQuery(td).addClass("target-sell");
          }
        });
      }
      if (new_target && new_target.length > 0) {
        const buyTargets =
          typeof new_target === "string" ? [new_target] : new_target;

        allCoinTDs.each((i, td) => {
          if (buyTargets.includes(td.innerText)) {
            jQuery(td).addClass("target-buy");
          }
        });
      }
    }
  }

  // This function listens for network requests and intercepts the target list to turn their icon on and off.
  function watchTargets() {
    jQuery(document).ajaxComplete(processResponse);
  }

  jQuery(() => {
    addStyles();
    watchTargets();
  });
})();
