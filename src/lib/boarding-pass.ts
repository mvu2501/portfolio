// boarding-pass.ts – logic xé cuống vé cho src/components/BoardingPass.astro.
// initBoardingPass(root) gắn hành vi vào khung `root` và trả về hàm destroy() để dọn sạch
// (requestAnimationFrame, event listener, timeout, AudioContext, ResizeObserver).
// Các hằng số hình học lấy từ thiết kế Figma, giữ nguyên.

export function initBoardingPass(root: HTMLElement): () => void {
  const W = 1040, H = 380, PERF = 760, SW = 280, R = 28, NR = 18, OX = 4, RIP = 24; // NR = bán kính chỗ khuyết nửa tròn ở đầu/cuối đường xé
  const MAX_SCALE = 0.5; // vé hiển thị tối đa 50% kích thước gốc (thu nhỏ lại ở khung hẹp)
  const K = 14, SEGPX = 12, SNAP_AT = 0.75; // số đoạn răng cưa, px kéo cho mỗi đoạn, độ căng mà đoạn đó "tách"
  const $ = <T extends Element = HTMLElement>(name: string) => root.querySelector<T>(`[data-bp="${name}"]`)!;
  const ticket = $('ticket'), fit = $('fit');
  const mainWrap = $('main-wrap'), mainShape = $('main-shape');
  const stubClip = $('stub-clip'), stubWrap = $('stub-wrap') as HTMLElement & { _s?: number }, stubShape = $('stub-shape');
  const gooPath = $<SVGPathElement>('goo-path'), perf = $('perf'), hint = $('hint'), again = $('again'), statusEl = $('status');
  const soundBtn = $('sound');
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const f = (n: number) => n.toFixed(1);

  /* ---------- dọn dẹp ---------- */
  let destroyed = false, rafId = 0, againTimer = 0;
  const cleanups: Array<() => void> = [];
  const on = <E extends EventTarget>(el: E, type: string, fn: (e: any) => void) => {
    el.addEventListener(type, fn);
    cleanups.push(() => el.removeEventListener(type, fn));
  };

  /* ---------- khung chứa: thay cho innerWidth / innerHeight ---------- */
  let boxW = root.clientWidth, boxH = root.clientHeight;

  /* ---------- mép rách ----------
     Đường đục lỗ = một hàng lỗ. Khi giấy rách, đường rách đi qua các cầu nối giữa các lỗ,
     nên CẢ HAI mảnh giữ nửa lỗ ở mỗi lỗ và mép lồi lõm bù nhau ở mỗi cầu nối. */
  const DY = 0.8, NS = Math.ceil(H / DY);
  const HOLES = 18, HOLE_Y0 = 40, HOLE_DY = 17.6, HOLE_R = 5.4;
  function rng(a: number) {
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  let tearW: number[] = []; // độ lệch đường rách chung so với đường đục lỗ, theo từng mẫu
  function seedTear() {
    const r = rng((Math.random() * 1e9) | 0);
    const bumps: number[] = [];
    for (let i = 0; i <= HOLES; i++) bumps.push((r() * 2 - 1) * 3.4 + (r() < 0.25 ? (r() * 2 - 1) * 2 : 0));
    const ph = r() * 6.28;
    tearW = [];
    for (let k = 0; k <= NS; k++) {
      const y = k * DY;
      const j0 = Math.round((y - HOLE_Y0 - HOLE_DY / 2) / HOLE_DY);
      let v = 0.35 * Math.sin(y * 0.9 + ph);
      for (let j = j0 - 1; j <= j0 + 1; j++) {
        if (j < 0 || j >= HOLES) continue;
        const yc = HOLE_Y0 + HOLE_DY / 2 + j * HOLE_DY, d = (y - yc) / 3.4;
        v += bumps[j] * Math.exp(-d * d);
      }
      tearW.push(clamp(v, -4, 4));
    }
  }
  seedTear();

  const holeBite = (y: number) => {
    const i = Math.round((y - HOLE_Y0) / HOLE_DY);
    if (i < 0 || i >= HOLES) return 0;
    const d = Math.abs(y - (HOLE_Y0 + i * HOLE_DY));
    return d < HOLE_R ? Math.sqrt(HOLE_R * HOLE_R - d * d) : 0;
  };
  const notch = (y: number) => y < NR ? Math.sqrt(NR * NR - y * y) : y > H - NR ? Math.sqrt(NR * NR - (H - y) * (H - y)) : 0;
  const cornerInset = (y: number) => {
    const d = y < R ? R - y : y > H - R ? y - (H - R) : -1;
    return d < 0 ? 0 : R - Math.sqrt(R * R - d * d);
  };
  const tornAmount = (y: number, Tp: number) => clamp((Tp - y) / RIP, 0, 1); // 0 = còn nguyên, 1 = đã rách; đầu rách chạy từ trên xuống

  // hàng lỗ đục lỗ, vẽ cho đến khi chỗ rách chạm tới
  const perfTop = HOLE_Y0 - HOLE_DY / 2;
  Object.assign(perf.style, {
    left: PERF - 6 + 'px', top: perfTop + 'px', width: '12px', height: HOLES * HOLE_DY + 'px',
    background: `radial-gradient(circle at center, #e3e3e3 ${HOLE_R - 0.3}px, transparent ${HOLE_R + 0.3}px) 0 0 / 12px ${HOLE_DY}px repeat-y`
  });

  // Bóng đổ bị khoét khỏi hai chỗ khuyết nửa tròn khi giấy ở đó còn nguyên
  // (bán kính khuyết co về 0 khi chỗ rách chạm tới, bóng quay lại mượt).
  // Chỉ phần khuyết nằm trong hộp của vé bị khoét (bóng đổ xuống đất bên dưới vẫn giữ).
  const off = (r: number) => r < 0.3;
  const mainTop = (r: number) => off(r) ? '' : `M${f(PERF + r)} 0A${f(r)} ${f(r)} 0 0 1 ${f(PERF - r)} 0Z`;
  const mainBot = (r: number) => off(r) ? '' : `M${f(PERF - r)} ${H}A${f(r)} ${f(r)} 0 0 1 ${f(PERF + r)} ${H}Z`;
  const stubTop = (r: number) => off(r) ? '' : `M${f(r)} 3000A${f(r)} ${f(r)} 0 0 1 0 ${f(3000 + r)}L0 3000Z`;
  const stubBot = (r: number) => off(r) ? '' : `M0 ${f(3000 + H - r)}A${f(r)} ${f(r)} 0 0 1 ${f(r)} ${3000 + H}L0 ${3000 + H}Z`;
  function shadowClips(q: number) {
    const Tp = q * (H + RIP);
    const rt = (NR + 1) * (1 - clamp((Tp - 4) / RIP, 0, 1)), rb = (NR + 1) * (1 - clamp((Tp - (H - RIP)) / (2 * RIP), 0, 1));
    return {
      main: `path(evenodd,'M-300 -300H1340V680H-300Z${mainTop(rt)}${mainBot(rb)}')`,
      stub: `path(evenodd,'M-500 0L6000 0L6000 6000L-500 6000L-500 ${3000 + H}L0 ${3000 + H}L0 3000L-500 3000Z${stubTop(rt)}${stubBot(rb)}')`
    };
  }

  /* Sợi giấy "liquid": chỗ một răng vừa đứt vẫn còn sợi mảnh nối hai mép.
     Nó giãn ra (cổ thon dần, hai đầu phình) và đứt khi hai mảnh cách nhau LMAX. */
  const LMAX = 28;
  function strands(q: number, k: number) {
    if (k < 0.01) return '';
    const Tp = q * (H + RIP), cs = Math.cos(theta), sn = Math.sin(theta), t = performance.now() / 90;
    let d = '';
    for (let j = 0; j < HOLES - 1; j++) {
      const yb = HOLE_Y0 + HOLE_DY / 2 + j * HOLE_DY;
      if (yb > Tp - RIP * 0.4) continue; // chưa rách tới
      const w = tearW[Math.round(yb / DY)];
      const ax = PERF + w, ay = yb;
      const px = PERF + w - CS.x, py = yb - CS.y;
      const bx = c.x + px * cs - py * sn, by = c.y + px * sn + py * cs;
      const sep = Math.hypot(bx - ax, by - ay), s = sep / LMAX;
      if (sep < 1.5 || s >= 1) continue;
      const g = k * Math.min(1, sep / 8); // lớn dần khi khe hở mở ra
      const neck = (0.2 + 0.85 * Math.pow(1 - s, 1.5)) * g, bulb = 2.5 * g * (1 - s * 0.4);
      const cx = (ax + bx) / 2 + Math.sin(t + j) * 1.2 * (1 - s), cy = (ay + by) / 2 + sep * 0.1; // chảy xệ theo trọng lực
      const L: string[] = [], Rr: string[] = [];
      for (let i = 0; i <= 12; i++) {
        const u = i / 12, v = 1 - u;
        const x = v * v * ax + 2 * u * v * cx + u * u * bx, y = v * v * ay + 2 * u * v * cy + u * u * by;
        let tx = 2 * v * (cx - ax) + 2 * u * (bx - cx), ty = 2 * v * (cy - ay) + 2 * u * (by - cy);
        const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
        const hw = neck + (bulb - neck) * (Math.exp(-Math.pow(u / 0.2, 2)) + Math.exp(-Math.pow(v / 0.2, 2)));
        L.push(f(x - ty * hw) + ' ' + f(y + tx * hw)); Rr.push(f(x + ty * hw) + ' ' + f(y - tx * hw));
      }
      d += 'M' + L.join('L') + 'L' + Rr.reverse().join('L') + 'Z';
    }
    return d;
  }

  // q: 0 = còn nguyên, 1 = rách hẳn
  function stubPath(q: number) {
    const Tp = q * (H + RIP), out: string[] = [];
    for (let k = 0; k <= NS; k++) {
      const y = Math.min(H, k * DY), m = tornAmount(y, Tp);
      out.push(f(Math.max(OX + m * (Math.max(tearW[k], holeBite(y)) + cornerInset(y)) - 0.6 * (1 - m), OX + notch(y))) + ' ' + f(y));
    }
    return `M${OX + SW - R} 0A${R} ${R} 0 0 1 ${OX + SW} ${R}L${OX + SW} ${H - R}A${R} ${R} 0 0 1 ${OX + SW - R} ${H}L` +
           out.reverse().join('L') + 'Z';
  }
  function mainPath(q: number) {
    const Tp = q * (H + RIP), out: string[] = [];
    for (let k = 0; k <= NS; k++) {
      const y = Math.min(H, k * DY), m = tornAmount(y, Tp);
      out.push(f(Math.min(PERF + m * (Math.min(tearW[k], -holeBite(y)) - cornerInset(y)), PERF - notch(y))) + ' ' + f(y));
    }
    return `M${R} 0L${out.join('L')}L${R} ${H}A${R} ${R} 0 0 1 0 ${H - R}L0 ${R}A${R} ${R} 0 0 1 ${R} 0Z`;
  }

  /* ---------- âm thanh (tổng hợp bằng Web Audio, không dùng file) ---------- */
  let actx: AudioContext | null = null, noiseBuf: AudioBuffer | null = null, soundOn = true, lastCrackle = 0;
  try { soundOn = localStorage.getItem('bp-sound') !== 'off'; } catch (_) {}
  const syncSoundBtn = () => { soundBtn.textContent = 'Sound: ' + (soundOn ? 'on' : 'off'); soundBtn.setAttribute('aria-pressed', String(soundOn)); };
  syncSoundBtn();
  on(soundBtn, 'click', () => {
    soundOn = !soundOn; syncSoundBtn();
    try { localStorage.setItem('bp-sound', soundOn ? 'on' : 'off'); } catch (_) {}
    if (soundOn) { audio(); burst({ dur: 0.05, f0: 3000, f1: 3000, gain: 0.15 }); }
  });
  // Chỉ tạo AudioContext từ một thao tác của người dùng (pointerdown, phím, bấm nút).
  function audio(): AudioContext | null {
    if (!soundOn || destroyed) return null;
    try {
      if (!actx) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        actx = new Ctx() as AudioContext;
        noiseBuf = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch (_) { return null; }
  }
  // một đợt nhiễu qua bộ lọc = chút tiếng giấy rách
  function burst({ dur = 0.04, f0 = 3500, f1 = 3500, q = 0.9, gain = 0.25, lowpass = 0, delay = 0 }: { dur?: number; f0?: number; f1?: number; q?: number; gain?: number; lowpass?: number; delay?: number }) {
    const a = audio(); if (!a || !noiseBuf) return;
    const t = a.currentTime + delay;
    const src = a.createBufferSource(); src.buffer = noiseBuf;
    src.loopStart = 0; src.loop = true;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const hp = a.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(hp);
    let out: AudioNode = hp;
    if (lowpass) { const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = lowpass; hp.connect(lp); out = lp; }
    out.connect(g); g.connect(a.destination);
    src.start(t, Math.random() * 0.8); src.stop(t + dur + 0.02);
  }
  const sfx = {
    snap(n = 1) { // một răng cưa bung ra
      for (let i = 0; i < n; i++) {
        const fq = 2800 + Math.random() * 3200;
        burst({ dur: 0.035 + Math.random() * 0.03, f0: fq, f1: fq * (0.6 + Math.random() * 0.3), gain: 0.2 + Math.random() * 0.12, delay: i * 0.012 });
      }
      if (navigator.vibrate) try { navigator.vibrate(6); } catch (_) {}
    },
    crackle() { burst({ dur: 0.018, f0: 5000 + Math.random() * 2500, f1: 4500, q: 1.5, gain: 0.05 }); }, // sợi giấy căng
    rip() { // đứt hẳn
      burst({ dur: 0.22, f0: 1600, f1: 5200, q: 0.6, gain: 0.34 });
      burst({ dur: 0.09, f0: 700, f1: 400, q: 0.8, gain: 0.22, lowpass: 1400, delay: 0.02 });
    },
    print() { for (let i = 0; i < 4; i++) burst({ dur: 0.03, f0: 1800, f1: 1400, q: 2, gain: 0.1, delay: i * 0.045 }); }
  };

  /* ---------- trạng thái ---------- */
  const CS = { x: PERF + SW / 2, y: H / 2 }; // tâm cuống vé khi còn nguyên
  let mode: 'attached' | 'free' = 'attached';
  let p = 0, pT = 0, pVel = 0; // tiến độ xé (lò xo)
  let c = { ...CS }, theta = 0, omega = 0; // tư thế
  let vel = { x: 0, y: 0 }, tearAge = 0;
  let dragging = false, auto = false, autoT = 0;
  let start = { x: 0, y: 0 }, pointer = { x: 0, y: 0 }, gl = { x: 0, y: 0 };
  let lift = 0, shownP = -1, scale = 1;
  let fallT = 0, fallPhase = 0, fallBias = 0, gone = false;
  let gooK = 0;
  let committed = 0, k0 = 0, autoK0 = 0, tens = 0, tensS = 0, kk = 0, kv = 0; // trạng thái xé theo từng răng

  function attachedPose(q: number, extra = 0) {
    const th = 16 * Math.PI / 180 * Math.pow(q, 1.4) + extra;
    const hx = PERF, hy = q * H;
    const vx = CS.x - hx, vy = CS.y - hy, cs = Math.cos(th), sn = Math.sin(th);
    return { x: hx + vx * cs - vy * sn, y: hy + vx * sn + vy * cs, th };
  }

  /* ---------- vẽ ---------- */
  function render() {
    const q = mode === 'free' ? 1 : clamp(p, 0, 1);
    if (q !== shownP) {
      shownP = q;
      stubShape.style.clipPath = `path('${stubPath(q)}')`;
      mainShape.style.clipPath = `path('${mainPath(q)}')`;
      const s = 1;
      mainWrap.style.filter = `drop-shadow(0 1px 2px rgba(0,0,0,${0.05 * s})) drop-shadow(0 14px 30px rgba(0,0,0,${0.08 * s}))`;
      stubWrap._s = s;
      const sc = shadowClips(q);
      mainWrap.style.clipPath = sc.main;
      if (mode === 'attached') stubClip.style.clipPath = sc.stub;
      perf.style.clipPath = `inset(${Math.max(0, q * (H + RIP) - 10 - perfTop)}px 0 0 0)`;
    }
    const s = stubWrap._s || 0;
    stubWrap.style.filter = s > 0
      ? `drop-shadow(0 1px 2px rgba(0,0,0,${0.05 * s})) drop-shadow(0 ${f(14 + lift * 18)}px ${f(30 + lift * 14)}px rgba(0,0,0,${f(s * (0.08 + lift * 0.06))}))` : 'none';
    gooPath.setAttribute('d', strands(q, gooK));
    stubWrap.style.transform = `translate(${f(c.x - CS.x)}px,${f(c.y - CS.y)}px) rotate(${theta.toFixed(4)}rad)`;
  }

  /* ---------- vòng lặp hoạt ảnh ---------- */
  let running = false, last = 0;
  function wake() {
    if (destroyed || running) return;
    running = true; last = performance.now(); rafId = requestAnimationFrame(tick);
  }

  // Vùng cuống vé được bay/rơi: chính khung của project (không phải cả cửa sổ), theo toạ độ của vé
  function bounds() {
    const r = ticket.getBoundingClientRect(), b = root.getBoundingClientRect(), s = r.width / W;
    return {
      minX: (b.left - r.left) / s + SW / 2, maxX: (b.right - r.left) / s - SW / 2,
      minY: (b.top - r.top) / s + H / 2, maxY: (b.bottom - r.top) / s - H / 2,
      bottom: (b.bottom - r.top) / s
    };
  }

  // pr đếm số đoạn đục lỗ (0..K). Giấy căng cho tới khi một răng bung ra, rồi "tách".
  function applyProg(pr: number) {
    const seg = Math.floor(pr), frac = pr - seg;
    const snapTo = Math.min(K, seg + (frac > SNAP_AT ? 1 : 0));
    if (snapTo > committed) {
      const n = snapTo - committed;
      committed = snapTo;
      if (committed < K) { sfx.snap(Math.min(n, 3)); kv += 1.1; }
    }
    pT = committed / K;
    tens = committed >= K || frac > SNAP_AT ? 0 : Math.min(1, frac / SNAP_AT);
    if (tens > 0 && performance.now() - lastCrackle > 55) { lastCrackle = performance.now(); sfx.crackle(); }
  }

  function tear() {
    sfx.rip();
    mode = 'free'; p = 1; shownP = -1; tearAge = 0;
    stubClip.style.clipPath = 'none';
    const pose = attachedPose(1);
    c = { x: pose.x, y: pose.y }; theta = pose.th; omega = 0.4;
    if (dragging) {
      const dx = pointer.x - c.x, dy = pointer.y - c.y, cs = Math.cos(-theta), sn = Math.sin(-theta);
      gl = { x: clamp(dx * cs - dy * sn, -SW / 2, SW / 2), y: clamp(dx * sn + dy * cs, -H / 2, H / 2) };
      vel = { x: 260, y: 90 };
    } else {
      vel = { x: 420, y: -40 };
      fallT = 0; fallPhase = Math.random() * 6.28; fallBias = 0.25;
    }
    hint.classList.add('hide');
    clearTimeout(againTimer);
    againTimer = window.setTimeout(() => again.classList.add('show'), 700);
    statusEl.textContent = 'Seat stub torn off.';
    if (navigator.vibrate) try { navigator.vibrate(12); } catch (_) {}
  }

  function tick(now: number) {
    if (destroyed) return;
    const dt = Math.min(0.033, (now - last) / 1000 || 0.016); last = now;
    let idle = false;
    gooK += (((dragging || auto) ? 1 : 0) - gooK) * (1 - Math.exp(-dt * 9));

    if (mode === 'attached') {
      if (auto) {
        autoT += dt;
        applyProg(autoK0 + (K - autoK0 + 0.2) * clamp(autoT / 1.1, 0, 1));
      }
      tensS += (tens - tensS) * (1 - Math.exp(-dt * 30));
      kv += (-kk * 260 - kv * 15) * dt; kk += kv * dt;
      pVel += ((pT - p) * 380 - pVel * 26) * dt;
      p += pVel * dt;
      if (p < 0) { p = 0; pVel = 0; }
      if (p >= 0.995 && pT >= 1 && (dragging || auto)) {
        auto = false; tear();
      } else {
        const pose = attachedPose(clamp(p, 0, 1), tensS * 0.03 + kk * 0.02);
        c = { x: pose.x + tensS * 3, y: pose.y }; theta = pose.th;
        lift += ((dragging ? 1 : 0) * 0.5 - lift) * (1 - Math.exp(-dt * 12));
        idle = !dragging && !auto && Math.abs(p - pT) < 0.0005 && Math.abs(pVel) < 0.01 &&
               Math.abs(tensS) < 0.001 && Math.abs(kk) < 0.0005 && Math.abs(kv) < 0.01 && gooK < 0.01;
      }
    }

    if (mode === 'free') {
      tearAge += dt;
      const b = bounds();
      let thetaTarget: number;
      if (dragging) {
        const cs = Math.cos(theta), sn = Math.sin(theta);
        const dx = pointer.x - (gl.x * cs - gl.y * sn), dy = pointer.y - (gl.x * sn + gl.y * cs);
        const rate = 8 + 24 * clamp(tearAge / 0.25, 0, 1);
        const k = 1 - Math.exp(-dt * rate);
        const nx = c.x + (dx - c.x) * k, ny = c.y + (dy - c.y) * k;
        vel.x = vel.x * 0.6 + (nx - c.x) / dt * 0.4;
        vel.y = vel.y * 0.6 + (ny - c.y) / dt * 0.4;
        c.x = clamp(nx, b.minX, Math.max(b.minX, b.maxX));
        c.y = clamp(ny, b.minY, Math.max(b.minY, b.maxY));
        thetaTarget = clamp(vel.x / 2200, -0.55, 0.55);
      } else {
        // buông tay: cuống rơi xuống, chao đảo như tờ giấy rời
        fallT += dt;
        const sway = Math.sin(fallT * 5.5 + fallPhase);
        vel.y += (1800 - vel.y * Math.abs(vel.y) * 0.0016) * dt;
        vel.x += (sway * 320 - vel.x * 1.6) * dt;
        c.x += vel.x * dt; c.y += vel.y * dt;
        if (c.x < b.minX) { c.x = b.minX; vel.x = Math.abs(vel.x) * 0.35; }
        if (c.x > b.maxX) { c.x = b.maxX; vel.x = -Math.abs(vel.x) * 0.35; }
        thetaTarget = sway * 0.55 + fallBias;
        if (c.y > b.bottom + 260) gone = true; // rơi khỏi khung
      }
      omega += ((thetaTarget - theta) * 140 - omega * 11) * dt;
      theta += omega * dt;
      lift += ((dragging ? 1 : 0) - lift) * (1 - Math.exp(-dt * 10));
      if (gone && !dragging) { stubWrap.style.visibility = 'hidden'; gone = false; idle = true; gooK = 0; }
    }

    render();
    if (idle) running = false; else rafId = requestAnimationFrame(tick);
  }

  /* ---------- nhập liệu ---------- */
  function toLocal(e: PointerEvent) {
    const r = ticket.getBoundingClientRect(), s = r.width / W;
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  }

  on(stubWrap, 'pointerdown', (e: PointerEvent) => {
    if (e.button > 0) return;
    e.preventDefault();
    try { stubWrap.setPointerCapture(e.pointerId); } catch (_) {}
    dragging = true; auto = false;
    stubWrap.classList.add('dragging');
    start = pointer = toLocal(e); k0 = committed;
    audio();
    if (mode === 'free') {
      const dx = pointer.x - c.x, dy = pointer.y - c.y, cs = Math.cos(-theta), sn = Math.sin(-theta);
      gl = { x: clamp(dx * cs - dy * sn, -SW / 2, SW / 2), y: clamp(dx * sn + dy * cs, -H / 2, H / 2) };
      tearAge = 0.25; vel = { x: 0, y: 0 };
    }
    wake();
  });

  on(stubWrap, 'pointermove', (e: PointerEvent) => {
    if (!dragging) return;
    pointer = toLocal(e);
    if (mode === 'attached') {
      const dx = pointer.x - start.x, dy = pointer.y - start.y;
      applyProg(k0 + (Math.max(0, dx) + Math.abs(dy) * 0.4) / SEGPX);
    }
    wake();
  });

  const release = () => {
    if (!dragging) return;
    dragging = false;
    stubWrap.classList.remove('dragging');
    if (mode === 'attached') tens = 0; // phần đã rách giữ nguyên; nắm lại để xé tiếp
    else {
      fallT = 0; fallPhase = Math.random() * 6.28; fallBias = clamp(theta, -0.4, 0.4);
      const sp = Math.hypot(vel.x, vel.y), cap = 2600;
      if (sp > cap) { vel.x *= cap / sp; vel.y *= cap / sp; }
    }
    wake();
  };
  on(stubWrap, 'pointerup', release);
  on(stubWrap, 'pointercancel', release);
  on(stubWrap, 'lostpointercapture', release);

  on(stubWrap, 'keydown', (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && mode === 'attached' && !auto) {
      e.preventDefault(); audio(); auto = true; autoT = 0; autoK0 = committed; wake();
    }
  });

  function reset() {
    mode = 'attached'; p = pT = pVel = 0; dragging = false; auto = false;
    committed = 0; tens = tensS = kk = kv = 0; sfx.print();
    c = { ...CS }; theta = omega = 0; vel = { x: 0, y: 0 }; lift = 0; gone = false; gooK = 0;
    seedTear(); shownP = -1;
    stubWrap.style.visibility = ''; fallT = 0;
    clearTimeout(againTimer);
    again.classList.remove('show'); hint.classList.remove('hide');
    stubShape.classList.remove('reprint'); void stubShape.offsetWidth; stubShape.classList.add('reprint');
    statusEl.textContent = 'New ticket printed.';
    wake();
  }
  on(again, 'click', reset);

  /* ---------- co giãn theo khung ---------- */
  function resize() {
    boxW = root.clientWidth; boxH = root.clientHeight;
    scale = Math.max(0.3, Math.min(MAX_SCALE, (boxW - 48) / W));
    fit.style.width = W * scale + 'px';
    fit.style.height = H * scale + 'px';
    ticket.style.transform = `scale(${scale})`;
    wake();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(root);
  cleanups.push(() => ro.disconnect());
  resize();
  render();

  return function destroy() {
    destroyed = true;
    cancelAnimationFrame(rafId);
    clearTimeout(againTimer);
    cleanups.forEach((fn) => fn());
    if (actx) { actx.close().catch(() => {}); actx = null; }
    dragging = false; auto = false; running = false;
    stubWrap.classList.remove('dragging');
  };
}
