# User Scripts to Improve your Cryptohopper Experience

This is a small collection of userscripts that run on [cryptohopper.com](https://www.cryptohopper.com/?atid=16750) to enhance your experience. Each userscript focuses on one tweak or feature and can be run independent of the others. Run them all or just a few!

**What Is Cryptohopper?**

Cryptohopper is an algorithmic trading platform that interfaces with your crypto exchange to trade cryptocurrency on your behalf using market trends, signals, and strategies. It watches the market 24/7 and tries to determine the best time to enter a position and then sell at a predetermined profit target.

[Sign Up for Cryptohopper](https://www.cryptohopper.com/?atid=16750) (afiliate link)

## ⚠️ Security implications: ⚠️

> These scripts manipulate elements on a financial site while you are logged in. Please read and understand what the code is doing before you run it!

You are responsible for the code you run on your own computer. By downloading and executing this script you take responsibility for anything it may do, so please read and understand the code *before* installing it.

## coin-watchlist.user.js

* Allows you to track a coin by icon/color across all your hoppers. Highlight the losers or mark positions that are heavily dollar cost averaged to more easily visually identify them in your dashboard or mark coins that are part of a custom config pool.
* Clear individual coin watches by cycling through the list in the Open Positions table.
* Clear all watchlist colors by clicking the `X` at the top of the new watchlist column.
* Adds row colors to the Last 5 Sells table and the trade history page.
* Looks great in light and dark mode!

|||
:-:|:-:
![](images/watchlist-light.png)  |  ![](images/watchlist-dark.png)


## absolute-value.user.js

* Adds an absolute value next to the percentage change on your open positions table.

|||
:-:|:-:
![](images/absolute-value-light.png)  |  ![](images/absolute-value-dark.png)

> Note: Some users are served the chart on `chart/chart_tradingview.php` and this script will not work if your charts are loaded from there. It will only work on the `chart/chart.php` url.

## chart-mods.user.js

* Adds your average price and last buy indicator to the Tradingview graph.

|||
:-:|:-:
![](images/chart-mods-light.png)  |  ![](images/chart-mods-dark.png)

> Note: Some users are served the chart on `chart/chart_tradingview.php` and this script will not work if your charts are loaded from there. It will only work on the `chart/chart.php` url.

## position-targets.user.js

* Puts a target icon next to each currency symbol when it is on the target buy/sell list for easier tracking of what the bot is recommending to buy or sell.

|||
:-:|:-:
![](images/targets-light.png)  |  ![](images/targets-dark.png)

## remove-hoppie.user.js

* Permanently hide hoppie's hand from poking out of the side of the screen.

## stay-level-headed.user.js

* Removes those pesky emotions and hides the panic button from the dashboard so you can't click it in a moment of weakness.

## multi-select.user.js

* Adds shift+click functionality for position checkboxes to allow selecting all positions of the same coin/token at once.

---

# Installation:

1. Select a the user script you want from this repository.
1. Read through the script and familiarize yourself with the code. Make sure you understand what it does before you install it!
1. Click the "Raw" button and your browser extension should ask you to install it.
1. Navigate to your Cryptohopper dashboard.
1. 🤖💰🚀🌖
1. ...
1. (optional) You can turn on auto-updates to the script or check back here for new versions.

### Quick install links:

> if you already have TamperMonkey installed and know what you're dong.

* [`coin-watchlist.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/coin-watchlist.user.js)
* [`absolute-value.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/absolute-value.user.js)
* [`chart-mods.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/chart-mods.user.js)
* [`position-targets.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/position-targets.user.js)
* [`remove-hoppie.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/remove-hoppie.user.js)
* [`stay-level-headed.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/stay-level-headed.user.js)
* [`multi-select.user.js`](https://github.com/markrickert/cryptohopper-dashboard-watchlist/raw/main/multi-select.user.js)

# Donate

If you enjoy using these scripts and would like to donate you can tip me with the Brave Browser in BAT or send to any of these addresses:

> BAT: 0x23d89970B883DEA62e74AeFdf5B0d739e91A0292

> BTC: 3DK79sPwBoguNd1b3Et2c3WdWzxfjwxBpj

> ETH: 0xbb475E8B86c945c30EED650858949b475BE5f970

> ALGO: TQJC62XSTKUU4BVFUKMREOVB4EZYYAQQBSKVTBBPQTQQJXBXGROTMFAZ3Q

> ADA: addr1vxt8feadqlal6tx2udemvwm2pgm95ne3n68zlkx5v2uucdc4atcz7

# Other great Cryptohopper userscripts:

* [coffeeneer/cryptohopper_scripts](https://github.com/coffeeneer/cryptohopper_scripts)

# Contributing

New ideas are always welcome! Please open a github ticket with your idea and maybe we can make it a reality! Contributions and pull requests are always welcome!

---

> This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Cryptohopper.com, or any of its subsidiaries or its affiliates.

> The Cryptohopper name as well as related marks, emblems and images are registered trademarks of Cryptohopper.com.

