// ==UserScript==
// @name         Cryptohopper Export Previous Trade History
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.1
// @description  Adds a new button to the trade history page after exporting at least once, which allows users to export with a single click using the previously used settings. The author of this script finds it useful to set the *to* part of the date range to sometime in the future, such as 01/01/2031 12:01 AM, when using this functionality.
// @author       @eatsleepcoderepeat-gl
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/export-previous-trade-history.user.js
// @match        https://www.cryptohopper.com/trade-history
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// Only run this code on the trade-history page (useful when included in a parent script)
if(['/trade-history'].includes(window.location.pathname)) (function () {
  "use strict";

  const EXPORT_KEY = 'export-settings';
  const EXPORT_BUTTON_NAME = '#export-previous-trade-history';

  // This function adds the Export Previous button and handles click events
  function exportButtonHandler() {
    if(!$(EXPORT_BUTTON_NAME).length && GM_getValue(EXPORT_KEY,false) !== false) {
      GM_addStyle('button' + EXPORT_BUTTON_NAME + ' { margin-right: 3px; }');
      
      // Add the Export Previous button
      $(`button[onclick="jQuery('#exportDiv').toggle()"]`).before('<button id="' + EXPORT_BUTTON_NAME.replace('#','') + '" class="btn btn-primary waves-effect waves-light"><i class="fa fa-download m-r-5"></i> Export Previous</button>');
      
      // Handle clicks of the Export Previous button
      $(EXPORT_BUTTON_NAME).on('click',function() {
        var exportSettings = JSON.parse(GM_getValue(EXPORT_KEY));

        $('#export_type').val(exportSettings.format);
        $('#check_sells').prop('checked',exportSettings.buys);
        $('#check_buys').prop('checked',exportSettings.sells);
        $('#export_daterange').val(exportSettings.daterange);

        startExport();
      });
    }
  }

  // This function saves the current settings when exporting
  function saveOnExport() {
    $('button[onclick="startExport()"]').on('click',function() {
      var format = $('#export_type').val();
      var buys = $('#check_sells').prop('checked');
      var sells = $('#check_buys').prop('checked');
      var daterange = $('#export_daterange').val();

      // Save these values for future use
      GM_setValue(EXPORT_KEY,JSON.stringify({'format':format,'buys':buys,'sells':sells,'daterange':daterange}));

      // If this is the first export, add the Export Previous button
      if(!$(EXPORT_BUTTON_NAME).length) exportButtonHandler();
    });
  }

  jQuery(() => {
    exportButtonHandler();
    saveOnExport();
  });
})();