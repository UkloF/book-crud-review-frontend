import { BookOpen, MessageSquareText, Star } from "lucide-react";
import { bookService } from "@/services/bookService";
import { average } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BookList } from "@/components/BookList";
import { LazyRatings } from "@/components/lazy-ratings";
// สร้างหน้าตอนมีคำขอจริง ไม่เรียก backend ระหว่าง build จึง build ได้แม้ยังไม่เปิด API
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  // page เป็น Server Component จึง await API ได้ และส่งเฉพาะข้อมูลให้ส่วนที่โต้ตอบได้
  const books = await bookService.getBooks();
  const reviews = books.flatMap((book) => book.reviews);
  const stats = [
    { label: "หนังสือทั้งหมด", value: books.length, icon: BookOpen },
    { label: "รีวิวทั้งหมด", value: reviews.length, icon: MessageSquareText },
    { label: "คะแนนเฉลี่ย", value: average(reviews) || "—", icon: Star },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>ภาพรวม</h1>
          <p>ดูแลคลังหนังสือ เก็บทุกเรื่องราวไว้ในที่เดียว</p>
        </div>
        <Link
          href="/books/add"
          className={buttonVariants({ className: "action-button" })}
        >
          เพิ่มหนังสือ
        </Link>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <Card className="stat-card" key={stat.label}>
            <span className="stat-icon">
              <stat.icon />
            </span>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </div>
          </Card>
        ))}
      </div>
      <div className="dashboard-grid">
        <BookList books={books} />
        <LazyRatings books={books} />
      </div>
    </>
  );
}
