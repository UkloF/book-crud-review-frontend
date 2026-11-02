"use client";
/* eslint-disable @next/next/no-img-element -- รูปปกมาจาก URL ภายนอกที่ผู้ใช้กำหนดเองและรองรับ fallback เมื่อโหลดผิดพลาด */
import { useState } from "react";
import { BookOpen } from "lucide-react";
import type { Book } from "@/lib/types";
export function BookCover({
  book,
  large = false,
}: {
  book: Book;
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const colors = ["#e7dfcd", "#c2705c", "#34536a", "#527c65", "#c9a3a1"];
  return (
    <div
      className={large ? "book-cover large" : "book-cover"}
      style={{ backgroundColor: colors[book.id % colors.length] }}
    >
      {/* รูปปกเป็น URL ที่ผู้ใช้กรอก จึงใช้ img เพื่อรองรับทุก host และเปลี่ยนเป็นไอคอนเมื่อโหลดไม่ได้ */}
      {book.coverUrl && !failed ? (
        <img
          src={book.coverUrl}
          alt={`ปก ${book.title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <BookOpen aria-hidden="true" />
      )}
    </div>
  );
}
