// Phần 2 · Limit price (Improved): các chip % cộng dồn vào giá; bấm giá Buy để điền "giá Buy -1%".
import { fmtRaw } from '../../lib/trading/format.ts';
import {
  amountForPct, applyChip, fillFromQuote, initialLimitState, limitMeta, num, offText, typePrice,
  type LimitState,
} from '../../lib/trading/limit.ts';
import { bindNumber, bindSlider, bump, flash, pop, pressButton, renderSlider } from './ui.ts';

const root = document.querySelector<HTMLElement>('[data-demo="limit-price"] [data-mount="live"]');
if (root) init(root);

function init(root: HTMLElement) {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const priceIn = $<HTMLInputElement>('[data-price]');
  const amtIn = $<HTMLInputElement>('[data-amount]');
  const offEl = $('[data-off]');
  const totalEl = $('[data-total]');
  const feeEl = $('[data-fee]');
  const buy = $<HTMLButtonElement>('[data-buy]');
  const slider = $('[data-slider]');
  const err = $('[data-err]');
  const afield = $('[data-afield]');
  const pfield = $('[data-pfield]');
  const perr = $('[data-perr]');
  const quoteBtn = $('[data-quote]');
  const chips = root.querySelectorAll<HTMLButtonElement>('[data-chip]');
  const stopEls = root.querySelectorAll('[data-stop]');

  let st: LimitState = initialLimitState();

  /* syncSlider chỉ true khi người dùng sửa Amount; đổi giá không bao giờ làm thanh trượt nhúc nhích */
  function renderMeta(syncSlider: boolean) {
    const m = limitMeta(st, syncSlider);
    totalEl.textContent = m.totalText;
    feeEl.textContent = m.feeText;
    afield.classList.toggle('error', m.over);
    err.classList.toggle('show', m.over);
    pfield.classList.toggle('error', m.low);
    perr.classList.toggle('show', m.low);
    buy.disabled = m.empty || m.over || m.low;
    chips.forEach((c) => { c.disabled = m.chipsDisabled; });
    st.pct = m.pct;
    renderSlider(slider, stopEls, st.pct);
  }

  function showPrice() {
    priceIn.value = fmtRaw(st.price);
    offEl.textContent = offText(st);
    renderMeta(false);
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      st = applyChip(st, parseInt(chip.getAttribute('data-chip') ?? '0', 10));
      showPrice();
      pop(priceIn); pop(totalEl); flash(offEl); bump(chip);
    });
  });

  quoteBtn.addEventListener('click', () => {
    st = fillFromQuote(st);
    showPrice();
    pop(priceIn); pop(totalEl); flash(offEl);
  });

  bindNumber(priceIn, 2, (raw) => {
    st = typePrice(st, raw);
    offEl.textContent = offText(st);
    renderMeta(false);
  });
  bindNumber(amtIn, 4, (raw) => { st = { ...st, amount: raw }; renderMeta(true); });

  bindSlider(slider, () => st.pct, (p) => {
    st = { ...st, amount: amountForPct(st, p), pct: p };
    amtIn.value = fmtRaw(st.amount);
    renderMeta(false);
  });

  pressButton(buy);

  priceIn.value = fmtRaw(st.price);
  amtIn.value = fmtRaw(st.amount);
  offEl.textContent = offText(st);
  renderMeta(false);
}
