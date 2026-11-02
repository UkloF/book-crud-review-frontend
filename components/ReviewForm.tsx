"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { bookService } from "@/services/bookService";
export default function ReviewForm({ bookId }: { bookId: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // เก็บ element ก่อน await เพราะ event handler จะทำงานข้ามช่วงเวลา
    const form = event.currentTarget;
    const values = new FormData(form);
    setPending(true);
    setError("");
    setSuccess(false);
    try {
      await bookService.addReview(bookId, {
        rating: Number(values.get("rating")),
        content: String(values.get("content")),
      });
      form.reset();
      setSuccess(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "เพิ่มรีวิวไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }
  return (
    <Card className="review-card">
      <h2>เขียนรีวิว</h2>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="rating">คะแนน</FieldLabel>
            <select
              id="rating"
              name="rating"
              className="h-10 rounded-lg border bg-card px-3 text-sm"
              defaultValue="5"
            >
              <option value="5">5 ดาว · ประทับใจมาก</option>
              <option value="4">4 ดาว · ดีมาก</option>
              <option value="3">3 ดาว · ดี</option>
              <option value="2">2 ดาว · พอใช้</option>
              <option value="1">1 ดาว · ควรปรับปรุง</option>
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="content">ความคิดเห็น</FieldLabel>
            <Textarea
              id="content"
              name="content"
              required
              maxLength={3000}
              rows={4}
              placeholder="หนังสือเล่มนี้เป็นอย่างไรบ้าง?"
            />
          </Field>
        </FieldGroup>
        {error ? (
          <p role="alert" className="error-message">
            {error}
          </p>
        ) : null}
        {success ? (
          <p role="status" className="text-sm text-primary">
            บันทึกรีวิวเรียบร้อยแล้ว
          </p>
        ) : null}
        <Button disabled={pending} type="submit">
          {pending ? "กำลังบันทึก…" : "ส่งรีวิว"}
        </Button>
      </form>
    </Card>
  );
}
