# cryptohopper-dashboard-watchlist

This is a small userscript that runs in your browser extension adding the ability to "watch" certain coins in your dashboard easier by assigning an icon and changing the background color. This allows you to track each coin over multiple hoppers with ease.

## Features:

* Allows you to track a coin by icon/color across all your hoppers. Highlight the losers or mark positions that are heavily dollar cost averaged to more easily visually identify them in your dashboard.
* Clear individual coin watches by cycling through the list.
* Clear all watchlist colors by clicking the `X` at the top of the new watchlist column.
* Double-click a watchlist icon to reset the color for that position only.
* Looks great in light and dark mode!

### Other Small Tweaks:

> All these features are flagged so you can easily turn them off:

* Puts a target icon next to each currency symbol when it is on the target buy/sell list for easier tracking of what the bot is recommending to buy or sell.
* Removes the column full of checkboxes.
* Permanently hide hoppie's hand from poking out of the side of the screen.

# ⚠️ Security implications: ⚠️

> This is a script that manipulates elements on a financial site while you are logged in. Please read and unserstand what the code is doing before you run it!

You are responsible for the code you run on your own computer. By downloading and executing this script you take responsibility for anything it may do, so please read and understand the code *before* installing it.

# See it in action!

Light Mode             |  Dark Mode
:-------------------------:|:-------------------------:
![](cryptohopper-example.png)  |  ![](cryptohopper-example-darkmode.png)

# Installation:

1. **Read and understand exactly what this script is doing.**
2. Install a userscript extension in your browser like [TamperMonkey](https://www.tampermonkey.net/).
3. Click on the Tampermonkey browser extension and select `Create a new script...`
4. Copy the text from the [`cryptohopper-dashboard-watchlist.js`](cryptohopper-dashboard-watchlist.js) file in this repository and paste it into the new user script.
5. Save the new user script.
6. Navigate to your Cryptohopper dashboard.
7. 🤖💰🚀🌖
8. ...
9. Check back as it's updated occasionally and compare your version number to what is in this repository.

# Editing the script's behavior:

All of the icons and colors can be customized in the script. Feel free to modify colors to your liking and add/remove watchlist statuses in the `WATCHLIST_STATUSES` var.

# Roadmap:

1. Clean up the code a bit and comment it better.
2. Add trend indicators to positions.
3. An overlay interface that allows you to customize status icons/colors.
