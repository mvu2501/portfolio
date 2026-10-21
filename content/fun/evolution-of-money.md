---
# Dự án nhỏ: trang chi tiết nằm ở /fun-projects/evolution-of-money (src/pages/fun-projects/[slug].astro).
# "demo" là đường dẫn file demo tĩnh trong public/ (giữ nguyên #embed ở cuối).
title: Evolution of Money
role: Designer
scope: Side project
tags: [WebGL, three.js, Motion, Prototype, Built with Claude]
description: 36,000 particles morph from barter to Bitcoin, driven by your swipe.
order: 1
demo: /fun/evolution-of-money/index.html#embed
cover: /images/fun/evolution-of-money-cover.webp
coverAlt: The Evolution of Money demo on a phone, with a cloud of golden particles
---

## About

A single-page prototype running entirely in the browser. Each form of money (barter goods, cowrie shell, Lydian coin, Jiaozi note, payment card, Bitcoin) is generated in code as a cloud of 36,000 points, with no images or 3D models. A custom shader moves every particle from one shape to the next, and the morph is tied directly to the user's drag. I directed the concept, motion and interaction design, and built it with Claude as my coding partner.

## Tech stack

- Rendering: three.js, WebGL, custom GLSL vertex and fragment shaders
- Shapes: procedurally generated point clouds, 36,000 particles per shape
- Interaction: pointer and touch drag, trackpad swipe, keyboard, auto-advance timer
- Build: plain HTML, CSS and JavaScript in one file, no framework
- Hosting: static page, embedded via iframe
- AI: prototyped with Claude (Anthropic)

## Credit

Concept, motion and interaction design by Vu. Built with Claude (Anthropic).
