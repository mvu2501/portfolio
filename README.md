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
│   ├── work/spot-trading.md  ← case study Spot trading (mỗi file .md = một dự án + một trang)
│   ├── fun/sample-project.md ← dự án nhỏ (chỉ hiện thẻ ở trang chủ)
│   └── pages/about.md        ← nội dung trang About (giới thiệu + 4 bước Process)
├── public/                   ← file giữ nguyên, truy cập thẳng bằng URL
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png ← biểu tượng tab (chữ V)
│   └── images/               ← ảnh cover và ảnh trong case study
├── src/
│   ├── pages/                ← mỗi file = một trang web
│   │   ├── index.astro       ← trang chủ "/"
│   │   ├── about.astro       ← trang "/about"
│   │   └── work/[slug].astro ← template case study "/work/<tên-file>"
│   ├── components/           ← các khối giao diện dùng lại
│   │   ├── Nav.astro         ← thanh điều hướng (+ menu mobile)
│   │   ├── Footer.astro      ← chân trang (email, mạng xã hội, lên đầu trang)
│   │   ├── ProjectCard.astro ← thẻ dự án
│   │   ├── CaseToc.astro     ← mục lục case study (sidebar + thanh ngang mobile)
│   │   ├── CaseNav.astro     ← "Up next / Previous" ở cuối case study
│   │   ├── Loader.astro      ← màn hình loading "Things designed by Vu."
│   │   └── DuckFootball.astro ← trò chơi Duck Football ở trang chủ (ngay dưới hero)
│   ├── config.ts             ← link Resume (Google Drive), dùng chung cho Nav và About
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
| Nội dung case study Spot trading | `content/work/spot-trading.md` |
| Tên, tag, mô tả trên thẻ dự án | Phần đầu (giữa hai dòng `---`) của file `.md` tương ứng |
| Role, Year, Platform ở đầu case study | Các dòng `role:`, `year:`, `platform:` ở phần đầu file `.md` (dòng nào bỏ trống thì mục đó không hiện) |
| Ảnh cover của thẻ (trang chủ) | Bỏ ảnh vào `public/images/work/` (hoặc `public/images/fun/`), rồi thêm `cover: /images/work/ten-anh.jpg` và `coverAlt: mô tả ảnh` vào phần đầu file `.md`. Khung cover có tỉ lệ 487 × 314, ảnh tự cắt cho vừa |
| Thêm dự án mới | Tạo thêm file `.md` trong `content/work/` hoặc `content/fun/` |
| Thứ tự thẻ, và thứ tự Up next / Previous ở cuối case study | Số `order` trong file `.md` (nhỏ đứng trước) |
| Ẩn dự án tạm thời | Thêm `draft: true` vào phần đầu file `.md` |
| Cho thẻ Fun bấm được (mặc định không bấm được) | Thêm `link: https://...` vào file `.md` của dự án đó |
| Trang About và 4 bước Process | `content/pages/about.md` |
| Email, mạng xã hội | `src/components/Footer.astro` |
| Link trên thanh điều hướng | `src/components/Nav.astro` |
| Màu sắc, khoảng cách | `src/styles/global.css`, khối `:root` |
| Tiêu đề/mô tả hiện trên Google | `src/layouts/BaseLayout.astro` |
| Link Resume (nút Resume ở Nav và About) | `src/config.ts`, biến `resumeUrl` |
| Trò chơi Duck Football | Toàn bộ nằm trong `src/components/DuckFootball.astro`: phần `<script>` là luật chơi và hình vẽ, phần `<style>` là bảng tỉ số, nút Replay và bảng GOAL. Muốn tắt tạm: xóa khối `<DuckFootball />` (và dòng `import`) trong `src/pages/index.astro` |

### Lưu ý khi viết case study
- Giữ nguyên **6 tiêu đề `##`**: Overview, Problem, Research, Design Decisions, Outcome, Reflections. Mục lục dùng tên này để nhảy tới đúng chỗ.
- Trong Outcome, giữ 4 tiêu đề `###`: Product, Experience, System, Collaboration.
- Dòng bắt đầu bằng `> **Hướng dẫn ...` là ghi chú nhắc việc, xóa khi viết xong.
- Chèn ảnh: bỏ ảnh vào `public/images/` rồi viết `![Mô tả ảnh](/images/ten-anh.png)`.

### Demo tương tác trong case study Trading

Ba phần "Amount input / Limit price / Price can move" trong `content/work/spot-trading.md` là các khối tương tác, chèn vào bài bằng dòng `<!-- demo:amount-input -->`, `<!-- demo:limit-price -->`, `<!-- demo:price-can-move -->` (mỗi dòng đứng riêng). Chữ copy nằm ở `src/components/trading/*.astro`, giao diện ở `src/styles/trading-demo.css`, logic tính toán (đổi USDT/BTC, %, định dạng số) ở `src/lib/trading/` và có test: chạy `npm test`.

