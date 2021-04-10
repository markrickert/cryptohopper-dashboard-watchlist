# cryptohopper-dashboard-watchlist

This is a small userscript that runs in your browser extension adding the ability to "watch" certain coins in your dashboard easier by assigning an icon and changing the background color. This allows you to track each coin over multiple hoppers with ease.

You can remove all watchlist statuses by clicking the `X` at the top of the new column on the left of the dashboard.

# ⚠️ Security implications: ⚠️

This is a script that manipulates elements on a site while you are logged in. Please read and unserstand what the code is doing before you run it!

# Example:

![Example dashboard with watchlist script.](cryptohopper-example.png)

# Installation:

1. Read and understand that this script is doing.
2. Install a userscript extension in your browser like [TamperMonkey](https://www.tampermonkey.net/).
3. Click on the Tampermonkey browser extension and select `Create a new script...`
4. Copy the script in this repository and paste it into the new user script.
5. Save the new user script.
6. Navigate to your Cryptohopper dashboard.

# Editing the script's behavior:

All of the icons and colors can be customized in the script. Feel free to modify colors to your liking and add/remove watchlist statuses in the `WATCHLIST_STATUSES` var.

# Roadmap:

1. Clean up the code a bit and comment it better.
2. Add trend indicators to positions.