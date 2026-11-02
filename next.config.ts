import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ข้อมูลหนังสือเปลี่ยนได้ตลอด จึงใช้ Server Component แบบดึงข้อมูลใหม่ทุกคำขอ
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
