---
title: "Mecha Legion"
role: Solo designer, art direction and prototype
tags: [Game Design, Art Direction, AI Tools, Prototype]
description: An original sci-fi slot game, designed and prototyped by me from start to finish, using AI tools for production.
order: 1
group: game
cover: /images/work/mecha-legion/cover.webp
coverAlt: Mecha Legion logo over a neon city street, with the four mecha warriors Long, Lân, Quy and Phụng in front
facts:
  - label: Role
    value: Solo designer, art direction and prototype
  - label: Year
    value: "2026"
  - label: Output
    value: Playable prototype
  - label: Timeline
    value: 2 days
  - label: Format
    value: Desktop and Mobile
  - label: Tools
    value: Dola, ElevenLabs, Claude
# Ghi chú: category "Game visual design" trong file gốc không có chỗ hiển thị riêng nên chưa dùng.
# Khối .ml-* được định nghĩa trong src/styles/mecha-legion.css (nạp qua src/components/MechaPlay.astro).
# Trong các khối HTML bên dưới không được có dòng trống (Markdown sẽ cắt khối).
---

<div class="ml-hero wide"><img src="/images/work/mecha-legion/cover.webp" alt="Mecha Legion logo over a neon city street, with the four warrior portraits Long, Lân, Quy and Phụng" width="1948" height="1256" decoding="async"></div>

## 01 · Overview

This project is an art direction and prototype for a slot game studio. Mecha Legion is built around four human-mecha warriors from the Four Guardians: Dragon, Qilin, Tortoise and Phoenix.

**How AI was used.** I did the visual direction, prompting and editing, chose the results, cleaned every asset and built them into one consistent, playable game.

## 02 · Approach

### Art direction: four sacred beasts in steel

Mecha Legion puts East Asian myth in armoured sci-fi mecha: an ownable story, with a metallic, high-contrast look that suits a slot screen. Each warrior owns one colour, used on its weapon lightning and on its high-pay gem.

<div class="ml-warriors wide">
  <figure class="ml-warrior ml-red">
    <div class="ml-warrior__img"><img src="/images/work/mecha-legion/sym_char_long.webp" alt="Long Giáp, Dragon warrior" loading="lazy" decoding="async"></div>
    <figcaption><strong>Long Giáp</strong><span class="ml-beast">Dragon</span><dl><div><dt>Weapon</dt><dd>Energy fists</dd></div><div><dt>Light</dt><dd><i class="ml-dot ml-light-blue"></i>Blue</dd></div></dl></figcaption>
  </figure>
  <figure class="ml-warrior ml-purple">
    <div class="ml-warrior__img"><img src="/images/work/mecha-legion/sym_char_lan.webp" alt="Lân Pháo, Qilin warrior" loading="lazy" decoding="async"></div>
    <figcaption><strong>Lân Pháo</strong><span class="ml-beast">Qilin</span><dl><div><dt>Weapon</dt><dd>Heavy cannon</dd></div><div><dt>Light</dt><dd><i class="ml-dot ml-light-purple"></i>Purple</dd></div></dl></figcaption>
  </figure>
  <figure class="ml-warrior ml-green">
    <div class="ml-warrior__img"><img src="/images/work/mecha-legion/sym_char_quy.webp" alt="Quy Thuẫn, Tortoise warrior" loading="lazy" decoding="async"></div>
    <figcaption><strong>Quy Thuẫn</strong><span class="ml-beast">Tortoise</span><dl><div><dt>Weapon</dt><dd>Shell shield</dd></div><div><dt>Light</dt><dd><i class="ml-dot ml-light-green"></i>Green</dd></div></dl></figcaption>
  </figure>
  <figure class="ml-warrior ml-orange">
    <div class="ml-warrior__img"><img src="/images/work/mecha-legion/sym_char_phung.webp" alt="Phụng Kiếm, Phoenix warrior" loading="lazy" decoding="async"></div>
    <figcaption><strong>Phụng Kiếm</strong><span class="ml-beast">Phoenix</span><dl><div><dt>Weapon</dt><dd>Flame bow</dd></div><div><dt>Light</dt><dd><i class="ml-dot ml-light-red"></i>Red</dd></div></dl></figcaption>
  </figure>
