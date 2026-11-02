import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { bookService } from "@/services/bookService";
import { average } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { BookCover } from "@/components/book-cover";
import { BookForm } from "@/components/book-form";
import DeleteBookButton from "@/components/DeleteBookButton";
import ReviewForm from "@/components/ReviewForm";
export const dynamic = "force-dynamic";
export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js รุ่นปัจจุบันส่ง params เป็น Promise จึงต้อง await ก่อนอ่าน id
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const book = await bookService.getBookById(id);
  // แยกกรณีไม่พบหนังสือ (404) ออกจาก backend ล่ม ซึ่งจะไป error.tsx
  if (!book) notFound();
  return (
    <>
      <Link
        href="/books"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        กลับไปคลังหนังสือ
      </Link>
      <Card className="detail-card">
        <BookCover key={book.coverUrl} book={book} large />
        <div className="detail-info">
          <h1>{book.title}</h1>
          <p>เขียนโดย {book.author}</p>
          <p>
            เผยแพร่{" "}
            {new Date(book.publishedAt).toLocaleDateString("th-TH", {
              dateStyle: "long",
              timeZone: "UTC",
            })}
          </p>
          <p>
            <span className="rating">
              <Star />
              {average(book.reviews) || "ยังไม่มีคะแนน"}
            </span>{" "}
            · {book.reviews.length} รีวิว
          </p>
          <div className="detail-actions">
            <BookForm book={book} />
            <DeleteBookButton id={book.id} title={book.title} />
          </div>
        </div>
      </Card>
      <div className="reviews-layout">
        <Card className="review-card">
          <h2>ความคิดเห็นจากผู้อ่าน ({book.reviews.length})</h2>
          {book.reviews.length ? (
            [...book.reviews]
              .sort((a, b) => b.id - a.id)
              .map((review) => (
                <article className="review-item" key={review.id}>
                  <span className="rating">
                    <Star />
                    {review.rating}.0 / 5
                  </span>
                  <p>{review.content}</p>
                </article>
              ))
          ) : (
            <p className="muted text-sm leading-7">
              ยังไม่มีรีวิว มาเป็นคนแรกที่แบ่งปันความคิดเห็นกัน
            </p>
          )}
        </Card>
        <ReviewForm bookId={book.id} />
      </div>
    </>
  );
}
