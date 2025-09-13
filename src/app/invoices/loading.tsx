import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/page-header";

export default function InvoicesLoading() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Invoices" description="View and manage all customer invoices.">
        <Skeleton className="h-10 w-36" />
      </PageHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="border rounded-md">
          <div className="w-full">
            <div className="h-12 border-b flex items-center px-4">
              <Skeleton className="h-6 w-1/5" />
              <Skeleton className="h-6 w-1/5 ml-4" />
              <Skeleton className="h-6 w-1/5 ml-4" />
              <Skeleton className="h-6 w-1/5 ml-4" />
              <Skeleton className="h-6 w-1/5 ml-4" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 border-b flex items-center px-4">
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-6 w-1/5 ml-4" />
                <Skeleton className="h-6 w-1/5 ml-4" />
                <Skeleton className="h-6 w-1/5 ml-4" />
                <Skeleton className="h-6 w-1/5 ml-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
