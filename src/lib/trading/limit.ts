// Phần 2 · Limit price: các chip % cộng dồn vào giá giới hạn. Mọi % lưu bằng basis point (100bp = 1%).
import { fmt2 } from './format.ts';
import { usdtForPct } from './slider.ts';

export const BASE_CENTS = 6856512; // giá Buy hiện tại: 68,565.12
export const AVAIL = 12450;
export const FEE = 0.001;
export const CHIPS = [-1, -2, -5]; // % cộng thêm mỗi lần bấm
export const QUOTE_DISCOUNT_BP = 100; // bấm giá Buy → điền thấp hơn 1.00%
export const MAX_DOWN_BP = 5000; // thấp nhất cho phép: -50.00% so với giá hiện tại
export const MIN_CENTS = Math.round((BASE_CENTS * (10000 - MAX_DOWN_BP)) / 10000);
export const MIN_PRICE_TEXT = fmt2(MIN_CENTS / 100);

export interface LimitState {
  /** Chênh lệch so với giá hiện tại, đơn vị 0.01% (-300 = -3.00%) */
  offBp: number;
  price: string;
  amount: string;
  /** Vị trí thanh trượt: chỉ đổi khi người dùng kéo thanh hoặc sửa Amount, không bao giờ do giá */
  pct: number;
}

/** Version 1 chỉ để xem: giá gõ tay, không có chip. */
export const LIMIT_V1 = {
  price: '67,879.47',
  amount: '0.0910',
  total: '6,177.03 USDT',
  fee: '≈ 6.18 USDT',
  pct: 6177.03 / AVAIL,
};

export const num = (raw: string): number => parseFloat(raw) || 0;

export function priceAtBp(bp: number): string {
  return (Math.round((BASE_CENTS * (10000 + bp)) / 10000) / 100).toFixed(2);
}

export function initialLimitState(): LimitState {
  return { offBp: -QUOTE_DISCOUNT_BP, price: priceAtBp(-QUOTE_DISCOUNT_BP), amount: '0.0910', pct: 0.5 };
}

export function offText(s: LimitState): string {
  if (num(s.price) === 0) return 'Enter a price';
  if (s.offBp === -MAX_DOWN_BP) return 'Max -' + (MAX_DOWN_BP / 100).toFixed(2) + '% reached';
  return (s.offBp < 0 ? '-' : '+') + Math.abs(s.offBp / 100).toFixed(2) + '% vs current price';
}

/** Bấm chip: cộng % vào mức chênh đang có (cộng dồn, không nhân dồn), chặn ở sàn -50%. */
export function applyChip(s: LimitState, chipPct: number): LimitState {
  const base = num(s.price) === 0 ? 0 : s.offBp;
  const offBp = Math.max(-MAX_DOWN_BP, base + chipPct * 100);
  return { ...s, offBp, price: priceAtBp(offBp) };
}

/** Bấm giá Buy: thay mức chênh hiện tại bằng "giá Buy -1%" (nên cũng dùng như nút reset). */
export function fillFromQuote(s: LimitState): LimitState {
  return { ...s, offBp: -QUOTE_DISCOUNT_BP, price: priceAtBp(-QUOTE_DISCOUNT_BP) };
}

/** Gõ giá bằng tay: tính lại mức chênh (làm tròn 0.01%). */
export function typePrice(s: LimitState, raw: string): LimitState {
  const v = num(raw);
  return { ...s, price: raw, offBp: v === 0 ? 0 : Math.round((v / (BASE_CENTS / 100) - 1) * 10000) };
}

export interface LimitMeta {
  empty: boolean;
  low: boolean;
  over: boolean;
  totalText: string;
  feeText: string;
  chipsDisabled: boolean;
  /** pct đã đồng bộ khi người dùng sửa Amount (syncSlider = true) */
  pct: number;
}

export function limitMeta(s: LimitState, syncSlider: boolean): LimitMeta {
  const total = num(s.price) * num(s.amount);
  const empty = num(s.price) === 0 || num(s.amount) === 0;
  return {
    empty,
    low: num(s.price) > 0 && num(s.price) < MIN_CENTS / 100 - 1e-9,
    over: total > AVAIL + 1e-9,
    totalText: empty ? '--' : fmt2(total) + ' USDT',
    feeText: empty ? '--' : '≈ ' + fmt2(total * FEE) + ' USDT',
    chipsDisabled: num(s.price) > 0 && s.offBp <= -MAX_DOWN_BP,
    pct: syncSlider ? Math.min(1, total / AVAIL) : s.pct,
  };
}

/** Kéo thanh trượt: Amount = số dư × % / giá hiện tại (4 số lẻ, làm tròn xuống). */
export function amountForPct(s: LimitState, p: number): string {
  const u = usdtForPct(AVAIL, p);
  const px = num(s.price) || BASE_CENTS / 100;
  const a = Math.floor((u / px) * 1e4) / 1e4;
  return a > 0 ? a.toFixed(4) : '';
}
