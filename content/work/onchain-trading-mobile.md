---
title: Designing a Mobile Trade Flow for an On-Chain Trading Terminal
role: Product Designer, owned mobile
year: 2025
platform: Mobile
tags: [Web3, On-chain trading, Crypto, Design System]
description: I designed the mobile trade flow for an on-chain trading terminal, so traders can go from a new token to a filled order in a few taps.
order: 2
cover: /images/work/onchain-trading-mobile-cover.webp
coverAlt: Token details screen on a phone, showing the chart, a position summary and the trade panel with preset amount buttons
---

<!-- NDA NOTE: the product name, logo, brand color and chain or protocol names must not appear anywhere in this page, the image file names, the alt text or the screenshots. Crop or blur logos and app names in every image before adding it. -->
<!-- LAYOUT NOTE: the HTML blocks below (.flow, .kd, .split, .row3, .row4, .shot, .anno, .pair-arrow, .sitemap) are styled by src/styles/case-blocks.css. Keep each block free of blank lines and indentation, or Markdown will break it. -->

## Overview

This is the mobile app of an on-chain trading terminal for new tokens. I was the product designer who owned mobile. Desktop shipped first, and mobile followed close behind on the same design system. I worked with another designer, a PM and two engineers over two months, and the app was released in 2025.

This case study focuses on the trade flow: getting from a token to a filled order in as few taps as possible.

## Problem

A new token can launch and open for trading within minutes. Traders need to check whether a token is safe and buy before the move, often away from a desk.

The desktop terminal shows the chart, the trade panel, live trades and settings at once. A phone shows one of those at a time. The mobile flow had to keep the speed of buying and selling, without hiding what a trader needs to see before pressing Buy or Sell.

## Research

Before designing, we reviewed two leading trading terminals that our users already used. Each is strong at one part of the job, and neither felt built for a phone first.

| Product | Known for | What we took |
| --- | --- | --- |
| Terminal A | Smart-money and wallet tracking, trader labels, token security checks | Trader-type filters for live trades, a wallet tracker with profiles, a safety check behind a single badge |
| Terminal B | Speed: one-click buys from token lists, new tokens grouped by stage, sniping at pool open, take-profit and stop-loss rules | Instant mode, a Quick Buy button on every row, a launch feed by stage, one shared take-profit and stop-loss structure |

[TO CONFIRM: this was a competitor review only. If the team also had feedback from traders or the trading team, add it here. Do not call it user research if it was not.]

## Design Decisions

The trade flow has five steps, and every entry point leads to the same trade panel.

<div class="flow">
<div class="step"><span class="n">1 · Entry</span><b>Find a token</b><ul><li>Quick Buy on a list row</li><li>Buy on a launch card</li><li>Quick Buy in the wallet tracker</li><li>Token Details</li></ul></div>
<div class="step"><span class="n">2 · Check</span><b>Judge the token</b><ul><li>Stats and chart</li><li>4/4 safety badge</li><li>Live trades, holders</li></ul></div>
<div class="step key"><span class="n">3 · Order</span><b>Pick a mode</b><ul><li>Instant</li><li>Market or Limit</li><li>Advanced rules</li></ul></div>
<div class="step"><span class="n">4 · Send</span><b>Review and send</b><ul><li>Active preset: slippage, fees, MEV protection</li><li>Estimated tokens</li></ul></div>
<div class="step"><span class="n">5 · Result</span><b>See what happened</b><ul><li>Filled, with PnL</li><li>Failed, with a fix</li><li>Rule active in Orders</li></ul></div>
</div>

### 1. One design system, two layouts

Both apps use the same tokens and components, so they stay consistent without slowing either team. On mobile I kept the visual language and changed how each component behaves on touch.

| Desktop | Mobile |
| --- | --- |
| Trade panel beside the chart | Trade panel docked under the chart, mode picked from a dropdown |
| Settings and strategy modals | Bottom sheets, reachable with one thumb |
| Wide token tables | Three key columns plus a Quick Buy button |
| Separate pages for lists | Tabs inside one screen |

