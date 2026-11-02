import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
export function PageSkeleton() {
  return (
    <div
      aria-label="กำลังโหลดข้อมูล"
      aria-busy="true"
      className="flex flex-col gap-6"
    >
      <Skeleton className="h-12 w-52" />
      <Skeleton className="h-5 w-72 max-w-full" />
      <div className="stats-grid">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="mb-3 h-10 w-full" />
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </Card>
    </div>
  );
}
