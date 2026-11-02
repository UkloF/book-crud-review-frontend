# Book CRUD Review Frontend

Next.js App Router + TypeScript + shadcn/ui สำหรับ backend `book-crud-with-review` (NestJS + Prisma)
จัดโครงสร้างคล้าย `D:\book-crud-frontend` โดยแยกหน้า, component และ service อย่างชัดเจน

## เริ่มใช้งาน

เปิด backend ใน PowerShell อีกหน้าต่าง:

```powershell
cd 'D:\ไนพา\webapp\backend\book-crud-with-review'
npm install
$env:DATABASE_URL = 'file:./dev.db'
npx prisma generate
npm run start:dev
```

ฐานข้อมูล `prisma/dev.db` มีอยู่แล้ว หากเริ่มฐานข้อมูลใหม่ ใช้ `npx prisma db push` หลังตั้ง DATABASE_URL
backend ใช้พอร์ต 5000 และเปิด CORS ไว้แล้ว

เปิด frontend:

```powershell
cd 'D:\ไนพา\webapp\frontend-2\book-crud-review-frontend'
npm install
Copy-Item .env.example .env.local
npm run dev
```

เข้า http://localhost:3000

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Service เรียก NestJS ตรงทั้ง Server Component และ Client Component ไม่ต้องมี `app/api/books/route.ts`
เมื่อเปลี่ยน `.env.local` ให้ restart dev server; production ต้อง build ใหม่เพราะ NEXT_PUBLIC_ ถูกฝังใน JavaScript
หากเปิดจากเครื่องอื่น ให้ใช้ IP/โดเมน backend ที่ทั้ง Next.js server และ browser เข้าถึงได้แทน localhost

## โครงสร้าง

```text
app/
  layout.tsx              โครงหลักและเมนูที่คงอยู่เมื่อเปลี่ยนหน้า
  template.tsx            เริ่ม animation ใหม่ในแต่ละ route
  page.tsx                Dashboard: จำนวนหนังสือ รีวิว และคะแนนเฉลี่ย
  loading.tsx             Skeleton ระหว่าง Server Component รอ API
  error.tsx               Error Boundary พร้อมลองใหม่
  not-found.tsx           หน้าที่ไม่มีอยู่ หรือ ID หนังสือไม่พบ
  books/
    page.tsx              รายการหนังสือ (Server Component)
    loading.tsx
    error.tsx
    add/page.tsx          หน้าเพิ่มหนังสือ
    [id]/page.tsx         รายละเอียด แก้ไข ลบ และเพิ่มรีวิว
components/
  BookList.tsx            ค้นหาและแบ่งหน้าใน browser
  RecentBooksWidget.tsx   ภาพรวมคะแนนและรีวิวล่าสุด
  lazy-ratings.tsx        next/dynamic + Skeleton fallback
  book-form.tsx           ฟอร์มเพิ่มหนังสือและ modal แก้ไข
  ReviewForm.tsx          ฟอร์มคะแนน 1–5 และความคิดเห็น
  DeleteBookButton.tsx    ยืนยันลบ และจัดการสถานะผิดพลาด
  app-shell.tsx           เมนูพร้อมแสดง route ปัจจุบัน
  ui/                     component จาก shadcn/ui
services/
  bookService.ts          รวม fetch, timeout, validation และ error ของ API
  index.ts                export service
lib/
  types.ts                ชนิด Book/Review และคำนวณคะแนนเฉลี่ย
  utils.ts                ตัวช่วยรวม CSS class
```

ส่วนที่ซับซ้อนมีคอมเมนต์ภาษาไทย: การแยก Server/Client, params แบบ Promise, generic, no-store, timeout, mutation/refetch, pagination และ lazy loading

## API ที่เชื่อมต่อ

| Service | API |
| --- | --- |
| getBooks | GET /books |
| getBookById | GET /books/:id (404 คืน null เพื่อเรียก notFound) |
| createBook | POST /books |
| updateBook | PATCH /books/:id |
| deleteBook | DELETE /books/:id |
| addReview | POST /books/:id/reviews |

Book: `id`, `title`, `author`, `publishedAt`, `coverUrl`, `reviews`
Review: `id`, `rating`, `content`, `bookId`
ไม่มีราคา, ISBN หรือจำนวนหนังสือให้ยืม เพราะ backend นี้ไม่รองรับฟิลด์เหล่านี้

## การไหลของข้อมูล

1. page.tsx เป็น Server Component: await bookService แล้วส่งข้อมูลให้ component
2. loading.tsx แสดง Skeleton ระหว่างรอ และ error.tsx รับข้อผิดพลาดที่ throw จากการ fetch
3. ส่วนค้นหา, pagination, ฟอร์ม และปุ่มเป็น Client Component เพราะต้องใช้ state/event
4. mutation ผ่าน service เมื่อสำเร็จจึง router.refresh() ให้ Server Component ดึงข้อมูลล่าสุด
5. API ยังไม่มี pagination จึงแบ่งข้อมูลฝั่ง client ครั้งละ 5 เล่ม ไม่มีการจำลอง network loading ตอนเปลี่ยนหน้า
6. หน้าดึงข้อมูลเป็น force-dynamic เพื่อ build ได้โดยไม่ต้องเปิด backend และโหลดข้อมูลใหม่ตอนเข้าหน้า
7. widget รีวิวแยกโหลดด้วย next/dynamic และมี Skeleton fallback

## ตรวจสอบ

```powershell
npm run lint
npm run typecheck
npm run build
npm run start
```

ทดสอบด้วย Chromium/Playwright กับ backend จริงแล้ว: เพิ่ม, แก้ไข, รีวิว, โหลดซ้ำ, ค้นหา, แบ่งหน้า, ยกเลิก/ยืนยันลบ, 404 และหน้าจอ 390px
ข้อมูลที่สร้างเพื่อทดสอบถูกลบหลังจบการทดสอบ
