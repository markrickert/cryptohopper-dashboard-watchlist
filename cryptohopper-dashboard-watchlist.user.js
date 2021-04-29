// ==UserScript==
// @name         Cryptohopper Watchlist
// @namespace    https://www.cryptohopper.com/dashboard
// @version      0.10
// @description  Adds "watchlist" abilities to your Cryprohopper account! Select the new star icon to change the background of the coin you want to watch.
// @author       Mark Rickert
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/cryptohopper-dashboard-watchlist.user.js
// @match        https://www.cryptohopper.com/dashboard
// @match        https://www.cryptohopper.com/trade-history
// @match        https://www.cryptohopper.com/chart/chart.php*
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

/**
 * USER TOGGLABLE SETTINGS:
 */

// When enabled, will clear a watch target on doouobleclick.
var EXPERIMENTAL_DOUBLE_CLICK_TO_CLEAR = false;

// Puts a green dotted line on all tradingview charts that shows your buy rate
// and a "buy" indicator where your last purchase was with the average rate.
var SHOW_BUY_RATE_IN_TRADING_VIEW = true;

// You can add and remove items from this list at will or change around the colors.
// I have only tested font awesome icons (with the prefix "fa-").
// You should be able to use any of the icons listed here: https://www.fontawesomecheatsheet.com/font-awesome-cheatsheet-4x/
var WATCHLIST_STATUSES = {
  "fa-star-o": "transparent", // this is the default, outlined star.
  "fa-star": "#ffcc00",
  "fa-rocket": "#5856d6",
  "fa-heart": "#ff2d55",
  "fa-question-circle": "#ff9500",
  "fa-exclamation-circle": "#5ac7fa",
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

var WATCHLIST_CSS_PREFIX = "watchlist_"; // s we know which columns are ours
var CURRENCY_TABLE = "table:contains('Currency'):contains('Action')";
var OTHER_TABLES = "table:contains('Currency'):contains('View')";
var LATEST_TRATES_TABLE = "#datatable-latesttrades";
var classes = Object.keys(WATCHLIST_STATUSES);

// Adds our own styles to the page. Just do this once.
function initScript() {
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
}

function initChartMods() {
  console.log("initChartMods");

  widget.onChartReady(function () {
    let buyRate = parseFloat(getParameterByName("buy_rate"));
    var buyTime = parseInt(getParameterByName("buy_time"));
    var tpRate = getParameterByName("tp_rate");

    if (buyRate && widget) {
      widget
        .chart()
        .createPositionLine()
        .setText("Avg Price")
        .setLineColor("#1BB270")
        .setQuantity(parseFloat(0))
        .setLineLength(3)
        .setPrice(parseFloat(buyRate));

      widget
        .chart()
        .createExecutionShape()
        .setText("BUY")
        .setTextColor("#1BB270")
        .setArrowColor("#1BB270")
        .setDirection("buy")
        .setTime(buyTime)
        .setPrice(parseFloat(buyRate));
    }
  });
}

// Inititalizes the app by creating the watchlist column in the data table and calculating the colors.
function initApp() {
  createWatchlistColumn();
  refreshColors();
}

// This completely refreshes the color of all the matching rows to what is set in memory.
function refreshColors() {
  var allWatchlist = GM_listValues();
  var watchlistClasses = classes
    .map(function (cl) {
      return WATCHLIST_CSS_PREFIX + cl;
    })
    .join(" ");

  var trSelector = `tr:has("a[data-target='.chart-modal'] strong")`;
  var allCoinTrs = $(
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

function refreshIcons() {
  $(CURRENCY_TABLE + ` tbody tr`)
    .find(".watchlist-btn")
    .removeClass(classes.join(" "))
    .addClass(classes[0]);
}

// Callback function that runs whenever you press the watchlist button.
// It will read the coin's setting and cycle to the next one in the list.
function clickedWatchButton(icon, coin, reset = false) {
  var coinValue = GM_getValue(coin, classes[0]);

  var oldClassIndex = classes.indexOf(coinValue);
  var newClass = reset ? classes[0] : classes[oldClassIndex + 1] || classes[0];

  // We want to get all rows and all watchlist buttons and change them all at once.
  $(CURRENCY_TABLE + ` tbody tr`)
    // All rows that contain the coin
    .filter(`:contains('${coin}')`)
    .each(function () {
      var row = $(this);
      var icon = row.find(".watchlist-btn");

      row
        .removeClass(WATCHLIST_CSS_PREFIX + coinValue)
        .addClass(WATCHLIST_CSS_PREFIX + newClass);
      icon.removeClass(coinValue).addClass(newClass);
    });

  // Save the new coin's watchlist class.
  GM_setValue(coin, newClass);
}

function createWatchButton(coin) {
  var coinValue = GM_getValue(coin, classes[0]);
  var link = $(`
            <a href="#" id="star_${coin}" class="btn btn-default btn-xs hidden-xs hidden-sm">
                <i class="fa watchlist-btn ${coinValue} text-muted"></i>
            </a>`).on("click", function (e) {
    clickedWatchButton($(this).find("i"), coin);
  });
  if (EXPERIMENTAL_DOUBLE_CLICK_TO_CLEAR) {
    link.dblclick(function () {
      clickedWatchButton($(this).find("i"), coin, true);
    });
  }

  return link;
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
      var allWatchlistLength = allWatchlist.length;
      for (var i = 0; i < allWatchlistLength; i++) {
        GM_deleteValue(allWatchlist[i]);
      }
      refreshColors();
      refreshIcons();
    })
    .on("destroyed", function () {
      setTimeout(() => {
        // If the X button is destroyed, that means the table refreshed and we need to reapply our columns and colors.
        initApp();
      }, 1000);
    });

  // Only add these columns to the main dashboard table, not anywhere else.
  $(CURRENCY_TABLE + " thead th[tabIndex='0']")
    .first()
    .empty()
    .append(link);

  var allCoinTrs = $(
    CURRENCY_TABLE + ` tr:has("a[data-target='.chart-modal'] strong")`
  ).each(function () {
    const coin = $("strong", this).first().text();
    $("td", this).first().empty().append(createWatchButton(coin));
  });
}

function main() {
  if (window.location.pathname === "/chart/chart.php") {
    if (SHOW_BUY_RATE_IN_TRADING_VIEW) {
      initChartMods();
    }
  } else {
    initScript();
    initApp();
  }
}

(function () {
  "use strict";
  main();
})();

// jquery function that watches when a DOM element is destrotyed.
if (window.jQuery) {
  $(document).ready(function () {
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
}
