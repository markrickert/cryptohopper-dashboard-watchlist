// ==UserScript==
// @name         Cryptohopper Absolute Values
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.2
// @description  Adds absolute value for your open positions after the percentage change.
// @author       @markrickert, @eatsleepcoderepeat-gl
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/absolute-value.user.js
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  function addStyles() {
    GM_addStyle(`
      span[class*="rate_"]>span {
        margin-left: 0.5em;
      }
    `);
  }

  // Add absolute value to the Result column
  function addAbsoluteResult(targets) {
    // get unique currencyPairs:
    var currencyTicketUpdatePairs = Object.keys(targets).map((cv, i) =>
      // Some coin pairs come back as 1INCH/USDT instead of 1INCHUSDT
      cv.replace("/", "_")
    );
    var spanSelectors = currencyTicketUpdatePairs.map((currentValue, index) => {
      return `span.rate_${currentValue}`;
    });

    spanSelectors.forEach((currencyPairSelector, i) => {
      $(`${currencyPairSelector}`).each(function () {
        var el = $(this); // Turn it into a jquery object
        var tx = el.text().split("(")[0]; // gets the percentage changed text
        var change = tx.trim().replace("%", ""); // gets the raw number without %
        let td = $(this).closest("td").prev(); // We think the previous td is the cost.
        // Setup vars
        let cost = false;
        var thText;

        // Try to find the cost of the position by searching the
        // table headers for the word "Cost".
        while (cost === false) {
          thText = td
            .closest("tbody")
            .prev("thead")
            .find("> tr > th:eq(" + td.index() + ")");
          if (thText.length) {
            // If we found a header element
            if (thText.text().toLowerCase() === "cost") {
              // We know the current <td> contains the cost
              cost = td.text().trim();
            } else {
              // Go back one <td> and look at the header again.
              td = td.prev();
            }
          } else {
            break;
          }
        }

        if (cost) {
          try {
            // Update the span with the change
            const difference = ((change / 100) * cost).toFixed(2);
            const elHTML = el.text().split("(")[0];
            el.html(elHTML + "<span>(" + difference + ")</span>");
          } catch (e) {
            console.log(
              "absolute-value.user.js - error setting absolute change value."
            );
          }
        }
      });
    });
  }

  // This function listens for network requests and intercepts the target list to turn their icon on and off.
  function watchTicker() {
    setTimeout(() => {
      socket.on("message", function (a) {
        var parsed = JSON.parse(a);
        if ("ticker" == parsed.type) {
          // console.log("result", parsed.result)
          addAbsoluteResult(parsed.result);
        }
      });
    }, 1000); // delay accessing the socket variable so we know it's initialized.
  }

  jQuery(() => {
    addStyles();
    watchTicker();
  });
})();
