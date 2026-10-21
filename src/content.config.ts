// content.config.ts – "bản quy định" cho các file Markdown trong thư mục content/.
// Mỗi file .md có phần thông tin ở đầu (nằm giữa hai dòng ---). File này quy định
// phần thông tin đó gồm những trường nào. Nếu bạn quên một trường bắt buộc,
// Astro sẽ báo lỗi rõ ràng thay vì để trang bị hỏng im lặng.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Dùng chung cho dự án chính (work) và dự án nhỏ (fun) để hai loại thẻ giống nhau.
const projectSchema = z.object({
  title: z.string(),                  // tên dự án
  role: z.string(),                   // vai trò, ví dụ "Lead Product Designer"
  scope: z.string().optional(),       // (không còn hiển thị trên trang) phạm vi, ví dụ "0 → 1, Mobile app"
  year: z.coerce.string().optional(), // năm, ví dụ 2026, hiện ở khối thông tin của case study
  platform: z.string().optional(),    // nền tảng, ví dụ Mobile, hiện ở khối thông tin của case study
  tags: z.array(z.string()).default([]), // tag kỹ năng
  description: z.string(),            // một dòng mô tả hiện trên thẻ
  order: z.number().default(100),     // số nhỏ đứng trước (case study đầu tiên = 1)
  draft: z.boolean().default(false),  // true = ẩn khỏi trang
  link: z.string().optional(),        // (chỉ dành cho fun) link ngoài nếu có
  demo: z.string().optional(),        // (chỉ dành cho fun) file demo tĩnh trong public/; có thì thẻ mở trang /fun-projects/<tên file>
  stack: z.string().optional(),       // (chỉ dành cho fun) một dòng công nghệ, hiện dưới mô tả ở trang chi tiết
  cover: z.string().optional(),       // ảnh cover, ví dụ /images/work/spot-trading-cover.webp (file đặt trong public/)
  coverAlt: z.string().default(''),   // mô tả ảnh cho người dùng đọc màn hình
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/work' }),
  schema: projectSchema,
});

const fun = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/fun' }),
  schema: projectSchema,
});

// Các trang văn bản thường (hiện tại: About).
// Phần thông tin đầu file gồm tiêu đề và danh sách Experience; phần thân là đoạn giới thiệu.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    approach: z
      .array(
        z.object({
          name: z.string(), // tên bước, ví dụ "Explore"
          icon: z.enum(['compass', 'rocket', 'bulb', 'refresh']), // icon hiện cạnh tên
        })
      )
      .default([]),
    experience: z
      .array(
        z.object({
          period: z.string(),   // ví dụ "2018 — 2026"
          label: z.string(),    // ví dụ "Into Web3 and fintech"
          items: z.array(
            z.object({
              dates: z.string(),            // ví dụ "05/2025 — 09/2026"
              company: z.string(),
              companyNote: z.string().optional(), // ví dụ "Contractor"
              role: z.string(),
              field: z.string().optional(), // ví dụ "Digital Asset Solutions"
            })
          ),
        })
      )
      .default([]),
  }),
});

export const collections = { work, fun, pages };
