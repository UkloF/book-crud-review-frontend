"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { bookService } from "@/services/bookService";
export default function DeleteBookButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    setPending(true);
    setError("");
    try {
      await bookService.deleteBook(id);
      // ลบสำเร็จจึงกลับหน้ารายการ และขอข้อมูลใหม่จาก Server Component
      setOpen(false);
      router.push("/books");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ลบไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <Button
        variant="destructive"
        className="action-button"
        onClick={() => setOpen(true)}
      >
        <Trash2 data-icon="inline-start" />
        ลบหนังสือ
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (!pending) setOpen(value);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบหนังสือเล่มนี้?</AlertDialogTitle>
            <AlertDialogDescription>
              หนังสือ “{title}” และรีวิวทั้งหมดจะถูกลบถาวร
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? (
            <p role="alert" className="error-message">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button variant="destructive" disabled={pending} onClick={remove}>
              {pending ? "กำลังลบ…" : "ยืนยันการลบ"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
