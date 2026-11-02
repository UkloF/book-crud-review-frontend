"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { BookCover } from "@/components/book-cover";
import { average, type Book } from "@/lib/types";
// Backend นี้ยังไม่มี API แบ่งหน้า จึงรับรายการทั้งหมดมาแบ่งแสดงครั้งละ 5 เล่มใน browser
export function BookList({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = books.filter((book) =>
    `${book.title} ${book.author}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  // หลังค้นหาหรือลบ จำนวนหน้าอาจลดลง ต้องไม่ให้หน้าปัจจุบันเกินหน้าสุดท้าย
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * 5, current * 5);
  return (
    <Card className="library-panel">
      <div className="panel-heading">
        <h2>คลังหนังสือของคุณ</h2>
        <span className="muted">{books.length} เล่ม</span>
      </div>
      <div className="search-box">
        <Search />
        <Input
          aria-label="ค้นหาหนังสือหรือผู้เขียน"
          placeholder="ค้นหาหนังสือหรือผู้เขียน…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
      </div>
      {visible.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>หนังสือ</TableHead>
              <TableHead>ผู้เขียน</TableHead>
              <TableHead>เผยแพร่</TableHead>
              <TableHead>รีวิว</TableHead>
              <TableHead className="text-right">รายละเอียด</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Link href={`/books/${book.id}`} className="book-title">
                    <BookCover book={book} />
                    <span>{book.title}</span>
                  </Link>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  {new Date(book.publishedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell>
                  <span className="rating">
                    <Star />
                    {average(book.reviews) || "—"}
                    <span className="muted">({book.reviews.length})</span>
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/books/${book.id}`}
                    className="icon-link"
                    aria-label={`ดูรายละเอียด ${book.title}`}
                  >
                    <ArrowRight />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="empty-state">
          <BookOpen />
          <h3>
            {query
              ? "ไม่พบหนังสือที่ค้นหา"
              : "เรื่องราวดี ๆ เริ่มจากหนังสือเล่มแรก"}
          </h3>
          <p>
            {query
              ? "ลองค้นหาด้วยชื่อหนังสือหรือผู้เขียนอื่น"
              : "กดเพิ่มหนังสือ เพื่อเริ่มสร้างคลังหนังสือของคุณ"}
          </p>
        </div>
      )}
      <div className="pagination">
        <span aria-live="polite">
          {filtered.length
            ? `${(current - 1) * 5 + 1}–${Math.min(current * 5, filtered.length)} จาก ${filtered.length} เล่ม`
            : "0 เล่ม"}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="หน้าก่อนหน้า"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="page-number">
            {current} / {pages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="หน้าถัดไป"
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </Card>
  );
}
