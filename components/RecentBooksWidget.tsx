"use client";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BookCover } from "@/components/book-cover";
import type { Book } from "@/lib/types";
export default function RecentBooksWidget({ books }: { books: Book[] }) {
  // รวมรีวิวจากหนังสือทุกเล่มเป็น array เดียว และแนบข้อมูลหนังสือไว้สร้างลิงก์กลับ
  const reviews = books.flatMap((book) =>
    book.reviews.map((review) => ({ ...review, book })),
  );
  // Backend ไม่มีวันสร้างรีวิว จึงใช้ id ที่เพิ่มขึ้นเรียงรีวิวล่าสุด และคัดลอกก่อน sort เพื่อไม่แก้ props
  const latest = [...reviews].sort((a, b) => b.id - a.id).slice(0, 3);
  return (
    <Card className="ratings-panel">
      <h2>ภาพรวมคะแนน</h2>
      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = reviews.filter(
            (review) => review.rating === rating,
          ).length;
          return (
            <div className="bar-row" key={rating}>
              <span>{rating} ดาว</span>
              <div
                className="bar-track"
                role="meter"
                aria-label={`${rating} ดาว`}
                aria-valuemin={0}
                aria-valuemax={Math.max(reviews.length, 1)}
                aria-valuenow={count}
              >
                <div
                  style={{
                    width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{count}</span>
            </div>
          );
        })}
      </div>
      <div className="review-heading">
        <h2>รีวิวล่าสุด</h2>
      </div>
      {latest.length ? (
        latest.map((review) => (
          <Link
            href={`/books/${review.bookId}`}
            className="recent-review"
            key={review.id}
          >
            <BookCover book={review.book} />
            <div>
              <h3>{review.book.title}</h3>
              <span className="rating">
                <Star />
                {review.rating}.0
              </span>
              <p>{review.content}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="muted text-sm leading-7">
          ยังไม่มีรีวิว เลือกหนังสือสักเล่มแล้วแบ่งปันความคิดเห็นแรกของคุณ
        </p>
      )}
    </Card>
  );
}
