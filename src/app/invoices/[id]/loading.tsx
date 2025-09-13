import PageHeader from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function InvoiceDetailLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex-row justify-between items-start">
            <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
            <div className="border rounded-md">
                <div className="h-12 border-b flex items-center px-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-1/4 ml-4" />
                    <Skeleton className="h-6 w-1/4 ml-4" />
                </div>
                {[...Array(2)].map((_, i) => (
                <div key={i} className="h-14 border-b flex items-center px-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-1/4 ml-4" />
                    <Skeleton className="h-6 w-1/4 ml-4" />
                </div>
                ))}
            </div>
             <div className="flex justify-end mt-4">
                <div className="text-right space-y-2 w-48">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