</div>

### Symbols as tiers of attention

<div class="ml-tiers wide">
  <div class="ml-tier"><p class="ml-tier__label"><strong>Low pay</strong><span>Tech silhouettes, muted</span></p>
  <div class="ml-tiles ml-tiles--5">
    <figure class="ml-tile"><img src="/images/work/mecha-legion/sym_low_pin.webp" alt="Battery" loading="lazy" decoding="async"><figcaption>Battery</figcaption></figure>
    <figure class="ml-tile"><img src="/images/work/mecha-legion/sym_low_blaster.webp" alt="Laser gun" loading="lazy" decoding="async"><figcaption>Laser gun</figcaption></figure>
    <figure class="ml-tile"><img src="/images/work/mecha-legion/sym_low_mugiap.webp" alt="Helmet" loading="lazy" decoding="async"><figcaption>Helmet</figcaption></figure>
    <figure class="ml-tile"><img src="/images/work/mecha-legion/sym_low_tenlua.webp" alt="Missile" loading="lazy" decoding="async"><figcaption>Missile</figcaption></figure>
    <figure class="ml-tile"><img src="/images/work/mecha-legion/sym_low_bomb.webp" alt="Bomb" loading="lazy" decoding="async"><figcaption>Bomb</figcaption></figure>
  </div></div>
  <div class="ml-tier"><p class="ml-tier__label"><strong>High pay</strong><span>4 spirit stones in warrior colours</span></p>
  <div class="ml-tiles ml-tiles--4">
    <figure class="ml-tile ml-red"><img src="/images/work/mecha-legion/sym_ls_long.webp" alt="Long Hạch" loading="lazy" decoding="async"><figcaption>Long Hạch</figcaption></figure>
    <figure class="ml-tile ml-purple"><img src="/images/work/mecha-legion/sym_ls_lan.webp" alt="Lân Tinh" loading="lazy" decoding="async"><figcaption>Lân Tinh</figcaption></figure>
    <figure class="ml-tile ml-green"><img src="/images/work/mecha-legion/sym_ls_quy.webp" alt="Quy Ấn" loading="lazy" decoding="async"><figcaption>Quy Ấn</figcaption></figure>
    <figure class="ml-tile ml-orange"><img src="/images/work/mecha-legion/sym_ls_phung.webp" alt="Phụng Vũ" loading="lazy" decoding="async"><figcaption>Phụng Vũ</figcaption></figure>
  </div></div>
  <div class="ml-tier"><p class="ml-tier__label"><strong>Special</strong><span>Only gold, only electric blue</span></p>
  <div class="ml-tiles ml-tiles--4">
    <figure class="ml-tile"><img src="/images/work/mecha-legion/sym_wild.webp" alt="WILD" loading="lazy" decoding="async"><figcaption>WILD</figcaption></figure>
    <figure class="ml-tile"><img src="/images/work/mecha-legion/sym_scatter.webp" alt="SCATTER" loading="lazy" decoding="async"><figcaption>SCATTER</figcaption></figure>
  </div></div>
</div>

### Enemies

<div class="ml-enemies wide">
  <figure class="ml-enemy"><div class="ml-enemy__img"><img src="/images/work/mecha-legion/enemy_drone.webp" alt="Drone enemy" loading="lazy" decoding="async"></div><figcaption><strong>Drone</strong><span>Arcing shot</span></figcaption></figure>
  <figure class="ml-enemy"><div class="ml-enemy__img"><img src="/images/work/mecha-legion/enemy_xetang.webp" alt="Tank enemy" loading="lazy" decoding="async"></div><figcaption><strong>Tank</strong><span>Laser</span></figcaption></figure>
  <figure class="ml-enemy"><div class="ml-enemy__img"><img src="/images/work/mecha-legion/enemy_dropship.webp" alt="Dropship enemy" loading="lazy" decoding="async"></div><figcaption><strong>Dropship</strong><span>Pink laser</span></figcaption></figure>
  <figure class="ml-enemy"><div class="ml-enemy__img"><img src="/images/work/mecha-legion/enemy_nhen.webp" alt="Spider enemy" loading="lazy" decoding="async"></div><figcaption><strong>Spider</strong><span>Six fireballs</span></figcaption></figure>
  <figure class="ml-enemy"><div class="ml-enemy__img"><img src="/images/work/mecha-legion/enemy_phaobay.webp" alt="Flying cannon enemy" loading="lazy" decoding="async"></div><figcaption><strong>Flying cannon</strong><span>Missiles</span></figcaption></figure>
