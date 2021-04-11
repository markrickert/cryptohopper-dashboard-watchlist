// ==UserScript==
// @name         Cryptohopper
// @namespace    https://www.cryptohopper.com/dashboard
// @version      0.2
// @description  Adds "watchlist" abilities to your Cryprohopper account! Select the new star icon to change the background of the coin you want to watch.
// @author       Mark Rickert
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

/**
 * USER TOGGLE SETTINGS:
 */

// When enabled, will add a green or red target icon next to the currency
// in your positions list when the hopper returns targeting results.
var ENABLE_POSITION_TARGETS = true;

// You can add and remove items from this list at will or change around the colors.
// I have only tested font awesome icons (with the prefix "fa-").
// You should be able to use any of the icons listed here: https://www.fontawesomecheatsheet.com/font-awesome-cheatsheet-4x/
var WATCHLIST_STATUSES = {
  "fa-star-o": "transparent", // this is the default, outlined star.
  "fa-star-half": "#FEEFB34D",
  "fa-star": "#FEEFB3",
  "fa-rocket": "#DFF2BF33",
  "fa-heart-o": "#FFBABA4d",
  "fa-heart": "#FFBABA",
  "fa-question-circle": "#d9edf7",
  "fa-exclamation-circle": "#DFF2BF",
  "fa-bitcoin": "#FEEFB31A",
  "fa-trash": "#FFBABA",
  "fa-reddit-alien": "#FEEFB3",
};

/**
 * Application
 * Please read through this and understand what it is doing before running.
 */

var WATCHLIST_CSS_PREFIX = "watchlist_"; // s we know which columns are ours
var CURRENCY_TABLE = "table:contains('Currency'):contains('Result')"; // this will select any table we want to target with the watchlist.

// This function listens for network requests and intercepts the target list to turn their icon on and off.
function watchTargets() {
  $(document).ajaxComplete(function (event, xhr, settings) {
    var response = JSON.parse(xhr.responseText);
    if (response.data) {
      var { current_sells, new_target } = response.data;

      $(".watchlist-target").hide().removeClass("text-danger text-success");

      if (current_sells && current_sells.length > 0) {
        var all_sells = current_sells.split(",");
        all_sells.map((coin) => {
          $(`.watchlist-target-${coin}`).addClass("text-danger").show();
        });
      }
      if (new_target && new_target.length > 0) {
        new_target.map((coin) => {
          $(`.watchlist-target-${coin}`).addClass("text-success").show();
        });
      }
    }
  });
}

// Adds our own styles to the page. Just do this once.
function initScript() {
  Object.keys(WATCHLIST_STATUSES).map((cl, i) => {
    GM_addStyle(`
      .${WATCHLIST_CSS_PREFIX}${cl} {
          background-color: ${WATCHLIST_STATUSES[cl]};
      }
    `);
  });
  GM_addStyle(`
    .${WATCHLIST_CSS_PREFIX}fa-heart .text-danger {
        color: #D8000C !important;
    }
  `);

  // Start watching for targets
  if (ENABLE_POSITION_TARGETS) {
    watchTargets();
  }
}

function initApp() {
  createWatchlistColumn();
  refreshColors();
  if (ENABLE_POSITION_TARGETS) {
    createTargetsDomElements();
  }
}

/**
 * This completely refreshes the color of all the matching rows to what is set in memory.
 */
function refreshColors() {
  var classes = Object.keys(WATCHLIST_STATUSES);
  var watchlistClasses = classes
    .map(function (cl) {
      return WATCHLIST_CSS_PREFIX + cl;
    })
    .join(" ");
  $(CURRENCY_TABLE + " tbody tr").each(function () {
    var coin = $(this).find("strong").first();
    $(this).removeClass(watchlistClasses);
    if (coin) {
      $(this).addClass(
        WATCHLIST_CSS_PREFIX + GM_getValue(coin.text(), classes[0])
      );
    }
  });
}

function createWatchButton(coin) {
  var classes = Object.keys(WATCHLIST_STATUSES);
  var td = $("<td class='text-center'></td>");
  var link = $(`
            <a href="#" id="star_${coin}" class="btn btn-default btn-xs hidden-xs hidden-sm">
                <i class="fa watchlist-btn ${GM_getValue(
                  coin,
                  classes[0]
                )} text-muted"></i>
            </a>`).on("click", function (e) {
    var icon = $(this).find("i");
    for (var i = 0; i < classes.length; i++) {
      if (icon.hasClass(classes[i])) {
        icon.removeClass(classes[i]);
        var newClass = classes[i + 1] || classes[0];
        icon.addClass(newClass);
        GM_setValue(coin, newClass);
        refreshColors();
        break;
      }
    }
  });

  return td.append(link);
}

function createTargetsDomElements() {
  $(CURRENCY_TABLE + " tr a strong").each((i, symbol) => {
    $(
      `<i class="watchlist-target watchlist-target-${symbol.innerText} md md-gps-fixed" style="margin-left: 3px"></i>`
    )
      .hide()
      .insertAfter(symbol);
  });
}

function createWatchlistColumn() {
  // Ads the "watch" title to the table.
  var th = $(
    '<th align="center" aria-controls="" rowspan="1" colspan="1" style="padding-right: 8px;width: 8px;"></th>'
  );
  var link = $(`
    <a href="#" class="btn btn-xs btn-default hidden-xs hidden-sm">
        <i class="fa fa-close text-muted"></i>
    </a>`)
    .on("click", function (e) {
      var allWatchlist = GM_listValues();
      for (var i = 0; i < allWatchlist.length; i++) {
        GM_deleteValue(allWatchlist[i]);
      }
      refreshColors();
    })
    .bind("destroyed", function () {
      setTimeout(() => {
        initApp();
      }, 1000);
    });

  $(CURRENCY_TABLE + ":not(:has('.watchlist-btn')) thead tr").prepend(
    th.append(link)
  );
  $(CURRENCY_TABLE + ":not(:has('.watchlist-btn')) tbody tr").each(function () {
    const coin = $("strong", this).first().text();
    $(this).data("coin-row", coin);
    $(this).prepend(createWatchButton(coin));
  });
}

(function () {
  "use strict";
  initScript();
  initApp();
})();

// jquery function that watches when a DOM element is destrotyed.
(function ($) {
  $.event.special.destroyed = {
    remove: function (o) {
      if (o.handler) {
        o.handler();
      }
    },
  };
})(jQuery);
