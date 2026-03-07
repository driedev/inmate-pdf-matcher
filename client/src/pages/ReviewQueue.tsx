import { MainLayout } from "@/components/layout/MainLayout";
import { FileText, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockQueue = [
  { id: "REV-001", file: "Arrest_Record_John_Doe.pdf", date: "2024-03-07", status: "pending", type: "Booking Summary" },
  { id: "REV-002", file: "Court_Notice_4492.pdf", date: "2024-03-06", status: "reviewed", type: "Court Docket" },
  { id: "REV-003", file: "Crash_Report_Final.pdf", date: "2024-03-05", status: "flagged", type: "Crash Report" },
];

export default function ReviewQueue() {
  return (
    <MainLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Review Queue</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage and audit processed documents requiring manual intervention.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Filter queue by filename or ID..." 
              className="pl-12 py-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            />
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {mockQueue.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.file}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium text-slate-500">{item.id}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-medium text-slate-500">{item.date}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-medium text-slate-500">{item.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {item.status === "pending" && (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 rounded-lg px-3 py-1">
                        <Clock className="w-3 h-3 mr-1" /> Pending Review
                      </Badge>
                    )}
                    {item.status === "reviewed" && (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 rounded-lg px-3 py-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Reviewed
                      </Badge>
                    )}
                    {item.status === "flagged" && (
                      <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 rounded-lg px-3 py-1">
                        <AlertCircle className="w-3 h-3 mr-1" /> Flagged
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="rounded-xl font-bold">Open Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}
