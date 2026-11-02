import Link from "next/link";
import { BookOpen } from "lucide-react";
export default function NotFound() {
  return (
    <div className="status-page">
      <BookOpen />
      <span className="muted">404</span>
      <h1>ไม่พบหน้าหรือหนังสือที่ต้องการ</h1>
      <p>หนังสือเล่มนี้อาจถูกลบแล้ว หรือที่อยู่ไม่ถูกต้อง</p>
      <Link className="text-primary underline underline-offset-4" href="/books">
        กลับไปคลังหนังสือ
      </Link>
    </div>
  );
}
