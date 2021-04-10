// ==UserScript==
// @name         Cryptohopper
// @namespace    https://www.cryptohopper.com/dashboard
// @version      0.1
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

var WATCHLIST_CSS_PREFIX = "watchlist_"; // s we know which columns are ours
var CURRENCY_TABLE = "table:contains('Currency'):contains('Result')"; // this will select any table we want to target with the watchlist.

// just some color variable modifiers
var transparency = {
  light: "4D",
  lighter: "33",
  lightest: "1A",
};

// You can add and remove items from this list at will or change around the colors.
// I have only tested font awesome icons (with the prefix "fa-").
var WATCHLIST_STATUSES = {
  "fa-star-o": "transparent", // this is the default, outlined star.
  "fa-star-half": "#FEEFB3" + transparency.light,
  "fa-star": "#FEEFB3",
  "fa-rocket": "#DFF2BF" + transparency.lighter,
  "fa-heart-o": "#FFBABA" + transparency.light,
  "fa-heart": "#FFBABA",
  "fa-question-circle": "#d9edf7",
  "fa-exclamation-circle": "#DFF2BF",
  "fa-bitcoin": "#FEEFB3" + transparency.lightest,
  "fa-trash": "#FFBABA",
  "fa-reddit-alien": "#FEEFB3",
};

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
}

function initApp() {
  createColumn();
  refreshColors();
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

function createColumn() {
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
