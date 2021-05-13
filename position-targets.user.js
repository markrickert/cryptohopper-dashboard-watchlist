// ==UserScript==
// @name         Cryptohopper Position Targets
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.3
// @description  Adds a red or green icon after position names when currently targeted by the bot.
// @author       @markrickert
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/position-targets.user.js
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// ==/UserScript==

// Only run this code on the intended page(s) (useful when @required in a parent script)
if(['/dashboard'].includes(window.location.pathname)) (function () {
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
    if (response.data && response.data.ta_values) {
      const { current_sells, ta_values } = response.data;

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

      let buyTargets = [];
      for (const target in ta_values) {
        if (ta_values[target].signals == "buy") buyTargets.push(target);
      }

      if (buyTargets && buyTargets.length > 0) {
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