**Trade-off:** some desktop patterns do not carry over, so mobile needed its own layouts for the trade panel and token lists.

<!-- IMAGE (optional): onchain-trading-mobile-desktop-vs-mobile.webp, Token Details on desktop next to mobile. -->

### 2. Three decisions that shaped the trade panel

<div class="kd">
<article class="kd-card">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-token-details.webp" alt="Token details screen with four preset amount buttons in the trade panel" loading="lazy"></div></figure>
<h5>Amounts as buttons</h5>
<p class="kd-row"><span>Desktop</span>Type an amount, then press Buy.</p>
<p class="kd-row"><span>Mobile</span>Four preset amount buttons. One tap sends the order.</p>
<p class="kd-why">No keyboard covers the chart, and traders use the same few sizes every trade.</p>
<p class="kd-row"><span>Trade-off</span>Fixed sizes are less flexible. Market mode lets a trader type any amount.</p>
</article>
<article class="kd-card">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-mode-sheet.webp" alt="Bottom sheet listing the four trade modes: Instant, Market, Limit and Advanced" loading="lazy"></div></figure>
<h5>One panel, four modes</h5>
<p class="kd-row"><span>Desktop</span>Order types as tabs.</p>
<p class="kd-row"><span>Mobile</span>One mode button opens a short sheet.</p>
<p class="kd-why">Four tabs do not fit next to Buy and Sell on a phone, and most trades use one mode. Switching mode changes only the panel, so the chart and position stay put.</p>
<p class="kd-row"><span>Trade-off</span>Changing mode takes one extra tap.</p>
</article>
<article class="kd-card">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-presets.webp" alt="Trading settings sheet with three presets for slippage, fees and MEV protection" loading="lazy"></div></figure>
<h5>Presets, not fields</h5>
<p class="kd-row"><span>Desktop</span>Fee and slippage fields inside the panel.</p>
<p class="kd-row"><span>Mobile</span>Three presets (P1 to P3), always shown in a bar.</p>
<p class="kd-why">Set once, switch in one tap, and always see what applies. This is what makes a one-tap buy safe.</p>
<p class="kd-row"><span>Trade-off</span>Fewer values are visible at once. Full settings open in a sheet.</p>
</article>
</div>

### 3. Buy straight from the list

A trader can sign up and buy from the token list in a few taps. Every row has a Quick Buy button that uses the amount and preset chosen in the bar above the list.

<div class="split">
<div class="chain">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-signup.webp" alt="Sign up sheet with four ways to continue" loading="lazy"></div><figcaption><b>Sign up</b>One sheet, four ways in</figcaption></figure>
<span class="arrow" aria-hidden="true">→</span>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-explore.webp" alt="Token list with a Quick Buy bar and a lightning button on each row" loading="lazy"><span class="pin" style="--x:42;--y:17.5">1</span><span class="pin" style="--x:35;--y:22.7">2</span><span class="pin" style="--x:72;--y:27.9">3</span><span class="pin" style="--x:30;--y:40.8">4</span><span class="pin" style="--x:93;--y:49.0">5</span></div><figcaption><b>Explore</b>Buy from the list</figcaption></figure>
</div>
<ol class="anno">
<li><span><b>Lists</b> · Trending, Surge, Watchlist</span></li>
<li><span><b>Time window</b> and filter</span></li>
<li><span><b>Wallet, Quick Buy amount</b> and preset P1 to P3</span></li>
<li><span><b>Token row</b> · age, market cap, liquidity</span></li>
<li><span><b>Lightning button</b> · one tap buys with the active preset</span></li>
</ol>
</div>

Tapping the preset chip opens the trading settings. Slippage, fees and MEV protection are saved per preset, for buy and sell, so a trader switches P1 to P3 in one tap.

<div class="pair-arrow">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-explore.webp" alt="Token list with the preset chip in the Quick Buy bar" loading="lazy"></div><figcaption><b>Explore</b>Preset chip P1 to P3</figcaption></figure>
<span class="arrow" aria-hidden="true">→</span>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-presets.webp" alt="Trading settings opened as a bottom sheet" loading="lazy"></div><figcaption><b>Trading settings</b>Opens as a bottom sheet</figcaption></figure>
</div>

