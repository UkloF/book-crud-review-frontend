"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { bookService } from "@/services/bookService";
import type { Book } from "@/lib/types";
export function BookForm({
  book,
  standalone = false,
}: {
  book?: Book;
  standalone?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("publishedAt") || "");
    setPending(true);
    setError("");
    try {
      const payload = {
        title: String(data.get("title")).trim(),
        author: String(data.get("author")).trim(),
        coverUrl: String(data.get("coverUrl") || "").trim() || null,
        ...(date
          ? { publishedAt: new Date(`${date}T00:00:00.000Z`).toISOString() }
          : {}),
      };
      if (book) await bookService.updateBook(book.id, payload);
      else await bookService.createBook(payload);
      setOpen(false);
      if (standalone) router.push("/books");
      // ให้ Server Component ดึงข้อมูลใหม่ หลัง API บันทึกสำเร็จ ตารางจึงแสดงข้อมูลล่าสุด
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }
  // ใช้ฟอร์มชุดเดียวกันทั้งหน้าเพิ่มหนังสือ และหน้าต่างแก้ไข เพื่อลดโค้ดซ้ำ
  const form = (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">ชื่อหนังสือ *</FieldLabel>
          <Input
            id="title"
            name="title"
            required
            maxLength={250}
            defaultValue={book?.title}
            placeholder="เช่น The Little Prince"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="author">ผู้เขียน *</FieldLabel>
          <Input
            id="author"
            name="author"
            required
            maxLength={200}
            defaultValue={book?.author}
            placeholder="ชื่อผู้เขียน"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="publishedAt">วันเผยแพร่</FieldLabel>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={book?.publishedAt?.slice(0, 10)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="coverUrl">URL รูปปก (ไม่จำเป็น)</FieldLabel>
          <Input
            id="coverUrl"
            name="coverUrl"
            type="url"
            pattern="https?://.*"
            defaultValue={book?.coverUrl || ""}
            placeholder="https://example.com/cover.jpg"
          />
        </Field>
      </FieldGroup>
      {error ? (
        <p role="alert" className="error-message">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => {
            if (standalone) router.push("/books");
            else setOpen(false);
          }}
        >
          ยกเลิก
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : null}
          {pending ? "กำลังบันทึก…" : "บันทึกหนังสือ"}
        </Button>
      </div>
    </form>
  );
  if (standalone) return form;
  return (
    <>
      <Button
        variant={book ? "outline" : "default"}
        className="action-button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        {book ? (
          <Pencil data-icon="inline-start" />
        ) : (
          <Plus data-icon="inline-start" />
        )}
        {book ? "แก้ไขหนังสือ" : "เพิ่มหนังสือ"}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!pending) setOpen(value);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {book ? "แก้ไขหนังสือ" : "เพิ่มหนังสือใหม่"}
            </DialogTitle>
            <DialogDescription>
              เติมเรื่องราวดี ๆ ให้คลังหนังสือของคุณ
            </DialogDescription>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    </>
  );
}
