// Logic thuần của thanh trượt phân bổ số dư (các mốc 0/25/50/75/100%).

export const SLIDER_STOPS = [0, 25, 50, 75, 100];

/** Giới hạn 0–1 và hít vào mốc gần nhất nếu cách dưới 2%. */
export function snapPct(p: number): number {
  let v = Math.max(0, Math.min(1, p));
  [0, 0.25, 0.5, 0.75, 1].forEach((s) => {
    if (Math.abs(v - s) < 0.02) v = s;
  });
  return v;
}

/** Từ vị trí con trỏ chuột trên thanh (trừ 3px là nửa chấm tròn) ra tỉ lệ 0–1. */
export function pctFromPointer(clientX: number, left: number, width: number): number {
  return snapPct((clientX - left - 3) / (width - 6));
}

/** Phím mũi tên: mỗi lần nhích 5%. `dir` là +1 hoặc -1. */
export function stepPct(current: number, dir: 1 | -1): number {
  return Math.max(0, Math.min(1, Math.round((current + dir * 0.05) * 20) / 20));
}

/** Mốc `stop` (0–100) sáng màu khi nằm trong khoảng đã chọn. */
export function stopIsOn(stop: number, pct: number): boolean {
  return stop / 100 <= pct + 1e-9;
}

/** Số USDT tương ứng với `p` của số dư khả dụng, làm tròn xuống 2 số lẻ. */
export function usdtForPct(avail: number, p: number): number {
  return Math.floor(avail * p * 100 + 1e-6) / 100;
}
