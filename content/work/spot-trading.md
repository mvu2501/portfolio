---
title: Designing Spot Trading for a Digital-Asset Wealth App
role: Sole Product Designer
year: 2026
platform: Mobile
tags: [Fintech]
description: I designed the Spot trading feature for a crypto trading platform, with five order types on one small phone screen.
order: 1
cover: /images/work/spot-trading-cover.webp
coverAlt: Spot trading order ticket on a phone, showing a BTC/USDT limit order with price, amount and Buy button
---

## Overview

This project is the Spot trading feature of a crypto trading platform. I was the only designer, and I designed the whole experience on mobile: placing an order, following it while it runs, and checking the result in the order history. The feature covers five order types: Market, Limit, Stop-limit, Stop-market and TWAP.

![Spot trading order ticket on a phone, showing a BTC/USDT limit order with price, amount and Buy button](/images/work/spot-trading-cover.webp)

## Problem

Clients need more than a simple buy button. They need five order types, and each one has different inputs. All of it has to fit on one phone screen, and most clients are not professional traders. The challenge was to give clients control over price and timing, without making the ticket hard to use.

## Research

I started with the people who place trades for clients every day: the relationship managers (RMs) and the trading team.

- **Interviews:** I talked with RMs and the trading team about how clients trade and what questions they ask.
- **Competitor review:** I looked at Amber and Independent Reserve. I checked how they handle the ticket, order status and history on mobile.
- **Workshops:** I ran sessions with the PM, RMs, the trading team and engineers. We ended with a clickable prototype of the ticket.

Every order type follows the same steps: choose Buy or Sell, choose a type, enter an amount, and confirm.

I tested version 1 with the PM, RMs, the trading team and engineers. Their feedback changed three things:

1. **Amount input.** RMs said: “I want to know how much USDT to spend, not how many coins to buy.” I added a switch so users can type the amount in coin or USDT.
2. **Limit price.** The trading team said: “I want to tap a quick % from the current price, not do the math or type a guess.” I added a group of % buttons, and tapping again adds up the %.
3. **Price can move.** The trading team said: “The price can move before my order fills. I need a limit on the worst price I’ll get.” [TO CONFIRM: quote and who said it] I added a Max price for buy and a Min price for sell. If the limit is far from the market price, the screen warns that the order could fill at a much worse price, and the user can still place it.

We did not test with real clients. RMs and the trading team were the closest we had.

## Design Decisions

### 1. Order types as tabs, not a dropdown

- **Options considered:** one dropdown with every order type, or separate tabs.
- **Why tabs:** users see the main options and switch in one tap. Each type has its own form, so the screen shows only the fields that matter.
- **Pushback:** engineers wanted all types in a dropdown, with a “Coming soon” badge on types not available yet. I showed them that separate tabs let them build each type later.
- **Trade-off:** tabs take more width than a dropdown, so only a few types fit. The rest go under one Stop order tab. If we support more advanced order types later, we may need to rename it.

### 2. Stop orders get their own tab

- **Options considered:** keep Stop-limit and Stop-market inside the Limit menu, or give them their own tab.
- **Why a separate tab:** they were planned for a later release. In their own tab, users can find them easily and engineers can build them separately.
- **Trade-off:** one more tab on a small screen, and stop orders still need one extra tap to choose.

### 3. Full ticket on the Trade screen

- **Options considered:** a fixed Buy and Sell bar that opens a bottom sheet, or the full ticket on the Trade screen. [TO CONFIRM: did the team consider the bottom sheet at that time?]
- **Why the full ticket:** the chart is simple and has no indicators, so it is not the main focus. That leaves room for the ticket. A bottom sheet would add a step and cover the price, and clients need to see the price when they set a limit or stop order.
- **Trade-off:** a longer page that can feel crowded for new users. Market is the default, so a new user sees one amount field and one button.

## Outcome

### Product

I designed the full Spot trading feature: placing orders, open orders with pause, resume and cancel, and order history. I handed it off to engineering, and the first release shipped with Market and Limit. I am now adapting the layout for desktop. [TO CONFIRM: any numbers after launch, such as orders placed, error rate or use of each order type]

### Experience

The ticket stays short for each order type. The header and bottom navigation stay fixed, and the ticket scrolls inside the screen. I designed the edge cases that cause mistakes:

- **Price far from market:** warns that the order could fill at a much worse price, but still lets you place it.
- **Sub-orders too small:** blocks the TWAP and says how to fix it: a shorter time or a larger quantity.
- **Trigger on the wrong side:** blocks a buy trigger below the market and points to a Limit order instead.
- **Expiry too soon:** blocks an expiry in the past and shows the allowed range.

### System

The same tab and ticket structure works for all five order types, so the layout can grow into the desktop version. [TO CONFIRM: which components or patterns were added to the design system, if any]

### Collaboration

I worked with the PM, RMs, the trading team and engineers in workshops, and I tested version 1 with them. When engineers wanted a dropdown, I proposed tabs and explained that they can build each order type later.

## Reflections

The hard part was not adding five order types. It was keeping them simple enough for one phone screen. That is why the same layout can now grow into the desktop version.

If I did it again, I would test the values with real clients earlier. We still have not agreed on the final % values for the limit price buttons. Two things made it hard:

- **Different clients:** the trading team is used to large orders and wants bigger steps. RMs and clients usually prefer smaller, safer steps.
- **Different pairs:** BTC and smaller coins move differently, so one set of numbers cannot fit all of them.
