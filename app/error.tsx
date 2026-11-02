"use client";
import { Unplug, RotateCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ErrorPage() {
  // error.tsx เป็น Client Component ตามข้อกำหนดของ Next.js
  // ใช้ลิงก์ HTML เพื่อโหลด URL ปัจจุบันใหม่จาก server โดยตรง
  // ต่างจาก reset ที่อาจลองแสดงผลข้อมูลชุดเดิมซึ่งยังมีข้อผิดพลาดอยู่
  return (
    <div className="status-page">
      <Unplug />
      <h1>เชื่อมต่อคลังหนังสือไม่ได้</h1>
      <p>กรุณาตรวจสอบว่า backend กำลังทำงาน แล้วลองโหลดข้อมูลอีกครั้ง</p>
      <a href="" className={buttonVariants()}>
        <RotateCw data-icon="inline-start" />
        ลองอีกครั้ง
      </a>
    </div>
  );
}