</div>

### Spin button · 3 states

<div class="ml-spin wide">
  <figure><img src="/images/work/mecha-legion/spin_scope_idle.webp" alt="Spin button, idle state" loading="lazy" decoding="async"><figcaption>Idle</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/spin_scope_busy.webp" alt="Spin button, active state" loading="lazy" decoding="async"><figcaption>Active</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/spin_scope_off.webp" alt="Spin button, disable state" loading="lazy" decoding="async"><figcaption>Disable</figcaption></figure>
</div>

## 03 · Production

### From prompt to playable

Each asset type got its own small workflow. The prompt decides how much cleanup is needed later, so I wrote prompts for the cleanup step.

#### 3.1 Prompts

<div class="ml-prompt wide">
  <dl class="ml-prompt__defs">
    <div><dt>Language</dt><dd>English</dd></div>
    <div><dt>Style block</dt><dd>One shared block for palette, materials and lighting, reused in every prompt so assets look like one game.</dd></div>
    <div><dt>Asset block</dt><dd>Subject, pose, camera, and for sprites the frame count.</dd></div>
    <div><dt>Sheet layout</dt><dd>For animation, I asked for a sheet with labelled rows (spawn, flight loop, impact) and exact frame counts.</dd></div>
    <div><dt>Background</dt><dd>Flat solid #00FF00, so the cutout is clean.</dd></div>
  </dl>
  <div class="ml-prompt__card">
    <p class="ml-prompt__title">Prompt example</p>
<pre><code>Game VFX sprite sheet, 17 frames, ONE blue-cyan plasma
fireball projectile travelling left to right.
Layout: 5 rows, frames in reading order, equal size, same
anchor point, no text, no labels, no grid lines.
 Frames 1-3   spawn: spark, small orb, orb with short tail
 Frames 4-11  flight loop: 8 variations, flickering tail
 Frames 12-17 impact: burst, shockwave ring, fading sparks
Style: stylised sci-fi game art, glossy painted look,
hard glowing shapes, dark steel and cyan palette.
Background: flat solid #00FF00, no gradient, no shadow.</code></pre>
  </div>
</div>

**What the layout instruction produced**

