import { bookService } from "@/services/bookService";
import { BookList } from "@/components/BookList";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export const metadata = { title: "หนังสือทั้งหมด" };
export const dynamic = "force-dynamic";
export default async function BooksPage() {
  const books = await bookService.getBooks();
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>หนังสือทั้งหมด</h1>
          <p>ทุกเล่ม ทุกผู้เขียน และความคิดเห็นของคุณ</p>
        </div>
        <Link
          href="/books/add"
          className={buttonVariants({ className: "action-button" })}
        >
          เพิ่มหนังสือ
        </Link>
      </div>
      <BookList books={books} />
    </>
  );
}
