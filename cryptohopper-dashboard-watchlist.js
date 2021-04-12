// ==UserScript==
// @name         Cryptohopper
// @namespace    https://www.cryptohopper.com/dashboard
// @version      0.4
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
 * USER TOGGLABLE SETTINGS:
 */

// When enabled, will add a green or red target icon next to the currency
// in your positions list when the hopper returns targeting results.
var ENABLE_POSITION_TARGETS = true;

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
  "fa-bitcoin": "#FEEFB3",
  "fa-trash": "#ff3a30",
  "fa-reddit-alien": "#007BFF",
};

/**
 * Application
 * Please read through this and understand what it is doing before running.
 */

var WATCHLIST_CSS_PREFIX = "watchlist_"; // s we know which columns are ours
var CURRENCY_TABLE = "table:contains('Currency'):contains('Result')"; // this will select any table we want to target with the watchlist.
var classes = Object.keys(WATCHLIST_STATUSES);

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
        if (typeof new_target === "string") {
          $(`.watchlist-target-${new_target}`).addClass("text-success").show();
        } else {
          new_target.map((coin) => {
            $(`.watchlist-target-${coin}`).addClass("text-success").show();
          });
        }
      }
    }
  });
}

// Inserts a little target icon right after the currency symbol in the table.
function createTargetsDomElements() {
  $(CURRENCY_TABLE + " tr a:not(:has('.watchlist-target')) strong").each(
    (i, symbol) => {
      $(
        `<i class="watchlist-target watchlist-target-${symbol.innerText} md md-gps-fixed" style="margin-left: 3px"></i>`
      )
        .hide()
        .insertAfter(symbol);
    }
  );
}

// Adds our own styles to the page. Just do this once.
function initScript() {
  classes.map((cl, i) => {
    GM_addStyle(`
      .${WATCHLIST_CSS_PREFIX}${cl} {
          background-color: ${WATCHLIST_STATUSES[cl]}33;
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

// Inititalizes the app by creating the watchlist column in the data table and calculating the colors.
function initApp() {
  createWatchlistColumn();
  refreshColors();
  if (ENABLE_POSITION_TARGETS) {
    createTargetsDomElements();
  }
}

// This completely refreshes the color of all the matching rows to what is set in memory.
function refreshColors() {
  var allWatchlist = GM_listValues();
  var watchlistClasses = classes
    .map(function (cl) {
      return WATCHLIST_CSS_PREFIX + cl;
    })
    .join(" ");
  var tableRows = $(CURRENCY_TABLE + " tbody tr");
  tableRows.removeClass(watchlistClasses);

  allWatchlist.map((currency) => {
    tableRows
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
  var td = $("<td class='text-center'></td>");
  var coinValue = GM_getValue(coin, classes[0]);
  var link = $(`
            <a href="#" id="star_${coin}" class="btn btn-default btn-xs hidden-xs hidden-sm">
                <i class="fa watchlist-btn ${coinValue} text-muted"></i>
            </a>`)
    .on("click", function (e) {
      clickedWatchButton($(this).find("i"), coin);
    })
    .dblclick(function () {
      clickedWatchButton($(this).find("i"), coin, true);
    });

  return td.append(link);
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