<div class="ml-proj wide">
  <figure class="ml-projcard ml-red">
    <h5>Long Giáp</h5>
    <div class="ml-raw"><img src="/images/work/mecha-legion/raw_proj_long.webp" alt="Raw generated sprite sheet for the Long Giáp projectile, on flat green" loading="lazy" decoding="async"></div>
    <div class="ml-strip">
      <div class="ml-seg" aria-hidden="true"><span style="flex:3">0–2 Spawn</span><span style="flex:8">3–10 Flight loop</span><span style="flex:6">11–16 Impact</span></div>
      <img src="/mecha-legion/game/assets/fx_proj_long.webp" alt="Cleaned 17-frame projectile strip for Long Giáp" loading="lazy" decoding="async">
    </div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--proj" style="background-image:url(/mecha-legion/game/assets/fx_proj_long.webp)" role="img" aria-label="Looping animation of the Long Giáp projectile"></span></div>
  </figure>
  <figure class="ml-projcard ml-purple">
    <h5>Lân Pháo</h5>
    <div class="ml-raw"><img src="/images/work/mecha-legion/raw_proj_lan.webp" alt="Raw generated sprite sheet for the Lân Pháo projectile, on flat green" loading="lazy" decoding="async"></div>
    <div class="ml-strip">
      <div class="ml-seg" aria-hidden="true"><span style="flex:3">0–2 Spawn</span><span style="flex:8">3–10 Flight loop</span><span style="flex:6">11–16 Impact</span></div>
      <img src="/mecha-legion/game/assets/fx_proj_lan.webp" alt="Cleaned 17-frame projectile strip for Lân Pháo" loading="lazy" decoding="async">
    </div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--proj" style="background-image:url(/mecha-legion/game/assets/fx_proj_lan.webp)" role="img" aria-label="Looping animation of the Lân Pháo projectile"></span></div>
  </figure>
  <figure class="ml-projcard ml-green">
    <h5>Quy Thuẫn</h5>
    <div class="ml-raw"><img src="/images/work/mecha-legion/raw_proj_quy.webp" alt="Raw generated sprite sheet for the Quy Thuẫn projectile, on flat green" loading="lazy" decoding="async"></div>
    <div class="ml-strip">
      <div class="ml-seg" aria-hidden="true"><span style="flex:3">0–2 Spawn</span><span style="flex:8">3–10 Flight loop</span><span style="flex:6">11–16 Impact</span></div>
      <img src="/mecha-legion/game/assets/fx_proj_quy.webp" alt="Cleaned 17-frame projectile strip for Quy Thuẫn" loading="lazy" decoding="async">
    </div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--proj" style="background-image:url(/mecha-legion/game/assets/fx_proj_quy.webp)" role="img" aria-label="Looping animation of the Quy Thuẫn projectile"></span></div>
  </figure>
  <figure class="ml-projcard ml-orange">
    <h5>Phụng Kiếm</h5>
    <div class="ml-raw"><img src="/images/work/mecha-legion/raw_proj_phung.webp" alt="Raw generated sprite sheet for the Phụng Kiếm projectile, on flat green" loading="lazy" decoding="async"></div>
    <div class="ml-strip">
      <div class="ml-seg" aria-hidden="true"><span style="flex:3">0–2 Spawn</span><span style="flex:8">3–10 Flight loop</span><span style="flex:6">11–16 Impact</span></div>
      <img src="/mecha-legion/game/assets/fx_proj_phung.webp" alt="Cleaned 17-frame projectile strip for Phụng Kiếm" loading="lazy" decoding="async">
    </div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--proj" style="background-image:url(/mecha-legion/game/assets/fx_proj_phung.webp)" role="img" aria-label="Looping animation of the Phụng Kiếm projectile"></span></div>
  </figure>
</div>

#### 3.2 After the prompt

<div class="ml-rows wide">
  <div class="ml-row ml-red">
    <p class="ml-row__name"><strong>Long Giáp</strong><span>Dragon</span></p>
    <div class="ml-row__sheet"><img src="/mecha-legion/game/assets/spr_long.webp" alt="Six-frame attack sheet for Long Giáp" loading="lazy" decoding="async"></div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--warrior" style="background-image:url(/mecha-legion/game/assets/spr_long.webp);aspect-ratio:469/438" role="img" aria-label="Looping attack animation of Long Giáp"></span></div>
  </div>
  <div class="ml-row ml-purple">
    <p class="ml-row__name"><strong>Lân Pháo</strong><span>Qilin</span></p>
    <div class="ml-row__sheet"><img src="/mecha-legion/game/assets/spr_lan.webp" alt="Six-frame attack sheet for Lân Pháo" loading="lazy" decoding="async"></div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--warrior" style="background-image:url(/mecha-legion/game/assets/spr_lan.webp);aspect-ratio:459/436" role="img" aria-label="Looping attack animation of Lân Pháo"></span></div>
  </div>
  <div class="ml-row ml-green">
    <p class="ml-row__name"><strong>Quy Thuẫn</strong><span>Tortoise</span></p>
    <div class="ml-row__sheet"><img src="/mecha-legion/game/assets/spr_quy.webp" alt="Six-frame attack sheet for Quy Thuẫn" loading="lazy" decoding="async"></div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--warrior" style="background-image:url(/mecha-legion/game/assets/spr_quy.webp);aspect-ratio:462/391" role="img" aria-label="Looping attack animation of Quy Thuẫn"></span></div>
  </div>
  <div class="ml-row ml-orange">
    <p class="ml-row__name"><strong>Phụng Kiếm</strong><span>Phoenix</span></p>
    <div class="ml-row__sheet"><img src="/mecha-legion/game/assets/spr_phung.webp" alt="Six-frame attack sheet for Phụng Kiếm" loading="lazy" decoding="async"></div>
    <div class="ml-anim"><span class="ml-sprite ml-sprite--warrior" style="background-image:url(/mecha-legion/game/assets/spr_phung.webp);aspect-ratio:420/396" role="img" aria-label="Looping attack animation of Phụng Kiếm"></span></div>
  </div>