### Sơ đồ Information architecture

Khối sơ đồ trong Research chèn bằng dòng `<!-- demo:information-architecture -->`. Nội dung chữ nằm trong `src/components/InformationArchitecture.astro` (dạng danh sách dữ liệu, sửa nhãn/chip ở đó), giao diện ở `src/styles/information-architecture.css`.

### Mockup điện thoại "Order types" (Design Decisions › Solution)

Mockup tương tác nằm ở mục Solution của Design Decisions (tiêu đề "Placing an order"), chèn bằng dòng `<!-- demo:order-types -->`. Markup ở `src/components/order-types/OrderTypesMockup.astro`, logic ở `src/scripts/order-types.ts`, giao diện ở `src/styles/order-types.css`. Chỉ Order form tương tác; khung máy luôn nền sáng như Figma.

### Mockup "Open orders & history" (Design Decisions › Solution)

Mockup thứ hai trong Solution, chèn bằng dòng `<!-- demo:open-orders -->`. Markup ở `src/components/order-types/OrdersMockup.astro`, logic và dữ liệu lệnh (`OPEN0`, `HIST`) ở `src/scripts/orders.ts`, giao diện ở `src/styles/orders.css`. Khung xám + tiêu đề có icon dùng chung với mockup Order types: `src/styles/mockup-frame.css`, `src/components/MockupHead.astro`.

### Ảnh trade-off (Design Decisions › Trade-offs)

Ba quyết định là ba ảnh `public/images/work/spot-trading-tradeoff-1…3.webp`, viết trực tiếp bằng HTML `<figure class="tradeoff wide">` trong `content/work/spot-trading.md`. Chữ trong ảnh được chép lại trong `<details>` bên dưới mỗi ảnh (cho screen reader và SEO). Nếu sửa chữ trong ảnh, nhớ sửa luôn chữ trong `<details>` và thuộc tính `alt`.

### Case study mới (ví dụ onchain-trading-mobile)

Thêm file `content/work/<tên>.md` là có trang mới. Mục lục bên cạnh tự lấy từ các tiêu đề `##` của bài (Spot Trading kết thúc bằng Reflections, Onchain Trading kết thúc bằng Credit). Ghi chú nội bộ dạng `<!-- ... -->` (nhắc NDA, chỗ đặt ảnh) không hiện ra trang công khai, và tiêu đề `###` chưa có nội dung tự ẩn. Cover chưa có file ảnh trong `public/images/work/` thì thẻ ở trang chủ hiện ô nền be, không bị ảnh vỡ.

### Case study thiên về hình ảnh (ví dụ hello-pal)
File `content/work/hello-pal.md` có dòng `layout: visual` ở phần đầu để bật bố cục hình ảnh: ảnh cover rộng, khối thông tin Role/Client/Scope, Outcome chia nhóm theo `###` (mỗi nhóm một hàng ảnh), ảnh tải trễ. Ảnh nằm trong `public/images/work/hello-pal/` (đuôi `.webp`). Sơ đồ động ở mục Research là `src/components/HelloPalFlow.astro`, chèn bằng dòng `<!-- demo:hello-pal-flow -->` trong file `.md`. Code xử lý bố cục nằm trong `src/plugins/rehype-outcome.mjs`; sau khi sửa file này nhớ xóa cache: `rm -rf .astro node_modules/.astro`.

## Style giao diện
Giao diện theo file style tham khảo (Yinyee Ho): nền kem `#FBF8F1`, chữ mực `#1F1D1A`, font **Inter Tight** (chữ thường) và **JetBrains Mono** (nút, nhãn, tag), góc vuông, đường kẻ đỏ gạch `#B7372B`, không bóng đổ. Mọi giá trị nằm ở khối `:root` trong `src/styles/global.css`.
Hai chỗ khác với file style gốc, có chủ ý: chữ phụ dùng `#6B6559` (đạt độ tương phản 4.5:1 thay vì `#8C8578`), và nội dung vẫn có chiều rộng tối đa 72rem thay vì tràn hết màn hình.

## Ngôn ngữ
Nội dung hiển thị trên site viết bằng **tiếng Anh**. Các chú thích trong code và file này viết bằng tiếng Việt để bạn dễ hiểu.

## Chưa làm (cố ý, theo yêu cầu)
- Nội dung thật (đang là placeholder, tìm chữ `THAY` trong code và `[Replace: ...]` trong nội dung).
