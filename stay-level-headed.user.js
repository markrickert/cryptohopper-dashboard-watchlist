// ==UserScript==
// @name         Cryptohopper Emotion Remover
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.2
// @description  Removes the panic button from teh dashboard so you can leave emotion out of your trading.
// @author       @markrickert
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/stay-level-headed.user.js
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// ==/UserScript==

// Only run this code on the intended page(s) (useful when @required in a parent script)
if(['/dashboard'].includes(window.location.pathname)) (function () {
  "use strict";

  function dontPanic() {
    jQuery("div.card-box.widget-icon:has(button#panic-button)").hide();
  }

  jQuery(() => dontPanic());
})();