</div>

## 04 · Outcome

### Environment, composition, playable

AI supported the environment and the game elements: the city background loop, symbols, enemies and effects. The sound was produced with ElevenLabs. Everything below comes from the real build.

#### Background and environment

<div class="ml-env wide">
  <div class="ml-env__row ml-env__row--2">
    <figure class="ml-env__item"><div class="ml-video"><video autoplay muted loop playsinline preload="metadata" poster="/images/work/mecha-legion/env_video.webp" aria-label="Looping city battle background"><source src="/mecha-legion/game/assets/bg_battle.mp4" type="video/mp4"></video></div><figcaption>Battle loop</figcaption></figure>
    <figure class="ml-env__item"><div class="ml-shot"><img src="/images/work/mecha-legion/shot_battle.webp" alt="Battle strip from the game, with the warrior fully visible" loading="lazy" decoding="async"></div><figcaption>Battle strip</figcaption></figure>
  </div>
  <div class="ml-env__row ml-env__row--3">
    <figure class="ml-env__item"><div class="ml-card ml-card--cover"><img src="/mecha-legion/game/assets/splash_bg.webp" alt="Splash background, portrait" loading="lazy" decoding="async"></div><figcaption>Intro background</figcaption></figure>
    <figure class="ml-env__item"><div class="ml-card ml-card--cover"><img src="/mecha-legion/game/assets/bg_maingame.webp" alt="Main game background, portrait" loading="lazy" decoding="async"></div><figcaption>Main game background</figcaption></figure>
    <figure class="ml-env__item"><div class="ml-card"><img src="/mecha-legion/game/assets/bg_board_normal.webp" alt="Game board background, portrait" loading="lazy" decoding="async"></div><figcaption>Reel board frame</figcaption></figure>
  </div>
</div>

#### Game composition

<div class="ml-comp wide">
  <figure><img src="/images/work/mecha-legion/shot_intro.webp" alt="Intro screen" loading="lazy" decoding="async"><figcaption>Intro</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_select.webp" alt="Select screen" loading="lazy" decoding="async"><figcaption>Select</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_play.webp" alt="Gameplay screen" loading="lazy" decoding="async"><figcaption>Gameplay</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_bet.webp" alt="Bet screen" loading="lazy" decoding="async"><figcaption>Bet</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_pay.webp" alt="Paytable screen" loading="lazy" decoding="async"><figcaption>Paytable</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_rules.webp" alt="Rules screen" loading="lazy" decoding="async"><figcaption>Rules</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_hist.webp" alt="History screen" loading="lazy" decoding="async"><figcaption>History</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_freegame.webp" alt="Free Game screen" loading="lazy" decoding="async"><figcaption>Free Game</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_bigwin.webp" alt="Mega Win screen" loading="lazy" decoding="async"><figcaption>Mega Win</figcaption></figure>
  <figure><img src="/images/work/mecha-legion/shot_jackpot.webp" alt="Jackpot screen" loading="lazy" decoding="async"><figcaption>Jackpot</figcaption></figure>
</div>

#### Play the build

Click to experience the prototype.

<!-- demo:mecha-play -->

## 05 · Reflection

This project taught me to run a design from the first idea to a playable build: art direction, a repeatable asset workflow, a prototype, audio and video.

- Prototyping showed problems static screens hide, such as timing, loudness and how a miss feels.
- Naming, frame sizes, muzzle points and sound events were written down so an engineer can pick the build up without guessing.
- This is art direction and a playable prototype, not the final game. Engineers would refine it to fit the production build.
