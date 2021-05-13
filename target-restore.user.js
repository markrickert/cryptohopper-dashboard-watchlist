// ==UserScript==
// @name         Cryptohopper Target Restore
// @namespace    https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @version      0.2
// @description  Replicates old target functionality but marks any targets that would otherwise be hidden as "inactive" and displays them in the platforms warning colour
// @author       @henrygarle
// @homepage     https://github.com/markrickert/cryptohopper-dashboard-watchlist
// @updateURL    https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/target-restore.user.js
// @match        https://www.cryptohopper.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=cryptohopper.com
// ==/UserScript==

(function () {
  "use strict";

  function processResponse(event, xhr, settings) {
    const response = JSON.parse(xhr.responseText);
    if (response.data && response.data.ta_values) {
      const { new_target, ta_values } = response.data;
      // KVP of targets, true/false donates "active"
      // "Active" targets are those which the default UI would still show even after the change
      let targets = {};

      // These are valid buy signals but may not be used by the bot if for example you have open positions that prevent it from buying
      for (const target in ta_values) {
        if (ta_values[target].signals == "buy") targets[target] = false;
      }

      // Any buy targets in this property seem to be the current and active targets
      // i.e targets that are valid and open to having orders placed and would be displayed by the default UI
      if (new_target) {
        const activeTargets =
          typeof new_target === "string" ? [new_target] : new_target;
        activeTargets.forEach((target) => {
          targets[target] = true;
        });
      }

      let targetKeys = Object.keys(targets);
      if (targetKeys.length > 0) {

      	let inactiveTargets = [];
      	let activeTargets = [];

        targetKeys.forEach((target, index) => {
          if (targets[target]) {
          	activeTargets.push(target);
          } else {
          	inactiveTargets.push(target)
          }
        });

        let activeOutput = activeTargets.length ? activeTargets.reduce((acc, x, index) => inactiveTargets.length && index == activeTargets.length - 1 ? `${acc}, ${x}, ` : `${acc}, ${x}`) : "";
        let inactiveOutput = inactiveTargets.length ? inactiveTargets.reduce((acc, x, index) => `${acc}, ${x}`) : "";

        const output = `${activeOutput}<span class="text-warning">${inactiveOutput}</span>`;
        let spinnerClass = activeOutput ? "text-success" : "text-warning";
        // Set the target list
        jQuery("#current_target_coin")
          .fadeOut(100)
          .removeClass("text-inverse")
          .addClass("text-success")
          .html(output)
          .fadeIn(100);

        // Adjust the spinner
        jQuery("#searching_target_spinner")
          .fadeOut(100)
          .removeClass("fa fa-refresh fa-spin md-location-searching")
          .addClass(`md md-gps-fixed ${spinnerClass}`)
          .css("margin-top", "-10px")
          .fadeIn(100);
      }
    }
  }

  // This function listens for network requests and intercepts the target list to turn their icon on and off.
  function monitorTargetRequest() {
    jQuery(document).ajaxComplete(processResponse);
  }

  jQuery(() => {
    monitorTargetRequest();
  });
})();
