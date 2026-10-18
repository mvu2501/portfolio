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
  scope: z.string(),                  // phạm vi, ví dụ "0 → 1, Mobile app"
  tags: z.array(z.string()).default([]), // tag kỹ năng
  description: z.string(),            // một dòng mô tả hiện trên thẻ
  order: z.number().default(100),     // số nhỏ đứng trước (Aura = 1)
  draft: z.boolean().default(false),  // true = ẩn khỏi trang
  link: z.string().optional(),        // (chỉ dành cho fun) link ngoài nếu có
  cover: z.string().optional(),       // ảnh cover, ví dụ /images/work/aura-cover.jpg (file đặt trong public/)
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
// Phần thông tin đầu file gồm tiêu đề và 4 bước Process; phần thân là đoạn giới thiệu.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    process: z
      .array(z.object({ name: z.string(), text: z.string() }))
      .default([]),
  }),
});

export const collections = { work, fun, pages };
