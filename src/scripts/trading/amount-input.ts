// Phần 1 · Amount input (Improved): bấm chip USDT ⇄ BTC để đổi đơn vị nhập.
import {
  applyPct, amountMeta, chipLabelFor, decimalsFor, inputLabelFor, initialAmountState,
  labelFor, num, syncPct, toggleUnit, totalText, type AmountState,
} from '../../lib/trading/amount.ts';
import { fmtRaw } from '../../lib/trading/format.ts';
import { bindNumber, bindSlider, pressButton, renderSlider, swapText } from './ui.ts';

const root = document.querySelector<HTMLElement>('[data-demo="amount-input"] [data-mount="live"]');
if (root) init(root);

function init(root: HTMLElement) {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const input = $<HTMLInputElement>('[data-input]');
  const chip = $<HTMLButtonElement>('[data-chip]');
  const chipText = $('[data-chip-text]');
  const ico = $('[data-ico]');
  const label = $('[data-label]');
  const field = $('[data-field]');
  const err = $('[data-err]');
  const totalEl = $('[data-total]');
  const feeEl = $('[data-fee]');
  const buy = $<HTMLButtonElement>('[data-buy]');
  const slider = $('[data-slider]');
  const stopEls = root.querySelectorAll('[data-stop]');

  let state: AmountState = initialAmountState();
  let rot = 0;
  let busy = false;

  const setValue = () => { input.value = fmtRaw(state.raw); };
  const setUnit = () => {
    chipText.textContent = state.unit;
    chip.setAttribute('aria-label', chipLabelFor(state.unit));
    input.setAttribute('aria-label', inputLabelFor(state.unit));
  };
  const setLabel = () => { label.textContent = labelFor(state.unit); };
  const setTotal = () => { totalEl.textContent = totalText(state); };

  function renderMeta() {
    const m = amountMeta(state);
    feeEl.textContent = m.feeText;
    field.classList.toggle('error', m.over);
    err.classList.toggle('show', m.over);
    buy.disabled = m.empty || m.over;
    renderSlider(slider, stopEls, state.pct);
  }

  function toggle() {
    if (busy) return;
    busy = true;
    chip.classList.remove('hint');
    state = toggleUnit(state);
    rot += 180;
    ico.style.transform = 'rotate(' + rot + 'deg)';
    renderMeta();
    Promise.all([
      swapText(input, setValue),
      swapText(chipText, setUnit),
      swapText(label, setLabel),
      swapText(totalEl, setTotal),
    ]).then(() => {
      busy = false;
      input.focus({ preventScroll: true });
    });
  }
  chip.addEventListener('click', (e) => { e.preventDefault(); toggle(); });

  bindNumber(input, () => decimalsFor(state.unit), (raw) => {
    state = { ...state, raw };
    state.pct = syncPct(state);
    setTotal();
    renderMeta();
  });

  bindSlider(slider, () => state.pct, (p) => {
    state = applyPct(state, p);
    setValue(); setTotal(); renderMeta();
  });

  pressButton(buy);

  setValue(); setUnit(); setLabel(); setTotal(); renderMeta();
}
