// Phần 1 · Amount input: đổi qua lại giữa nhập USDT và nhập BTC.
import { fmt2, trimBtc } from './format.ts';
import { usdtForPct } from './slider.ts';

export const PRICE = 68565.12; // giá Buy
export const AVAIL = 12450; // số dư USDT khả dụng
export const FEE = 0.001; // phí 0.1%

export type Unit = 'USDT' | 'BTC';

export interface AmountState {
  unit: Unit;
  raw: string;
  pct: number;
}

/** Version 1 chỉ để xem: số cố định, cùng mức tiền với Improved để so sánh. */
export const AMOUNT_V1 = {
  amount: '0.0907',
  total: '≈ 6,218.86 USDT',
  fee: '≈ 6.22 USDT',
  pct: 6218.86 / AVAIL,
};

export const num = (raw: string): number => parseFloat(raw) || 0;
export const usdtOf = (s: AmountState): number => (s.unit === 'USDT' ? num(s.raw) : num(s.raw) * PRICE);
export const btcOf = (s: AmountState): number => (s.unit === 'BTC' ? num(s.raw) : num(s.raw) / PRICE);
export const decimalsFor = (unit: Unit): number => (unit === 'USDT' ? 2 : 4);
export const labelFor = (unit: Unit): string => (unit === 'USDT' ? 'Total' : 'Amount');
export const inputLabelFor = (unit: Unit): string =>
  unit === 'USDT' ? 'Total to spend in USDT' : 'Amount in BTC';
export const chipLabelFor = (unit: Unit): string => `Switch to ${unit === 'USDT' ? 'BTC' : 'USDT'} input`;

export const syncPct = (s: AmountState): number => Math.min(1, usdtOf(s) / AVAIL);

export function initialAmountState(): AmountState {
  const s: AmountState = { unit: 'USDT', raw: '6218.86', pct: 0 };
  return { ...s, pct: syncPct(s) };
}

/** Dòng Total hiện đơn vị còn lại: nhập USDT → "≈ x.xxxx BTC", nhập BTC → "≈ x,xxx.xx USDT". */
export function totalText(s: AmountState): string {
  if (num(s.raw) === 0) return '--';
  return s.unit === 'USDT' ? '≈ ' + btcOf(s).toFixed(4) + ' BTC' : '≈ ' + fmt2(usdtOf(s)) + ' USDT';
}

export interface AmountMeta {
  empty: boolean;
  over: boolean;
  feeText: string;
  pct: number;
}

export function amountMeta(s: AmountState): AmountMeta {
  const empty = num(s.raw) === 0;
  const over = usdtOf(s) > AVAIL + 1e-9;
  return { empty, over, feeText: empty ? '--' : '≈ ' + fmt2(usdtOf(s) * FEE) + ' USDT', pct: s.pct };
}

/** Bấm chip: đổi đơn vị và quy đổi giá trị đang nhập (BTC 4 số lẻ bỏ số 0 thừa, USDT 2 số lẻ). */
export function toggleUnit(s: AmountState): AmountState {
  const to: Unit = s.unit === 'USDT' ? 'BTC' : 'USDT';
  let raw = '';
  if (num(s.raw) > 0) {
    raw = to === 'BTC' ? trimBtc(usdtOf(s) / PRICE) : (btcOf(s) * PRICE).toFixed(2);
  }
  const next: AmountState = { unit: to, raw, pct: s.pct };
  return { ...next, pct: syncPct(next) };
}

/** Kéo/bấm thanh trượt: đặt số tiền bằng `p` của số dư, theo đơn vị đang nhập. */
export function applyPct(s: AmountState, p: number): AmountState {
  const u = usdtForPct(AVAIL, p);
  const raw =
    s.unit === 'USDT'
      ? u <= 0 ? '' : u.toFixed(2)
      : trimBtc(Math.floor((u / PRICE) * 1e4) / 1e4);
  return { ...s, raw, pct: p };
}
