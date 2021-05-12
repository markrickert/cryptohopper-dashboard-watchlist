// ==UserScript==
// @name         Cryptohopper Export Saved Trade History
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.1
// @description  Adds new functionality to the trade history page that allows saving and loading export settings, and another that allows the user to export in a single click using the saved settings, after saving at least once. The author of this script finds it useful to set the to part of the date range to sometime in the future when using this functionality, such as 01/01/2030 12:00 AM.
// @author       @eatsleepcoderepeat-gl
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/export-saved-trade-history.user.js
// @match        https://www.cryptohopper.com/trade-history
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// Only run this code on the trade-history page (useful when included in a parent script)
if(['/trade-history'].includes(window.location.pathname)) (function () {
  "use strict";

  const EXPORT_KEY = 'export-trade-history-settings';
  const EXPORT_BUTTON_NAME = '#export-saved-trade-history';
  const SAVE_BUTTON_NAME = '#save-export-settings';
  const LOAD_BUTTON_NAME = '#load-export-settings';
  const BUTTON_PRIMARY_CLASS = 'btn btn-primary waves-effect waves-light';
  const BUTTON_SECONDARY_CLASS = 'btn btn-default waves-effect';
  var buttonsAdded = false;

  // This function loads the currently saved settings
  function loadSavedSettings() {
    var exportSettings = JSON.parse(GM_getValue(EXPORT_KEY));

    // Apply saved settings
    $('#export_type').val(exportSettings.format);
    $('#check_sells').prop('checked',exportSettings.buys);
    $('#check_buys').prop('checked',exportSettings.sells);
    $('#export_daterange').val(exportSettings.daterange);
  }
  
  // This function sets our CSS
  function setStyles() {
    GM_addStyle(
      'button' + EXPORT_BUTTON_NAME + 
      ',button' + SAVE_BUTTON_NAME + 
      ',button' + LOAD_BUTTON_NAME + 
      ' { margin-right: 3px; }'
    );
  }

  // This function adds the Export Saved button and handles click events
  function exportButtonHandler() {
    if(!$(EXPORT_BUTTON_NAME).length && GM_getValue(EXPORT_KEY,false) !== false) {
      // Add the Export Saved button
      $(`button[onclick="jQuery('#exportDiv').toggle()"]`).before('<button id="' + EXPORT_BUTTON_NAME.replace('#','') + '" class="' + BUTTON_PRIMARY_CLASS + '"><i class="fa fa-download m-r-5"></i> Export Saved</button>');
      
      // Handle clicks of the Export Saved button
      $(EXPORT_BUTTON_NAME).on('click',function() {
        loadSavedSettings();

        startExport();
      });

      buttonsAdded = true;
    }
  }

  // This function saves the current settings when exporting
  function saveSettingsButtonHandler() {
    // Add the Save Settings button
    $('button[onclick="startExport()"]').before('<button id="' + SAVE_BUTTON_NAME.replace('#','') + '" class="' + BUTTON_PRIMARY_CLASS + '">Save Settings</button>');

    // Handle clicks of the Save Settings button
    $(SAVE_BUTTON_NAME).on('click',function() {
      var format = $('#export_type').val();
      var buys = $('#check_sells').prop('checked');
      var sells = $('#check_buys').prop('checked');
      var daterange = $('#export_daterange').val();

      // Save these values for future use
      GM_setValue(EXPORT_KEY,JSON.stringify({'format':format,'buys':buys,'sells':sells,'daterange':daterange}));

      // If this is the first time saving, add the Export Saved button
      if(!buttonsAdded) {
        exportButtonHandler();
        loadSettingsButtonHandler();
      }
    });
  }

  // This function loads the currently saved settings
  function loadSettingsButtonHandler() {
    if(!$(LOAD_BUTTON_NAME).length && GM_getValue(EXPORT_KEY,false) !== false) {
      // Add the Load Saved button
      $(SAVE_BUTTON_NAME).before('<button id="' + LOAD_BUTTON_NAME.replace('#','') + '" class="' + BUTTON_SECONDARY_CLASS + '">Load Saved</button>');

      // Handle clicks of the Load Saved button
      $(LOAD_BUTTON_NAME).on('click',loadSavedSettings);

      buttonsAdded = true;
    }
  }

  jQuery(() => {
    setStyles();
    exportButtonHandler();
    saveSettingsButtonHandler();
    loadSettingsButtonHandler();
  });
})();