### 4. Token Details follows the order a trader decides in

The screen reads from top to bottom: header with the safety badge, key stats, the chart, the current position, then the trade panel and preset bar.

<div class="split">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-token-details.webp" alt="Token details screen with numbered markers on each area" loading="lazy"><span class="pin" style="--x:22;--y:16.0">1</span><span class="pin" style="--x:40;--y:22.6">2</span><span class="pin" style="--x:50;--y:41.8">3</span><span class="pin" style="--x:50;--y:72.2">4</span><span class="pin" style="--x:62;--y:80.5">5</span><span class="pin" style="--x:15;--y:88.5">6</span></div></figure>
<ol class="anno">
<li><span><b>Header</b> · token, age, socials, 4/4 safety badge</span></li>
<li><span><b>Stats</b> · market cap, volume, liquidity, holders</span></li>
<li><span><b>Chart</b> · the same chart as desktop</span></li>
<li><span><b>Position</b> · bought, sold, holding, PnL</span></li>
<li><span><b>Trade panel</b> · wallet, mode, Buy and Sell, amounts</span></li>
<li><span><b>Preset bar</b> · slippage, fees, MEV protection</span></li>
</ol>
</div>

Under the chart, three tabs help the trader judge the token before trading: live trades with trader-type filters, holders tagged by wallet type and size, and the safety check (mint, freeze, top 10 holders, liquidity burnt).

<div class="row3">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-transactions.webp" alt="Live trades list with trader-type filters" loading="lazy"></div><figcaption><b>Live trades</b>Filter by smart money, creator, sniper</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-holders.webp" alt="Holders list tagged by wallet type and size" loading="lazy"></div><figcaption><b>Holders</b>Tagged by type and size</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-safety-check.webp" alt="Safety check sheet listing mint, freeze, top 10 holders and burnt liquidity" loading="lazy"></div><figcaption><b>Safety check</b>Mint, freeze, top 10, liquidity</figcaption></figure>
</div>

### 5. Three ways to trade, one panel

Ordered from fastest to most controlled. Switching mode changes only the panel; the chart and position stay put.

#### Instant

Preset amounts and one tap to buy. The wallet can be switched first, and a toast confirms the result.

<div class="row3">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-token-details.webp" alt="Instant mode with preset amount buttons" loading="lazy"></div><figcaption><b>Default is Instant</b>Preset amounts, one tap to buy</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-wallet-select.webp" alt="Wallet picker bottom sheet" loading="lazy"></div><figcaption><b>Select wallet</b>Switch before trading</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-toast-filled.webp" alt="Toast confirming tokens received, with the position updated" loading="lazy"></div><figcaption><b>Order filled</b>Toast confirms tokens received</figcaption></figure>
</div>

#### Market and Limit

For traders who want to set the size or the price. Both share the amount presets with Instant, and both can carry an exit plan.

<div class="row3">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-market.webp" alt="Market mode with a typed amount and an estimate of tokens received" loading="lazy"></div><figcaption><b>Market</b>Pick a preset or type any amount. The estimate shows the tokens you get before you tap Buy.</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-limit.webp" alt="Limit mode with a target market cap and a slider" loading="lazy"></div><figcaption><b>Limit</b>Set a target market cap, or drag a slider from −100% to +100% of the current one.</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-strategy.webp" alt="Advanced strategy sheet with take-profit and stop-loss steps" loading="lazy"></div><figcaption><b>Exit plan</b>Add take-profit and stop-loss steps before sending.</figcaption></figure>
</div>

#### Advanced

Rules that run on their own: Auto Buy and Sell, Snipe on pool open, and Buy or Sell when the creator sells. Each rule follows the Buy and Sell switch, and every sheet shares one structure: amount, take profit, stop loss. A trader who has set one rule can set the others without learning a new layout.

