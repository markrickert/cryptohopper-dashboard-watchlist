// ==UserScript==
// @name         Cryptohopper Coin Watchlist
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.12
// @description  Adds "watchlist" abilities to your Cryprohopper account! Select the new star icon to change the background of the coin you want to watch.
// @author       @markrickert
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/coin-watchlist.user.js
// @match        https://www.cryptohopper.com/dashboard
// @match        https://www.cryptohopper.com/trade-history
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

try {
  // Only run this code on the intended page(s) (useful when @required in a parent script)
  if (["/dashboard", "/trade-history"].includes(window.location.pathname))
    (function () {
      "use strict";

      // When enabled, will clear a watch target on doubleclick.
      const EXPERIMENTAL_DOUBLE_CLICK_TO_CLEAR = false;

      // You can add and remove items from this list at will or change around the colors.
      // I have only tested font awesome icons (with the prefix "fa-").
      // You should be able to use any of the icons listed here: https://www.fontawesomecheatsheet.com/font-awesome-cheatsheet-4x/
      const WATCHLIST_STATUSES = {
        "fa-star-o": "transparent", // this is the default, outlined star.
        "fa-star": "#ffcc00",
        "fa-rocket": "#5856d6",
        "fa-heart": "#06cc98",
        "fa-question-circle": "#ff9500",
        "fa-exclamation-circle": "#5ac7fa",
        "fa-lock": "#f6887d",
        "fa-bitcoin":
          "linear-gradient(to right, rgba(179,143,0, 0.2), rgba(255, 204, 0, 0.2), rgba(179,143,0, 0.2))",
        "fa-trash": "#000000",
        "fa-reddit-alien":
          "linear-gradient(-45deg, #ee775233, #e73c7e33, #23a6d533, #23d5ab33);",
        "fa-magic":
          "linear-gradient(to right, rgba(255, 0, 0, 0.2), rgba(255, 127, 0, 0.2), rgba(255, 255, 0, 0.2), rgba(0, 255, 0, 0.2), rgba(0, 0, 255, 0.2), rgba(139, 0, 255, 0.2))",
      };

      /**
       * Application
       * Please read through this and understand what it is doing before running.
       */

      const WATCHLIST_CSS_PREFIX = "watchlist_"; // so we know which columns are ours
      const CURRENCY_TABLE = "table:contains('Currency'):contains('Action')";
      const classes = Object.keys(WATCHLIST_STATUSES);

      // This completely refreshes the color of all the matching rows to what is set in memory.
      function refreshColors() {
        const allWatchlist = GM_listValues();
        const watchlistClasses = classes
          .map(function (cl) {
            return WATCHLIST_CSS_PREFIX + cl;
          })
          .join(" ");

        const trSelector = `tr:has("a[data-target='.chart-modal'] strong")`;
        const allCoinTrs = jQuery(
          CURRENCY_TABLE +
            ` tbody ${trSelector},
      table#datatable-latesttrades ${trSelector},
      div#openorders_div table ${trSelector},
      table#trade_history_table ${trSelector}`
        );

        allCoinTrs.removeClass(watchlistClasses);

        allWatchlist.map((currency) => {
          allCoinTrs
            .filter(`:contains('${currency}')`)
            .addClass(WATCHLIST_CSS_PREFIX + GM_getValue(currency, classes[0]));
        });
      }

      function resetIcons() {
        jQuery(CURRENCY_TABLE + ` tbody tr`)
          .find(".watchlist-btn")
          .removeClass(classes.join(" "))
          .addClass(classes[0]);
      }

      // Callback function that runs whenever you press the watchlist button.
      // It will read the coin's setting and cycle to the next one in the list.
      function clickedWatchButton(icon, coin, reset = false) {
        const coinValue = GM_getValue(coin, classes[0]);

        const oldClassIndex = classes.indexOf(coinValue);
        const newClass = reset
          ? classes[0]
          : classes[oldClassIndex + 1] || classes[0];

        // We want to get all rows and all watchlist buttons and change them all at once.
        jQuery(CURRENCY_TABLE + ` tbody tr`)
          // All rows that contain the coin
          .filter(`:contains('${coin}')`)
          .each(function () {
            const row = jQuery(this);
            const icon = row.find(".watchlist-btn");

            row
              .removeClass(WATCHLIST_CSS_PREFIX + coinValue)
              .addClass(WATCHLIST_CSS_PREFIX + newClass);
            icon.removeClass(coinValue).addClass(newClass);
          });

        // Save the new coin's watchlist class.
        GM_setValue(coin, newClass);
      }

      function createWatchButton(coin) {
        const coinValue = GM_getValue(coin, classes[0]);
        const link = jQuery(`
              <a href="#" id="star_${coin}" class="btn btn-default btn-xs hidden-xs hidden-sm">
                  <i class="fa watchlist-btn ${coinValue} text-muted"></i>
              </a>`).on("click", function (e) {
          clickedWatchButton(jQuery(this).find("i"), coin);
        });
        if (EXPERIMENTAL_DOUBLE_CLICK_TO_CLEAR) {
          link.dblclick(function () {
            clickedWatchButton(jQuery(this).find("i"), coin, true);
          });
        }

        return link;
      }

      function createWatchlistColumn() {
        // Ads the "watch" title to the table.
        const link = jQuery(`
        <a href="#" class="btn btn-xs btn-default hidden-xs hidden-sm">
            <i class="fa fa-close text-muted"></i>
        </a>`)
          .on("click", function (e) {
            const allWatchlist = GM_listValues();
            const allWatchlistLength = allWatchlist.length;
            for (let i = 0; i < allWatchlistLength; i++) {
              GM_deleteValue(allWatchlist[i]);
            }
            refreshColors();
            resetIcons();
          })
          .on("destroyed", function () {
            setTimeout(() => {
              // If the X button is destroyed, that means the table refreshed and we need to reapply our columns and colors.
              createWatchlistColumn();
            }, 1000);
          });

        jQuery(CURRENCY_TABLE + " thead th[tabIndex='0']")
          .first()
          .empty()
          .append(link);

        jQuery(
          CURRENCY_TABLE + ` tr:has("a[data-target='.chart-modal'] strong")`
        ).each(function () {
          const coin = jQuery("strong", this).first().text();
          jQuery("td", this).first().empty().append(createWatchButton(coin));
        });

        refreshColors();
      }

      function initApp() {
        // Create the classes for each watchlist key:
        classes.map((cl, i) => {
          GM_addStyle(`
          .${WATCHLIST_CSS_PREFIX}${cl} {
              background: ${WATCHLIST_STATUSES[cl]}${
            WATCHLIST_STATUSES[cl][0] === "#" ? "33" : ""
          };
          }
        `);
        });

        createWatchlistColumn();
      }

      jQuery(() => initApp());
      jQuery(document).ready(function () {
        (function ($) {
          $.event.special.destroyed = {
            remove: function (o) {
              if (o.handler) {
                o.handler();
              }
            },
          };
        })(jQuery);
      });
    })();
} catch (err) {
  console.log(
    `Error in script coin-watchlist.user.js: ${err.name}: ${err.message}`
  );
}
