// Phần 3 · Price can move: Max price của lệnh TWAP, cảnh báo khi giới hạn quá xa giá thị trường.
import { fmt2 } from './format.ts';

export const BASE_CENTS = 6856512; // giá Buy hiện tại: 68,565.12
export const QTY = 0.0903;
export const FEE = 0.001;
export const CHIPS = [50, 100, 200]; // +0.5%, +1%, +2% (đơn vị 0.01%) cộng thêm mỗi lần bấm
export const START_BP = 700; // cả hai version mở ở +7.00%
export const WARN_BP = 700; // cảnh báo từ +7.00% trở lên

export interface TwapState {
  offBp: number;
  price: string;
}

export const chipLabel = (bp: number): string => '+' + bp / 100 + '%';
export const priceAt = (bp: number): string =>
  (Math.round((BASE_CENTS * (10000 + bp)) / 10000) / 100).toFixed(2);
export const offLabel = (bp: number): string =>
  (bp < 0 ? '-' : '+') + Math.abs(bp / 100).toFixed(2) + '% vs current price';
export const num = (raw: string): number => parseFloat(raw) || 0;

export function initialTwapState(): TwapState {
  return { offBp: START_BP, price: priceAt(START_BP) };
}

export function offText(s: TwapState): string {
  return num(s.price) === 0 ? 'Enter a price' : offLabel(s.offBp);
}

/** Bấm chip: cộng % vào mức chênh đang có. Giá đang trống thì bắt đầu từ giá hiện tại. */
export function applyChip(s: TwapState, deltaBp: number): TwapState {
  const base = num(s.price) === 0 ? 0 : s.offBp;
  const offBp = base + deltaBp;
  return { offBp, price: priceAt(offBp) };
}

/** Gõ Max price bằng tay: tính lại mức chênh (làm tròn 0.01%). */
export function typePrice(raw: string): TwapState {
  const v = num(raw);
  return { price: raw, offBp: v === 0 ? 0 : Math.round((v / (BASE_CENTS / 100) - 1) * 10000) };
}

export interface TwapMeta {
  empty: boolean;
  warn: boolean;
  costText: string;
  feeText: string;
}

export function twapMeta(s: TwapState): TwapMeta {
  const empty = num(s.price) === 0;
  const cost = num(s.price) * QTY;
  return {
    empty,
    warn: !empty && s.offBp >= WARN_BP,
    costText: empty ? '--' : fmt2(cost) + ' USDT',
    feeText: empty ? '--' : '≈ ' + fmt2(cost * FEE) + ' USDT',
  };
}

/** Version 1: cùng điểm bắt đầu, không bao giờ cảnh báo. */
export function twapV1() {
  const price = priceAt(START_BP);
  const meta = twapMeta({ offBp: START_BP, price });
  return { price, off: offLabel(START_BP), costText: meta.costText, feeText: meta.feeText };
}