<div class="row4">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-advanced.webp" alt="List of the three advanced rules, each with a Set button" loading="lazy"></div><figcaption><b>Rules</b>Three rules, one Set button each</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-auto-buy.webp" alt="Auto Buy sheet with amount, take profit and stop loss" loading="lazy"></div><figcaption><b>Auto Buy and Sell</b>Amount, TP and SL</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-snipe.webp" alt="Snipe sheet that buys when the pool opens" loading="lazy"></div><figcaption><b>Snipe</b>Buys when the pool opens</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-dev-sell.webp" alt="Sheet that reacts when the creator sells part of their holdings" loading="lazy"></div><figcaption><b>On creator sell</b>Reacts when the creator sells</figcaption></figure>
</div>

### 6. From position to profit

Positions show value and PnL per token, each with a Sell button. The sell sheet works in shares of the holding, and the result lands back in the same list.

<div class="row3">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-sell-1.webp" alt="Positions list with an open position and a Sell button" loading="lazy"></div><figcaption><b>1 · Review positions</b>See value and PnL of every token held, then tap Sell.</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-sell-2.webp" alt="Sell sheet with a slider for the share of the holding" loading="lazy"></div><figcaption><b>2 · Choose how much</b>Drag or type a share of the holding. Fees come from the active preset.</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-sell-3.webp" alt="Toast confirming the sale and the realized PnL on the position bar" loading="lazy"></div><figcaption><b>3 · See the result</b>A toast confirms the sale, and the position bar shows the realized PnL.</figcaption></figure>
</div>

### 7. Every order reports back in the same place

Orders report their state in one toast at the top: sending, filled, a warning before it fails, and the failure with its reason. The chart and panel stay in view the whole time.

<div class="row4">
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-state-sending.webp" alt="Toast while the transaction is being submitted" loading="lazy"></div><figcaption><b>Sending</b>Spinner while the transaction is submitted</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-state-filled.webp" alt="Toast showing the order filled" loading="lazy"></div><figcaption><b>Filled</b>Tokens received; position updates</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-state-warning.webp" alt="Warning toast about insufficient funds with a countdown" loading="lazy"></div><figcaption><b>Might fail</b>Warns about insufficient funds, with a 10 second countdown</figcaption></figure>
<figure class="shot"><div class="frame"><img src="/images/work/onchain-trading-mobile-state-failed.webp" alt="Failed toast that explains the reason" loading="lazy"></div><figcaption><b>Failed</b>Says why: not enough funds for the buy amount</figcaption></figure>
</div>

### The rest of the app

The other modules reuse the components from the trade flow.

<div class="sitemap">
<div><b>Explore</b><ul><li>Lists and filter</li><li>Quick Buy bar</li><li class="key">Token Details<ul><li class="key">Trade: Instant, Market, Limit, Advanced</li><li>Live trades</li><li>Overview: positions, orders, holders</li><li>Safety check</li></ul></li></ul></div>
<div><b>Launch feed</b><ul><li>New creations</li><li>Final stretch</li><li>Graduated</li><li>Filter and display</li></ul></div>
<div><b>Wallet tracker</b><ul><li>Live trades</li><li>Wallet manager</li><li>Alerts</li><li>Customize feed</li></ul></div>
<div><b>Rewards</b><ul><li>Referrals</li><li>Rewards and claims</li><li>Quests</li><li>Leaderboard</li></ul></div>
<div><b>Account</b><ul><li>Portfolio</li><li>Wallets</li><li>Deposit and withdraw</li><li>Settings</li></ul></div>
</div>

## Outcome

### Result

The mobile app shipped in 2025, just behind desktop, after two months of focused work. Soon after, the crypto market cooled and the product was wound down, so there is no long-term usage data to share. What remains is a fast, consistent trade flow built on one shared system.

### Lessons

- **Speed comes from fewer decisions.** Presets, one-tap amounts and Quick Buy did more than fitting more on screen.
- **One system, two layouts.** Designing desktop and mobile together kept them consistent without slowing either team.

[TO CONFIRM: any early numbers from the first weeks after release, such as downloads or trades placed. If there are none, keep this section as it is.]

## Credit

Thanks to Dux for working alongside me on this project. [TO CONFIRM: Dux is happy to be named.]

