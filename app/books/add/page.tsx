import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BookForm } from "@/components/book-form";
export const metadata = { title: "เพิ่มหนังสือ" };
export default function AddBookPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/books"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        ย้อนกลับ
      </Link>
      <div className="page-heading">
        <div>
          <h1>เพิ่มหนังสือใหม่</h1>
          <p>กรอกรายละเอียดหนังสือที่ต้องการเพิ่มเข้าระบบ</p>
        </div>
      </div>
      <Card className="p-6">
        <BookForm standalone />
      </Card>
    </div>
  );
}
