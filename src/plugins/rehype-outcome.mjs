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

// ---- Chế độ "visual" (frontmatter có layout: visual): trang thiên về hình ảnh ----
// - bỏ tiêu đề # và câu mô tả đầu thân bài (đã có ở phần đầu trang); giữ ảnh cover (rộng hết cột)
// - các dòng "Role: / Client: / Scope: / Worked with:" thành khối nhỏ <dl class="occ-meta">
// - dưới Outcome, mỗi ### là một dự án: tiêu đề, dòng mô tả, rồi các ảnh xếp thành hàng
// - ảnh tải trễ (lazy), trừ ảnh cover
const blank = (n) => n.type === 'text' && n.value.trim() === '';
const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const imgOf = (n) => (isEl(n, 'p') ? n.children.find((c) => isEl(c, 'img')) : null);

function metaList(p) {
  const rows = [];
  let key = null;
  let val = [];
  const flush = () => {
    if (key) rows.push(el('div', {}, [el('dt', {}, [{ type: 'text', value: key }]), el('dd', {}, val)]));
  };
  for (const c of p.children) {
    if (isEl(c, 'strong') && textOf(c).trim().endsWith(':')) {
      flush();
      key = textOf(c).trim().slice(0, -1);
      val = [];
    } else if (key && !blank(c)) {
      val.push(c.type === 'text' ? { ...c, value: c.value.trim() } : c);
    }
  }
  flush();
  return el('dl', { className: ['occ-meta'] }, rows);
}

function visual(tree) {
  let nodes = tree.children;

  // 1. bỏ h1 và đoạn mô tả ngay sau nó
  const h1 = nodes.findIndex((n) => isEl(n, 'h1'));
  if (h1 !== -1) {
    let i = h1 + 1;
    while (i < nodes.length && (blank(nodes[i]) || nodes[i].type === 'raw')) i++;
    const drop = isEl(nodes[i], 'p') && !imgOf(nodes[i]) ? i - h1 + 1 : 1;
    nodes.splice(h1, drop);
  }

  // 2. ảnh cover (ảnh đầu tiên) và khối thông tin
  const cover = nodes.find((n) => imgOf(n));
  if (cover) {
    cover.properties = { ...cover.properties, className: ['occ-cover'] };
    delete imgOf(cover).properties.loading;
  }
  const meta = nodes.findIndex((n) => isEl(n, 'p') && isEl(n.children[0], 'strong') && /^Role/.test(textOf(n.children[0])));
  if (meta !== -1) nodes[meta] = metaList(nodes[meta]);

  // 3. Outcome và Reflection: mỗi ### thành một khối (tiêu đề, mô tả, ảnh)
  for (const sectionName of ['outcome', 'reflection']) {
  const start = nodes.findIndex((n) => isEl(n, 'h2') && textOf(n).trim().toLowerCase() === sectionName);
  if (start !== -1) {
    let end = nodes.findIndex((n, i) => i > start && isEl(n, 'h2'));
    if (end === -1) end = nodes.length;
    const out = [];
    let project = null;
    let loose = null;
    for (const n of nodes.slice(start + 1, end)) {
      if (blank(n)) continue;
      if (isEl(n, 'h3')) {
        project = { head: [n], shots: [] };
        out.push(project);
      } else if (isEl(n, 'hr')) {
        out.push(n);
        project = null;
        loose = null;
      } else if (!project && imgOf(n)) {
        // ảnh nằm ngay dưới Outcome (không có ### dự án): gom thành một hàng ảnh
        if (!loose) {
          loose = el('div', { className: ['occ-shots'] }, []);
          out.push(loose);
        }
        loose.children.push(el('figure', {}, [imgOf(n)]));
      } else if (!project) {
        out.push(n);
      } else if (imgOf(n)) {
        project.shots.push(el('figure', {}, [imgOf(n)]));
      } else if (n.type !== 'raw') {
        project.head.push(n);
      }
    }
    const built = out.map((o) =>
      o.head
        ? el('section', { className: ['occ-project'] }, [...o.head, el('div', { className: ['occ-shots'] }, o.shots)])
        : o
    );
    nodes.splice(start + 1, end - start - 1, ...built);
  }
  }

  // 4. mọi ảnh (trừ cover) tải trễ; bảng được gắn class để có kiểu riêng
  const walk = (n) => {
    if (isEl(n, 'table')) n.properties = { ...n.properties, className: ['occ-table'] };
    if (isEl(n, 'img') && n !== imgOf(cover)) {
      n.properties = { ...n.properties, loading: 'lazy', decoding: 'async' };
    }
    // Dòng xuống hàng trong đoạn văn (ví dụ các dòng Client / Design / Worked with ở Credit) được giữ nguyên
    if (isEl(n, 'p') && n.children.some((c) => c.type === 'text' && c.value.includes('\n') && c.value.trim() !== '')) {
      n.children = n.children.flatMap((c) =>
        c.type === 'text' && c.value.trim() !== ''
          ? c.value
              .split('\n')
              .flatMap((part, i) => (i === 0 ? [{ type: 'text', value: part }] : [el('br', {}, []), { type: 'text', value: part }]))
          : [c]
      );
    }
    (n.children ?? []).forEach(walk);
  };
  tree.children.forEach(walk);
}

export default function rehypeOutcome() {
  return (tree, file) => {
    if (file?.data?.astro?.frontmatter?.layout === 'visual') return visual(tree);
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
