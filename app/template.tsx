export default function Template({ children }: { children: React.ReactNode }) {
  // ต่างจาก layout: template ถูกสร้างใหม่เมื่อเปลี่ยนหน้า จึงใช้เริ่ม animation ของแต่ละ route
  return <div className="route-enter">{children}</div>;
}
