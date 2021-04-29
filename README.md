# User Scripts to modify your Cryptohopper Experience

This is a small collection of userscripts that run on cryptohopper.com to enhance your experience. Each userscript focuses on one tweak or feature and can be run independent of the others. Run them all or just a few!

### Quick install links:

> if you already have TamperMonkey installed and know what you're dong.

* [`cryptohopper-dashboard-watchlist.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/cryptohopper-dashboard-watchlist.user.js)
* [`chart-mods.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/chart-mods.user.user.js)
* [`position-targets.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/position-targets.user.js)
* [`remove-hoppie.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/remove-hoppie.user.js)
* [`absolute-value.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/absolute-value.user.js)

## cryptohopper-dashboard-watchlist.user.js

* Allows you to track a coin by icon/color across all your hoppers. Highlight the losers or mark positions that are heavily dollar cost averaged to more easily visually identify them in your dashboard or mark coins that are part of a custom config pool.
* Clear individual coin watches by cycling through the list in the Open Positions table.
* Clear all watchlist colors by clicking the `X` at the top of the new watchlist column.
* Adds row colors to the Last 5 Sells table and the trade history page.
* Looks great in light and dark mode!

Light Mode             |  Dark Mode
:-------------------------:|:-------------------------:
![](images/watchlist-light.png)  |  ![](images/watchlist-dark.png)


## chart-mods.user.js

* Adds your average price and last buy indicator to the Tradingview graph.

Light Mode             |  Dark Mode
:-------------------------:|:-------------------------:
![](images/chart-mods-light.png)  |  ![](images/chart-mods-dark.png)

> Note: Some users are served the chart on `chart/chart_tradingview.php` and this script will not work if your charts are loaded from there. It will only work on the `chart/chart.php` url.

## position-targets.user.js

* Puts a target icon next to each currency symbol when it is on the target buy/sell list for easier tracking of what the bot is recommending to buy or sell.

Light Mode             |  Dark Mode
:-------------------------:|:-------------------------:
![](images/targets-light.png)  |  ![](images/targets-dark.png)

## remove-hoppie.user.js

* Permanently hide hoppie's hand from poking out of the side of the screen.

---

# ⚠️ Security implications: ⚠️

> This is a script that manipulates elements on a financial site while you are logged in. Please read and understand what the code is doing before you run it!

You are responsible for the code you run on your own computer. By downloading and executing this script you take responsibility for anything it may do, so please read and understand the code *before* installing it.

# Installation:

1. [**Read and understand exactly what this script is doing.**](cryptohopper-dashboard-watchlist.user.js)
2. Install a userscript extension in your browser like [TamperMonkey](https://www.tampermonkey.net/).
3. After reading the script and understanding what it does, click the "Raw" button and your browser extension should ask you to install it.
4. Navigate to your Cryptohopper dashboard.
5. 🤖💰🚀🌖
6. ...
7.  You can turn on auto-updates to the script or check back here for new versions.

# Contribution

New ideas are always welcome! Please open a github ticket with your idea and maybe we can make it a reality! Contributions and pull requests are always welcome!

---

> This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Cryptohopper.com, or any of its subsidiaries or its affiliates.

> The Cryptohopper name as well as related marks, emblems and images are registered trademarks of Cryptohopper.com.

