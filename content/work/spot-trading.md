---
title: Designing Spot Trading for a Digital-Asset Wealth App
role: Sole Product Designer
year: 2026
platform: Mobile
tags: []
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

After a kickoff with the PMs and the Head of Wealth on scope, I started with the people who place trades for clients every day: the relationship managers (RMs) and the trading team.

<!-- 3 phần nghiên cứu trên một hàng. Sửa chữ trong <figcaption>, giữ nguyên các thẻ HTML. Không chèn dòng trống bên trong khối này. -->
<div class="triptych wide">
  <figure>
    <img src="/images/work/spot-trading-research-interviews.webp" alt="Illustration of a designer talking with relationship managers and the trading team around a table" loading="lazy" decoding="async">
    <figcaption><strong>Interviews</strong>I talked with RMs and the trading team about how clients trade and what questions they ask.</figcaption>
  </figure>
  <figure>
    <img src="/images/work/spot-trading-research-competitors.webp" alt="Illustration of a designer comparing two competitor trading apps side by side" loading="lazy" decoding="async">
    <figcaption><strong>Competitor review</strong>I looked at Amber and Independent Reserve. I checked how they handle the ticket, order status and history on mobile.</figcaption>
  </figure>
  <figure>
    <img src="/images/work/spot-trading-research-workshops.webp" alt="Illustration of a workshop where a designer presents a trading app prototype to a team" loading="lazy" decoding="async">
    <figcaption><strong>Workshops</strong>I ran sessions with the PM, RMs, the trading team and engineers. We ended with a clickable prototype of the ticket.</figcaption>
  </figure>
</div>

Every order type follows the same steps: choose Buy or Sell, choose a type, enter an amount, and confirm.

---

### Information architecture

<!-- demo:information-architecture -->

---

I tested version 1 with the PM, RMs, the trading team and engineers. Their feedback changed three things:

<!-- demo:amount-input -->

---

<!-- demo:limit-price -->

---

<!-- demo:price-can-move -->

<div class="note"><p>We did not test with real clients. RMs and the trading team were the closest we had.</p></div>

## Design Decisions

### Trade-offs

<h4 class="sr-only">1. Order types as tabs, not a dropdown</h4>
<figure class="tradeoff wide">
<img src="/images/work/spot-trading-tradeoff-1.webp" alt="Decision 1, Order types as tabs, not a dropdown. Two phone screens compare option A, one dropdown (option considered), with option B, separate tabs (chosen)." width="1656" height="1088" loading="lazy" decoding="async">
<details>
<summary>Read the text in this image</summary>
<p><strong>Options considered:</strong> One dropdown with every order type, or separate tabs.</p>
<p><strong>Why tabs:</strong> Users see the main options and switch in one tap. Each type has its own form, so the screen shows only the fields that matter.</p>
<p><strong>Pushback:</strong> Engineers wanted all types in a dropdown, with a “Coming soon” badge on types not available yet. I showed them that separate tabs let them build each type later.</p>
<p><strong>Trade-off:</strong> Tabs take more width than a dropdown, so only a few types fit. The rest go under one Stop order tab. If we support more advanced order types later, we may need to rename it.</p>
<p><strong>A · One dropdown (option considered):</strong> a Market dropdown is open and lists Market, Limit, TWAP, Stop-limit (Coming soon) and Stop-market (Coming soon).</p>
<p><strong>B · Separate tabs (chosen):</strong> the tabs Market, Limit, TWAP and Stop sit above the amount field.</p>
</details>
</figure>

<h4 class="sr-only">2. Stop orders get their own tab</h4>
<figure class="tradeoff wide">
<img src="/images/work/spot-trading-tradeoff-2.webp" alt="Decision 2, Stop orders get their own tab. Two phone screens compare option A, Stop inside the Limit menu (option considered), with option B, an own Stop tab with an Order type sheet (chosen)." width="1656" height="1088" loading="lazy" decoding="async">
<details>
<summary>Read the text in this image</summary>
<p><strong>Options considered:</strong> Keep Stop-limit and Stop-market inside the Limit menu, or give them their own tab.</p>
<p><strong>Why a separate tab:</strong> They were planned for a later release. In their own tab, users can find them easily and engineers can build them separately.</p>
<p><strong>Trade-off:</strong> One more tab on a small screen, and stop orders still need one extra tap to choose.</p>
<p><strong>A · Stop inside the Limit menu (option considered):</strong> the Limit menu is open and lists Limit, Stop-limit and Stop-market.</p>
<p><strong>B · Own Stop tab (chosen):</strong> an Order type sheet offers Stop-limit (“Places a limit order at your price once the trigger price is reached. You control the price, but it may not fill.”) and Stop-market (“Places a market order once the trigger price is reached. Fills fast, but the price may slip.”).</p>
</details>
</figure>

<h4 class="sr-only">3. Full ticket on the Trade screen</h4>
<figure class="tradeoff wide">
<img src="/images/work/spot-trading-tradeoff-3.webp" alt="Decision 3, Full ticket on the Trade screen. Two phone screens compare option A, a Buy/Sell bar with a bottom sheet (option considered), with option B, the full ticket on the screen (chosen)." width="1656" height="1088" loading="lazy" decoding="async">
<details>
<summary>Read the text in this image</summary>
<p><strong>Options considered:</strong> A fixed Buy and Sell bar that opens a bottom sheet with the order form, or the full ticket on the Trade screen.</p>
<p><strong>Why the full ticket:</strong> The chart is simple and has no indicators, so it is not the main focus. That leaves room for the ticket. A bottom sheet would add a step and cover the price, and clients need to see the price when they set a limit or stop order.</p>
<p><strong>Trade-off:</strong> A longer page that can feel crowded for new users. Market is the default, so a new user sees one amount field and one button.</p>
<p><strong>A · Buy/Sell bar + bottom sheet (option considered):</strong> the Limit order form opens in a bottom sheet over the dimmed chart.</p>
<p><strong>B · Full ticket on the screen (chosen):</strong> the Market form sits below the chart on the Trade screen.</p>
</details>
</figure>

<!-- TO CONFIRM (decision 3): did the team consider the bottom sheet at that time? -->

---

### Solution

<!-- demo:order-types -->

<!-- demo:open-orders -->

## Outcome

I designed the full Spot trading feature: placing orders, open orders with pause, resume and cancel, and order history. I handed it off to engineering, and the first release shipped with Market and Limit. Then adapting the layout for desktop.

## Reflections

The hard part was not adding five order types. It was keeping them simple enough for one phone screen. That is why the same layout can now grow into the desktop version.

If I did it again, I would test the values with real clients earlier. We still have not agreed on the final % values for the limit price buttons. Two things made it hard:

- **Different clients:** the trading team is used to large orders and wants bigger steps. RMs and clients usually prefer smaller, safer steps.
- **Different pairs:** BTC and smaller coins move differently, so one set of numbers cannot fit all of them.
