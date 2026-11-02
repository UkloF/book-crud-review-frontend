"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Book } from "@/lib/types";
// แยก widget เป็น JavaScript อีกก้อน โหลดฝั่ง browser พร้อมแสดง Skeleton ระหว่างรอ
// ssr:false ต้องประกาศใน Client Component จึงแยก wrapper ไว้จากหน้า Dashboard
const RecentBooksWidget = dynamic(
  () => import("@/components/RecentBooksWidget"),
  { ssr: false, loading: () => <Skeleton className="min-h-96 rounded-xl" /> },
);
export function LazyRatings({ books }: { books: Book[] }) {
  return <RecentBooksWidget books={books} />;
}
