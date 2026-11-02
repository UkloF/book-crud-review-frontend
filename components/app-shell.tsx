"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, House, Settings2, ChevronRight } from "lucide-react";
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const inBooks = path.startsWith("/books");
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        ข้ามไปเนื้อหา
      </a>
      <aside className="sidebar">
        <Link className="brand" href="/">
          <BookOpen />
          Bookspace
        </Link>
        <nav aria-label="เมนูหลัก">
          <Link
            className={!inBooks ? "nav-item active" : "nav-item"}
            href="/"
            aria-current={path === "/" ? "page" : undefined}
          >
            <House />
            ภาพรวม
          </Link>
          <Link
            className={inBooks ? "nav-item active" : "nav-item"}
            href="/books"
            aria-current={inBooks ? "page" : undefined}
          >
            <BookOpen />
            หนังสือทั้งหมด
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Settings2 />
          Library management
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>คลังหนังสือ</span>
          <ChevronRight />
          <span>{inBooks ? "หนังสือ" : "ภาพรวม"}</span>
        </header>
        <main id="main">{children}</main>
      </div>
    </div>
  );
}
