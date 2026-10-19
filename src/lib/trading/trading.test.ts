// Chạy: npm test  (dùng node:test có sẵn, không cần cài thêm gì)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fmt2, fmtRaw, trimBtc, sanitizeNumber } from './format.ts';
import { snapPct, stepPct, pctFromPointer } from './slider.ts';
import * as amount from './amount.ts';
import * as limit from './limit.ts';
import * as twap from './twap.ts';

test('format: số, dấu phẩy, BTC', () => {
  assert.equal(fmt2(6218.86), '6,218.86');
  assert.equal(fmtRaw('6218.86'), '6,218.86');
  assert.equal(fmtRaw('6218.'), '6,218.');
  assert.equal(fmtRaw(''), '');
  assert.equal(trimBtc(0.0907), '0.0907');
  assert.equal(trimBtc(0.5), '0.5');
  assert.equal(trimBtc(0), '');
});

test('sanitizeNumber: chỉ số và một dấu chấm, giới hạn số lẻ, "." đầu thành "0."', () => {
  assert.equal(sanitizeNumber('12a3.4.5', 8, 2).raw, '123.45');
  assert.equal(sanitizeNumber('1.23456', 7, 4).raw, '1.2345');
  assert.equal(sanitizeNumber('.5', 2, 2).raw, '0.5');
  assert.equal(sanitizeNumber('0005', 4, 2).raw, '5');
  assert.equal(sanitizeNumber('12345678901', 11, 2).raw, '123456789');
  const e = sanitizeNumber('1234', 4, 2);
  assert.deepEqual(e, { raw: '1234', display: '1,234', caret: 5 });
});

test('slider: hít mốc, bước 5%, vị trí con trỏ', () => {
  assert.equal(snapPct(0.51), 0.5);
  assert.equal(snapPct(0.4), 0.4);
  assert.equal(snapPct(2), 1);
  assert.equal(stepPct(0.5, 1), 0.55);
  assert.equal(stepPct(0, -1), 0);
  assert.equal(pctFromPointer(103, 0, 206), 0.5);
});

test('amount: 6,218.86 USDT ⇄ 0.0907 BTC, phí 6.22', () => {
  const s = amount.initialAmountState();
  assert.equal(s.unit, 'USDT');
  assert.equal(amount.totalText(s), '≈ 0.0907 BTC');
  assert.equal(amount.amountMeta(s).feeText, '≈ 6.22 USDT');
  const b = amount.toggleUnit(s);
  assert.deepEqual([b.unit, b.raw], ['BTC', '0.0907']);
  assert.equal(amount.totalText(b), '≈ 6,218.86 USDT');
  const back = amount.toggleUnit(b);
  assert.deepEqual([back.unit, back.raw], ['USDT', '6218.86']);
});

test('amount: rỗng, vượt số dư, thanh trượt', () => {
  const empty = { unit: 'USDT' as const, raw: '', pct: 0 };
  assert.equal(amount.totalText(empty), '--');
  assert.equal(amount.amountMeta(empty).empty, true);
  assert.equal(amount.amountMeta({ ...empty, raw: '20000' }).over, true);
  assert.equal(amount.amountMeta({ ...empty, raw: '12450' }).over, false);
  assert.equal(amount.toggleUnit(empty).raw, '');
  assert.equal(amount.applyPct(empty, 0.5).raw, '6225.00');
  assert.equal(amount.applyPct({ ...empty, unit: 'BTC' }, 0.5).raw, '0.0907');
});

test('limit: giá mặc định 67,879.47, Total 6,177.03', () => {
  const s = limit.initialLimitState();
  assert.equal(s.price, '67879.47');
  assert.equal(limit.offText(s), '-1.00% vs current price');
  const m = limit.limitMeta(s, false);
  assert.equal(m.totalText, '6,177.03 USDT');
  assert.equal(m.feeText, '≈ 6.18 USDT');
});

test('limit: chip cộng dồn -1% rồi -5% → 63,765.56, Total 5,802.67', () => {
  let s = limit.initialLimitState();
  s = limit.applyChip(s, -1);
  assert.equal(s.price, '67193.82');
  assert.equal(limit.offText(s), '-2.00% vs current price');
  s = limit.applyChip(s, -5);
  assert.equal(s.price, '63765.56');
  assert.equal(limit.limitMeta(s, false).totalText, '5,802.67 USDT');
});

test('limit: mười lần -5% dừng ở sàn 34,282.56, chip khoá', () => {
  let s = limit.initialLimitState();
  for (let i = 0; i < 10; i++) s = limit.applyChip(s, -5);
  assert.equal(s.price, '34282.56');
  assert.equal(limit.offText(s), 'Max -50.00% reached');
  assert.equal(limit.limitMeta(s, false).chipsDisabled, true);
  assert.equal(limit.MIN_PRICE_TEXT, '34,282.56');
});

test('limit: gõ 30,000 báo giá thấp quá; giá trống thì chip bắt đầu từ giá hiện tại', () => {
  let s = limit.typePrice(limit.initialLimitState(), '30000');
  assert.equal(limit.limitMeta(s, false).low, true);
  s = limit.typePrice(s, '');
  assert.equal(limit.offText(s), 'Enter a price');
  assert.equal(limit.limitMeta(s, false).empty, true);
  assert.equal(limit.applyChip(s, -1).price, '67879.47');
});

test('limit: bấm giá Buy đặt lại -1%; thanh trượt độc lập với giá', () => {
  let s = limit.applyChip(limit.initialLimitState(), -5);
  s = limit.fillFromQuote(s);
  assert.deepEqual([s.price, s.offBp], ['67879.47', -100]);
  assert.equal(limit.limitMeta(limit.applyChip(s, -2), false).pct, 0.5);
  assert.equal(limit.amountForPct(s, 0.5), '0.0917');
});

test('limit: vượt số dư', () => {
  const s = { ...limit.initialLimitState(), amount: '1' };
  assert.equal(limit.limitMeta(s, true).over, true);
});

test('twap: mở ở 73,364.68 (+7.00%), Max cost 6,624.83 USDT, có cảnh báo', () => {
  const s = twap.initialTwapState();
  assert.equal(s.price, '73364.68');
  assert.equal(twap.offText(s), '+7.00% vs current price');
  const m = twap.twapMeta(s);
  assert.equal(m.costText, '6,624.83 USDT');
  assert.equal(m.feeText, '≈ 6.62 USDT');
  assert.equal(m.warn, true);
  assert.equal(twap.twapV1().price, '73364.68');
});

test('twap: +2% → 74,735.98 (+9.00%); gõ 70,000 → +2.09%, hết cảnh báo; chip leo lại +7%', () => {
  let s = twap.applyChip(twap.initialTwapState(), 200);
  assert.equal(s.price, '74735.98');
  assert.equal(twap.offText(s), '+9.00% vs current price');
  assert.equal(twap.twapMeta(s).warn, true);
  s = twap.typePrice('70000');
  assert.equal(twap.offText(s), '+2.09% vs current price');
  assert.equal(twap.twapMeta(s).warn, false);
  for (let i = 0; i < 4; i++) s = twap.applyChip(s, 100);
  assert.equal(s.offBp, 609);
  s = twap.applyChip(s, 100);
  assert.equal(s.offBp, 709);
  assert.equal(twap.twapMeta(s).warn, true);
});

test('twap: giá trống → "--", chip bắt đầu từ giá hiện tại', () => {
  const s = twap.typePrice('');
  assert.equal(twap.offText(s), 'Enter a price');
  assert.equal(twap.twapMeta(s).costText, '--');
  assert.equal(twap.applyChip(s, 50).price, '68907.95');
});
