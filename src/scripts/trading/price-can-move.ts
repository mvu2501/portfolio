// Phần 3 · Price can move (Improved): chip % cộng dồn vào Max price; từ +7% hiện cảnh báo nhưng vẫn đặt lệnh được.
import { fmtRaw } from '../../lib/trading/format.ts';
import { applyChip, initialTwapState, offText, twapMeta, typePrice, type TwapState } from '../../lib/trading/twap.ts';
import { bindNumber, bump, flash, pop, pressButton } from './ui.ts';

const root = document.querySelector<HTMLElement>('[data-demo="price-can-move"] [data-mount="live"]');
if (root) init(root);

function init(root: HTMLElement) {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const priceIn = $<HTMLInputElement>('[data-price]');
  const offEl = $('[data-off]');
  const costEl = $('[data-cost]');
  const feeEl = $('[data-fee]');
  const buy = $<HTMLButtonElement>('[data-buy]');
  const warnBox = $('[data-warn]');
  const msg = $('[data-msg]');
  const chips = root.querySelectorAll<HTMLButtonElement>('[data-chip]');

  let st: TwapState = initialTwapState();
  let warned = false;

  function render(animate: boolean) {
    const m = twapMeta(st);
    offEl.textContent = offText(st);
    costEl.textContent = m.costText;
    feeEl.textContent = m.feeText;
    offEl.classList.toggle('warn', m.warn);
    warnBox.classList.toggle('show', m.warn);
    warnBox.setAttribute('aria-hidden', m.warn ? 'false' : 'true');
    if (m.warn && !warned && animate) pop(msg);
    warned = m.warn;
    buy.disabled = m.empty; /* Max price xa chỉ cảnh báo: người dùng vẫn đặt lệnh được */
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      st = applyChip(st, parseInt(chip.getAttribute('data-chip') ?? '0', 10));
      priceIn.value = fmtRaw(st.price);
      render(true);
      pop(priceIn); pop(costEl); flash(offEl, warned ? 'var(--warn-fg)' : 'var(--ink3)'); bump(chip);
    });
  });

  bindNumber(priceIn, 2, (raw) => {
    st = typePrice(raw);
    render(true);
  });

  pressButton(buy);

  priceIn.value = fmtRaw(st.price);
  render(false);
}
