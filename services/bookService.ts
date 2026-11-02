import type { Book, Review } from "@/lib/types";
export type { Book, Review } from "@/lib/types";
export interface CreateBookInput {
  title: string;
  author: string;
  publishedAt?: string;
  coverUrl?: string | null;
}
export type UpdateBookInput = Partial<CreateBookInput>;
export interface CreateReviewInput {
  rating: number;
  content: string;
}
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// เรียก NestJS โดยตรงได้ทั้งบน server และ browser จึงไม่ต้องมี app/api ตัวกลาง
// NEXT_PUBLIC_ หมายถึง URL นี้เปิดเผยให้ browser ใช้ได้ ห้ามใส่ข้อมูลลับไว้ในตัวแปรนี้
async function request<T>(
  path: string,
  method = "GET",
  data?: unknown,
): Promise<T> {
  // T คือชนิดข้อมูลที่ผู้เรียกคาดว่าจะได้ เช่น Book หรือ Book[] ช่วยตรวจชนิดตอนเขียนโค้ด
  let response: Response | undefined;
  // หลัง backend restart การเชื่อมต่อเดิมอาจขาด ลอง GET ซ้ำได้หนึ่งครั้งเพราะไม่เปลี่ยนข้อมูล
  // ห้าม retry POST/PATCH/DELETE อัตโนมัติ เพราะอาจบันทึกสำเร็จแล้วและทำข้อมูลซ้ำ
  const attempts = method === "GET" ? 2 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      response = await fetch(`${BASE_URL}/books${path}`, {
        // ไม่ใช้ข้อมูลเก่าใน cache และยกเลิกคำขอเมื่อรอเกิน 10 วินาที
        method,
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
        ...(data !== undefined
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          : {}),
      });
      break;
    } catch {
      // ลองใหม่เฉพาะปัญหาเครือข่าย ส่วน HTTP 4xx/5xx จัดการด้านล่างตามสถานะจริง
    }
  }
  if (!response) {
    throw new ApiError(
      "เชื่อมต่อ backend ไม่สำเร็จ กรุณาตรวจสอบ backend และ NEXT_PUBLIC_API_URL",
      502,
    );
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    // NestJS อาจส่ง message เป็นข้อความเดียวหรือ array ของข้อผิดพลาด
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;
    throw new ApiError(
      message || `ดำเนินการไม่สำเร็จ (${response.status})`,
      response.status,
    );
  }
  return response.json();
}

function validateBook(data: UpdateBookInput) {
  if (data.title !== undefined && !data.title.trim())
    throw new Error("กรุณากรอกชื่อหนังสือ");
  if (data.author !== undefined && !data.author.trim())
    throw new Error("กรุณากรอกชื่อผู้เขียน");
  if (data.coverUrl && !/^https?:\/\//i.test(data.coverUrl))
    throw new Error("URL รูปปกต้องขึ้นต้นด้วย http:// หรือ https://");
  if (data.publishedAt && !Number.isFinite(Date.parse(data.publishedAt)))
    throw new Error("วันที่เผยแพร่ไม่ถูกต้อง");
}

export const bookService = {
  getBooks: () => request<Book[]>(""),
  async getBookById(id: number | string): Promise<Book | null> {
    try {
      return await request<Book>(`/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
  async createBook(data: CreateBookInput) {
    validateBook(data);
    return request<Book>("", "POST", data);
  },
  async updateBook(id: number | string, data: UpdateBookInput) {
    validateBook(data);
    return request<Book>(`/${id}`, "PATCH", data);
  },
  deleteBook: (id: number | string) => request<Book>(`/${id}`, "DELETE"),
  addReview(id: number | string, data: CreateReviewInput) {
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5)
      throw new Error("คะแนนต้องเป็นจำนวนเต็ม 1–5");
    if (!data.content.trim()) throw new Error("กรุณาเขียนความคิดเห็น");
    return request<Review>(`/${id}/reviews`, "POST", {
      ...data,
      content: data.content.trim(),
    });
  },
};
