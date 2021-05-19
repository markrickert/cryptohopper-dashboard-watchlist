// ==UserScript==
// @name         Cryptohopper Multi Select
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.2
// @description  Adds shift+click functionality for position checkboxes to allow selecting all positions of the same coin/token.
// @author       @eatsleepcoderepeat-gl
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/multi-select.user.js
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// ==/UserScript==

try {
  // Only run this code on the intended page(s) (useful when @required in a parent script)
  if (["/dashboard"].includes(window.location.pathname))
    (function () {
      "use strict";

      // Add handling to allow for holding down the shift key while clicking a position checkbox to select all positions of the same coin/token
      function positionSelectionHandler() {
        var modifierPressed = false;
        var tableSwitcher = $("#switchOpenPosTabs");
        var tableContainer = $("~ .tab-content", tableSwitcher);
        var table = $(
          'tbody:visible input[type="checkbox"]',
          tableContainer
        ).closest("tbody:visible");

        // Store the shift key state
        $(document).on("keydown keyup", function (e) {
          modifierPressed = e.shiftKey;
        });

        function shiftClickHandler(e) {
          if (
            modifierPressed &&
            e.originalEvent !== undefined &&
            e.originalEvent.isTrusted
          ) {
            var checkbox = $(this);
            var clickTable = checkbox.closest("table");
            var coinHeader = $('th:contains("Currency")', clickTable);
            if (coinHeader.length) {
              var coinIndex = coinHeader.index() + 1;
              var coin = checkbox
                .closest("tr")
                .find(">td:nth-child(" + coinIndex + ")")
                .text();
              var checked = checkbox.prop("checked");

              // Iterate through each position that has a coin that matches the coin for the checkbox we clicked on
              $("td:contains(" + coin + ")", clickTable)
                .filter(function () {
                  // Filter out any elements that aren't an exact match for our coin
                  return $(this).text() == coin;
                })
                .closest("tr")
                .find('input[type="checkbox"]')
                .not(checkbox)
                .each(function () {
                  // Update checked values to match the checkbox we clicked
                  $(this).prop("checked", checked);
                });
            }
          }
        }

        function reInitShiftClickHandler() {
          var counter = 0;
          var rebindInterval = window.setInterval(function () {
            var newTable = $(
              'tbody:visible input[type="checkbox"]',
              tableContainer
            ).closest("tbody:visible");
            if (newTable.length) {
              $('input[type="checkbox"]', newTable)
                .off()
                .on("click", shiftClickHandler);
              newTable.on("destroyed", reInitShiftClickHandler);
              window.clearInterval(rebindInterval);
            }
            counter++;
            // Timeout after 5 mins
            if (counter >= 1500) window.clearInterval(rebindInterval);
          }, 200);
        }

        // Bind our event handlers
        $('input[type="checkbox"]', table).on("click", shiftClickHandler);

        // If the table is destroyed, rebind our event handlers to the newly recreated elements
        table.on("destroyed", reInitShiftClickHandler);

        // Rebind our event handlers when switching to a different table
        tableSwitcher.on("click", reInitShiftClickHandler);
      }

      jQuery(() => {
        positionSelectionHandler();
      });
    })();
} catch (err) {
  console.log(
    `Error in script multi-select.user.js: ${err.name}: ${err.message}`
  );
}
