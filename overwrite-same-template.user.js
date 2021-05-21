// ==UserScript==
// @name         Cryptohopper Overwrite Same Template
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.1
// @description  This script will automatically select the template with the same name as the currently active configuration for the overwrite target when saving a template. If a template of the same name does not yet exist, saving as a new template will be automatically selected. Note: template names must be unique for this to function properly.
// @author       @eatsleepcoderepeat-gl
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/overwrite-same-template.user.js
// @match        https://www.cryptohopper.com/config*
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// ==/UserScript==

try {
  // Only run this code on the intended page(s) (useful when @required in a parent script)
  if (["/config","/config/config-pools","/config/signals","/config/triggers"].includes(window.location.pathname))
    (function () {
      "use strict";

      function setOverwriteTarget() {
        var hopperMenu = $('#sidebar-menu>ul>li:first-of-type');
        var hopperName = $('>a>span:first-of-type',hopperMenu).text().trim();
        var existingTemplate = jQuery(`#overwrite_template div.radio label:contains(${hopperName})`);

        // If there's a template that matches the name of the active template, select it as the overwrite target
        if(existingTemplate.length)
          existingTemplate.prev('input[type="radio"]').prop('checked',true);
        // Otherwise select the save as new template option
        else {
          jQuery('#radio_asnew').prop('checked',true);
          jQuery('#saveasnew_template,#overwrite_template').toggle();
        }
      }

      jQuery(() => {
        setOverwriteTarget();
      });
    })();
} catch (err) {
  console.log(
    `Error in script overwrite-same-template.user.js: ${err.name}: ${err.message}`
  );
}
