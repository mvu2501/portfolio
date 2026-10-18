// rehype-outcome.mjs – plugin nhỏ chạy lúc build, biến mục Outcome thành 4 khung.
// Trong Markdown, dưới "## Outcome" mỗi "### Tiêu đề" cùng nội dung theo sau nó
// sẽ được gói vào một khối <div class="outcome-card">, và tất cả khối được gói
// vào <div class="outcome-grid"> để CSS xếp thành lưới. Bạn không cần sửa file này.

const isEl = (node, tag) => node.type === 'element' && node.tagName === tag;
const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');
const div = (className, children) => ({
  type: 'element',
  tagName: 'div',
  properties: { className: [className] },
  children,
});

export default function rehypeOutcome() {
  return (tree) => {
    const nodes = tree.children;
    const start = nodes.findIndex(
      (n) => isEl(n, 'h2') && textOf(n).trim().toLowerCase() === 'outcome'
    );
    if (start === -1) return;

    let end = nodes.findIndex((n, i) => i > start && isEl(n, 'h2'));
    if (end === -1) end = nodes.length;

    const intro = []; // nội dung nằm trước ### đầu tiên (ví dụ ghi chú hướng dẫn)
    const cards = [];
    let current = null;
    for (const node of nodes.slice(start + 1, end)) {
      if (isEl(node, 'h3')) {
        current = div('outcome-card', [node]);
        cards.push(current);
      } else if (current) {
        current.children.push(node);
      } else {
        intro.push(node);
      }
    }
    if (cards.length === 0) return;

    nodes.splice(start + 1, end - start - 1, ...intro, div('outcome-grid', cards));
  };
}
