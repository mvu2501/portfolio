---
title: Designing a Mobile Trade Flow for an On-Chain Trading Terminal
role: Product Designer, owned mobile
year: 2025
platform: Mobile
tags: [Fintech, Crypto, Trading UX, Mobile, Design System]
description: I designed the mobile trade flow for an on-chain trading terminal, so traders can go from a new token to a filled order in a few taps.
order: 2
cover: /images/work/onchain-trading-mobile-cover.webp
coverAlt: Token details screen on a phone, showing the chart, a position summary and the trade panel with preset amount buttons
---

<!-- NDA NOTE: the product name, logo, brand color and chain or protocol names must not appear anywhere in this page, the image file names, the alt text or the screenshots. Crop or blur logos and app names in every image before adding it. -->

## Overview

This is the mobile app of an on-chain trading terminal for new tokens. I was the product designer who owned mobile. Desktop shipped first, and mobile followed close behind on the same design system. I worked with another designer, a PM and two engineers over two months, and the app was released in 2025.

This case study focuses on the trade flow: getting from a token to a filled order in as few taps as possible.

## Problem

A new token can launch and open for trading within minutes. Traders need to check whether a token is safe and buy before the move, often away from a desk.

The desktop terminal shows the chart, the trade panel, live trades and settings at once. A phone shows one of those at a time. The mobile flow had to keep the speed of buying and selling, without hiding what a trader needs to see before pressing Buy or Sell.

## Research

Before designing, we reviewed two leading trading terminals that our users already used. Each is strong at one part of the job, and neither felt built for a phone first.

- **Terminal A** is known for smart-money and wallet tracking, trader labels and token security checks. We took trader-type filters for live trades, a wallet tracker with profiles, and a safety check behind a single badge.
- **Terminal B** is known for speed: one-click buys from token lists, new tokens grouped by stage, sniping at pool open, and take-profit and stop-loss rules. We took Instant mode, a Quick Buy button on every row, a launch feed by stage, and one shared take-profit and stop-loss structure.

<!-- IMAGE (optional): onchain-trading-mobile-desktop-vs-mobile.webp, Token Details on desktop next to mobile. -->

[TO CONFIRM: this was a competitor review only. If the team also had feedback from traders or the trading team, add it here. Do not call it user research if it was not.]

## Design Decisions

The trade flow has five steps, and every entry point leads to the same trade panel:

1. **Find a token:** Quick Buy on a list row, Buy on a launch card, Quick Buy in the wallet tracker, or Token Details.
2. **Judge the token:** stats, chart, a 4/4 safety badge, live trades and holders.
3. **Pick a mode:** Instant, Market or Limit, or Advanced rules.
4. **Review and send:** the active preset (slippage, fees, MEV protection) and the estimated tokens.
5. **See the result:** filled with PnL, failed with a fix, or a rule now active in Orders.

<!-- IMAGE: onchain-trading-mobile-trade-flow.webp, the five-step flow diagram (redraw without product names). -->

### 1. One design system, two layouts

- **Options considered:** design mobile as a smaller copy of desktop, or keep the visual language and change how each component behaves on touch.
- **Why one system:** both apps use the same tokens and components, so they stay consistent without slowing either team. On mobile the trade panel is docked under the chart, settings and strategies open as bottom sheets, wide token tables become three key columns plus Quick Buy, and separate list pages become tabs inside one screen.
- **Trade-off:** some desktop patterns do not carry over, so mobile needed its own layouts for the trade panel and token lists.

### 2. Amounts as buttons

- **Desktop:** type an amount, then press Buy.
- **Mobile:** four preset amount buttons. One tap sends the order.
- **Why:** no keyboard covers the chart, and traders use the same few sizes every trade.
- **Trade-off:** fixed sizes are less flexible. Market mode lets a trader type any amount, with an estimate of the tokens they will get.

<!-- IMAGE: onchain-trading-mobile-instant-buy.webp -->

### 3. One panel, four modes

- **Desktop:** order types as tabs.
- **Mobile:** one mode button opens a short sheet: Instant, Market, Limit and Advanced.
- **Why:** four tabs do not fit next to Buy and Sell on a phone, and most trades use one mode. Switching mode changes only the panel, so the chart and position stay put.
- **Trade-off:** changing mode takes one extra tap.

<!-- IMAGE: onchain-trading-mobile-mode-sheet.webp -->

### 4. Presets, not fields

- **Desktop:** fee and slippage fields inside the panel.
- **Mobile:** three presets (P1 to P3) that are always shown in a bar. Slippage, fees and MEV protection are saved per preset, for buy and sell.
- **Why:** set once, switch in one tap, and always see what applies. This is what makes a one-tap buy safe.
- **Trade-off:** fewer values are visible at once. The full settings open in a bottom sheet from the preset chip.

<!-- IMAGE: onchain-trading-mobile-presets.webp, the preset chip on the list next to the Trading Settings sheet. -->

### 5. Token Details follows the order a trader decides in

The screen reads from top to bottom: header with the safety badge, key stats, the chart, the current position, then the trade panel and preset bar. Under it, trader-type filters for live trades, holders tagged by wallet type and size, and the safety check (mint, freeze, top 10 holders, liquidity burnt) help the trader judge the token before trading.

<!-- IMAGE: onchain-trading-mobile-token-details.webp, annotated with numbered pins. -->

### 6. Advanced rules share one structure

Auto Buy and Sell, Snipe on pool open, and Buy or Sell when the creator sells all use the same sheet structure: amount, take profit, stop loss. Each rule follows the Buy and Sell switch. A trader who has set one rule can set the others without learning a new layout.

<!-- IMAGE: onchain-trading-mobile-advanced.webp -->

### 7. Every order reports back in the same place

Orders report their state in one toast at the top: sending, filled, a warning before it fails (for example insufficient funds, with a 10 second countdown), and the failure with its reason. The chart and panel stay in view the whole time. Selling follows the same pattern: choose a share of the holding, confirm, and the realized PnL appears on the position bar.

<!-- IMAGE: onchain-trading-mobile-order-states.webp, four toast states in a row. -->

### Supporting artifacts

<!-- Optional, keep collapsed or at the end: sitemap of the five tabs (Explore, Launch feed, Tracker, Rewards, Account), and the color tokens and mobile component sheets. Remove the brand color and any logo before publishing. -->

## Outcome

### Result

The mobile app shipped in 2025, just behind desktop, after two months of focused work. Soon after, the crypto market cooled and the product was wound down, so there is no long-term usage data to share. What remains is a fast, consistent trade flow built on one shared system.

### Lessons

- **Speed comes from fewer decisions.** Presets, one-tap amounts and Quick Buy did more than fitting more on screen.
- **One system, two layouts.** Designing desktop and mobile together kept them consistent without slowing either team.

[TO CONFIRM: any early numbers from the first weeks after release, such as downloads or trades placed. If there are none, keep this section as it is.]

## Credit

Thanks to Dux for working alongside me on this project. [TO CONFIRM: Dux is happy to be named.]
