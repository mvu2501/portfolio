// Phần dùng chung của 3 demo trên trình duyệt: ô nhập số, thanh trượt, hiệu ứng ngắn.
import { sanitizeNumber } from '../../lib/trading/format.ts';
import { pctFromPointer, stepPct, stopIsOn } from '../../lib/trading/slider.ts';

export const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** Ô nhập số: chỉ số và một dấu chấm, giới hạn số lẻ, thêm dấu phẩy, giữ vị trí con trỏ. */
export function bindNumber(input: HTMLInputElement, decimals: number | (() => number), onChange: (raw: string) => void) {
  input.addEventListener('input', () => {
    const dec = typeof decimals === 'function' ? decimals() : decimals;
    const edit = sanitizeNumber(input.value, input.selectionStart || 0, dec);
    input.value = edit.display;
    input.setSelectionRange(edit.caret, edit.caret);
    onChange(edit.raw);
  });
}

/** Thanh trượt: bấm, kéo, hoặc dùng phím mũi tên (mỗi lần 5%). */
export function bindSlider(slider: HTMLElement, getPct: () => number, onPct: (p: number) => void) {
  let drag = false;
  const fromX = (e: PointerEvent) => {
    const r = slider.getBoundingClientRect();
    onPct(pctFromPointer(e.clientX, r.left, r.width));
  };
  slider.addEventListener('pointerdown', (e) => {
    drag = true;
    slider.classList.add('drag');
    slider.setPointerCapture(e.pointerId);
    fromX(e);
    slider.focus({ preventScroll: true });
  });
  slider.addEventListener('pointermove', (e) => {
    if (drag) fromX(e);
  });
  const end = () => {
    drag = false;
    slider.classList.remove('drag');
  };
  slider.addEventListener('pointerup', end);
  slider.addEventListener('pointercancel', end);
  slider.addEventListener('keydown', (e) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    onPct(stepPct(getPct(), dir));
  });
}

/** Đặt vị trí thanh trượt và bật/tắt màu các mốc. */
export function renderSlider(slider: HTMLElement, stops: NodeListOf<Element>, pct: number) {
  slider.style.setProperty('--pct', String(pct));
  slider.setAttribute('aria-valuenow', String(Math.round(pct * 100)));
  stops.forEach((s) => s.classList.toggle('on', stopIsOn(+(s.getAttribute('data-stop') ?? 0), pct)));
}

/** Đổi chữ có hiệu ứng: trượt lên 6px và mờ đi (110ms), đổi nội dung, rồi trượt vào từ dưới (190ms). */
export function swapText(el: HTMLElement, update: () => void): Promise<void> {
  if (reduce || !el.animate) {
    update();
    return Promise.resolve();
  }
  const out = el.animate(
    [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }],
    { duration: 110, easing: 'ease-in', fill: 'forwards' }
  );
  return out.finished
    .then(() => {
      update();
      out.cancel();
      return el.animate(
        [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 190, easing: 'cubic-bezier(.2,.8,.2,1)' }
      ).finished;
    })
    .then(() => undefined)
    .catch(update);
}

/* Hiệu ứng ngắn khi bấm chip; không chặn việc bấm liên tiếp. */
export function pop(el: HTMLElement) {
  if (reduce || !el.animate) return;
  el.animate([{ opacity: 0.35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], {
    duration: 220,
    easing: 'cubic-bezier(.2,.8,.2,1)',
  });
}

export function flash(el: HTMLElement, to?: string) {
  if (reduce || !el.animate) return;
  el.animate([{ color: 'var(--eyebrow)' }, { color: to || 'var(--ink3)' }], { duration: 600, easing: 'ease-out' });
}

export function bump(el: HTMLElement) {
  if (reduce || !el.animate) return;
  el.animate([{ transform: 'scale(1)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 180 });
}

/** Nút Buy chỉ có hiệu ứng nhấn nhẹ. */
export function pressButton(buy: HTMLElement) {
  buy.addEventListener('click', () => {
    if (!reduce && buy.animate) buy.animate([{ transform: 'scale(1)' }, { transform: 'scale(.97)' }, { transform: 'scale(1)' }], { duration: 220 });
  });
}
