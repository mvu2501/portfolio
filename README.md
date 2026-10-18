# vunguyen.me – Portfolio

Portfolio cá nhân dựng bằng [Astro](https://astro.build), CSS thuần, nội dung viết bằng Markdown.

## Chạy trên máy (Mac)

```bash
git clone https://github.com/mvu2501/portfolio.git   # lần đầu: tải code về
cd portfolio                                         # đi vào thư mục project
npm install                                          # tải thư viện (lần đầu, hoặc khi có gói mới)
npm run dev                                          # bật server xem thử → http://localhost:4321
```

Lần sau lấy code mới: `git pull`, rồi `npm install` (nếu có gói mới), rồi `npm run dev`.
Tắt server: `Ctrl + C`. Kiểm tra bản build: `npm run build` (kết quả nằm trong `dist/`).

## Sơ đồ thư mục

```
portfolio/
├── content/                  ← NỘI DUNG của bạn (Markdown) – sửa ở đây
│   ├── work/aura.md          ← case study Aura (mỗi file .md = một dự án + một trang)
│   ├── fun/duck-football.md  ← dự án nhỏ (chỉ hiện thẻ ở trang chủ)
│   └── pages/about.md        ← nội dung trang About (giới thiệu + 4 bước Process)
├── public/                   ← file giữ nguyên, truy cập thẳng bằng URL
│   └── resume.pdf            ← (CHƯA CÓ) bỏ CV của bạn vào đây với đúng tên này
├── src/
│   ├── pages/                ← mỗi file = một trang web
│   │   ├── index.astro       ← trang chủ "/"
│   │   ├── about.astro       ← trang "/about"
│   │   └── work/[slug].astro ← template case study "/work/<tên-file>"
│   ├── components/           ← các khối giao diện dùng lại
│   │   ├── Nav.astro         ← thanh điều hướng (+ menu mobile)
│   │   ├── Footer.astro      ← chân trang (email, mạng xã hội, lên đầu trang)
│   │   ├── ProjectCard.astro ← thẻ dự án
│   │   └── CaseToc.astro     ← mục lục case study (sidebar + thanh ngang mobile)
│   ├── layouts/BaseLayout.astro ← khung chung mọi trang (font, CSS, Nav, Footer)
│   ├── styles/global.css     ← màu, font, khoảng cách, nút (biến CSS ở khối :root)
│   ├── plugins/rehype-outcome.mjs ← gói mục Outcome thành 4 khung (không cần sửa)
│   └── content.config.ts     ← quy định các trường trong phần đầu file .md
├── astro.config.mjs          ← cấu hình Astro
└── package.json              ← danh sách thư viện và lệnh (npm run dev...)
```

## Muốn đổi gì thì sửa ở đâu

| Muốn đổi | Sửa ở |
|---|---|
| Câu định vị ở đầu trang chủ | `src/pages/index.astro` (chỗ có chú thích `THAY`) |
| Nội dung case study Aura | `content/work/aura.md` |
| Tên, vai trò, tag, mô tả trên thẻ dự án | Phần đầu (giữa hai dòng `---`) của file `.md` tương ứng |
| Thêm dự án mới | Tạo thêm file `.md` trong `content/work/` hoặc `content/fun/` |
| Thứ tự thẻ | Số `order` trong file `.md` (nhỏ đứng trước) |
| Ẩn dự án tạm thời | Thêm `draft: true` vào phần đầu file `.md` |
| Cho thẻ Fun bấm được | Thêm `link: https://...` vào file `.md` của dự án đó |
| Trang About và 4 bước Process | `content/pages/about.md` |
| Email, mạng xã hội | `src/components/Footer.astro` |
| Link trên thanh điều hướng | `src/components/Nav.astro` |
| Màu sắc, khoảng cách | `src/styles/global.css`, khối `:root` |
| Tiêu đề/mô tả hiện trên Google | `src/layouts/BaseLayout.astro` |
| CV | Bỏ file vào `public/resume.pdf` |
| Trò chơi duck-football | Gắn vào `<div id="duck-football">` trong `src/pages/index.astro` |

### Lưu ý khi viết case study
- Giữ nguyên **6 tiêu đề `##`**: Overview, Problem, Research, Design Decisions, Outcome, Reflections. Mục lục dùng tên này để nhảy tới đúng chỗ.
- Trong Outcome, giữ 4 tiêu đề `###`: Product, Experience, System, Collaboration.
- Dòng bắt đầu bằng `> **Hướng dẫn ...` là ghi chú nhắc việc, xóa khi viết xong.
- Chèn ảnh: bỏ ảnh vào `public/images/` rồi viết `![Mô tả ảnh](/images/ten-anh.png)`.

## Chưa làm (cố ý, theo yêu cầu)
- Deploy lên internet.
- Code trò chơi duck-football (mới có khung trống).
- File `public/resume.pdf` và nội dung thật (đang là placeholder, tìm chữ `THAY`).
