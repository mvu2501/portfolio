// Hàm thuần để định dạng số và xử lý ô nhập số (không đụng tới DOM nên test được bằng node).

export function fmt2(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function commas(s: string): string {
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** "6218.86" → "6,218.86". Giữ nguyên dấu chấm đang gõ dở ("6218." → "6,218."). */
export function fmtRaw(raw: string): string {
  if (raw === '') return '';
  const p = raw.split('.');
  return p.length > 1 ? commas(p[0]) + '.' + p[1] : commas(p[0]);
}

/** Số BTC: tối đa 4 số lẻ, bỏ số 0 thừa ở cuối. Giá trị <= 0 → chuỗi rỗng. */
export function trimBtc(n: number): string {
  return n <= 0 ? '' : n.toFixed(4).replace(/\.?0+$/, '');
}

export interface NumberEdit {
  /** Chuỗi số sạch, không có dấu phẩy ("6218.86") */
  raw: string;
  /** Chuỗi hiển thị trong ô nhập ("6,218.86") */
  display: string;
  /** Vị trí con trỏ mới trong `display` */
  caret: number;
}

/**
 * Làm sạch nội dung vừa gõ: chỉ số và một dấu chấm, giới hạn số lẻ (`decimals`),
 * tối đa 9 chữ số phần nguyên, "." đầu thành "0.", thêm dấu phẩy ngăn nghìn,
 * và tính lại vị trí con trỏ để không bị nhảy.
 */
export function sanitizeNumber(value: string, caretPos: number, decimals: number): NumberEdit {
  let before = value.slice(0, caretPos).replace(/[^0-9.]/g, '').length;
  let raw = value.replace(/[^0-9.]/g, '');
  const dot = raw.indexOf('.');
  if (dot >= 0) raw = raw.slice(0, dot + 1) + raw.slice(dot + 1).replace(/\./g, '').slice(0, decimals);
  const parts = raw.split('.');
  parts[0] = parts[0].replace(/^0+(?=\d)/, '').slice(0, 9);
  raw = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
  if (raw.charAt(0) === '.') {
    raw = '0' + raw;
    before += 1;
  }
  const display = fmtRaw(raw);
  let count = 0;
  let i = 0;
  while (i < display.length && count < Math.min(before, raw.length)) {
    if (/[0-9.]/.test(display.charAt(i))) count++;
    i++;
  }
  return { raw, display, caret: i };
}
