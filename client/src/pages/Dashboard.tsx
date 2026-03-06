import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, FileText, BarChart3, Database } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PdfUploader } from "@/components/PdfUploader";
import { MatchResultCard } from "@/components/MatchResultCard";
import { useUploadPdf } from "@/hooks/use-pdf";
import { type ProcessResponse } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const uploadMutation = useUploadPdf();

  const handleUpload = async (file: File) => {
    setResult(null);
    const data = await uploadMutation.mutateAsync(file);
    setResult(data);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Document Processing</h1>
          <p className="text-muted-foreground mt-2 text-lg">Upload arrest records or court documents to instantly match entities against the active roster.</p>
        </header>

        <section>
          <PdfUploader 
            onUpload={handleUpload} 
            isUploading={uploadMutation.isPending} 
          />
        </section>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8 pb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 shadow-sm rounded-3xl overflow-hidden border-slate-200 dark:border-slate-800">
                  <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">Identified Entities</CardTitle>
                      </div>
                      <Badge variant="secondary" className="font-semibold rounded-lg bg-primary/10 text-primary">
                        {result.matches.length} Found
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-slate-50/20 dark:bg-slate-950/20">
                    {result.matches.length > 0 ? (
                      <div className="space-y-4">
                        {result.matches.map((match, i) => (
                          <MatchResultCard key={i} match={match} index={i} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                          <User className="w-8 h-8 text-slate-400" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Entities Found</h4>
                        <p className="text-slate-500 max-w-sm mt-1">We couldn't extract any identifiable names from this document.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-sm rounded-3xl overflow-hidden border-slate-200 dark:border-slate-800">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">Analysis</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Document Type</p>
                        <p className="text-base font-bold text-foreground capitalize flex items-center gap-2">
                          {result.documentType}
                          <Badge variant="outline" className="text-xs font-mono">{Math.round(result.typeConfidence)}%</Badge>
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-slate-500 mb-2">Review Status</p>
                        {result.needsReview ? (
                          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50">
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-bold">Manual Review Required</p>
                              <p className="opacity-90 mt-0.5 leading-tight">Confidence thresholds were not met for all extractions.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-500 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-bold">Auto-Processed Successfully</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm rounded-3xl overflow-hidden border-slate-200 dark:border-slate-800 flex flex-col h-[320px]">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">Raw Text</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                      <ScrollArea className="h-full w-full">
                        <div className="p-6">
                          <p className="font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                            {result.extractedText}
                          </p>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
