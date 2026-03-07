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
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Document <span className="gradient-text">Processing</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-xl max-w-2xl leading-relaxed">
            Upload arrest records or court documents to instantly match entities against the active roster using AI-powered intelligence.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card rounded-[2.5rem] p-1 shadow-2xl shadow-primary/5">
            <PdfUploader 
              onUpload={handleUpload} 
              isUploading={uploadMutation.isPending} 
            />
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 pb-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card border-none shadow-2xl rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/10 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl text-primary">
                          <Database className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Identified Entities</CardTitle>
                      </div>
                      <Badge variant="secondary" className="px-4 py-1.5 text-sm font-bold rounded-full bg-primary/20 text-primary border-none">
                        {result.matches.length} Results
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {result.matches.length > 0 ? (
                      <div className="space-y-6">
                        {result.matches.map((match, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <MatchResultCard match={match} index={i} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                          <ShieldAlert className="w-10 h-10 text-slate-400" />
                        </div>
                        <h4 className="text-2xl font-bold text-foreground">No Entities Found</h4>
                        <p className="text-muted-foreground max-w-sm mt-2 text-lg">We couldn't extract any identifiable names from this document.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  <Card className="glass-card border-none shadow-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-indigo-500/5 dark:bg-indigo-500/10 border-b border-indigo-500/10 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-500">
                          <BarChart3 className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Analysis</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Document Type</p>
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <span className="text-lg font-bold text-foreground capitalize">{result.documentType}</span>
                          <Badge variant="outline" className="px-3 py-1 font-mono text-primary border-primary/20 bg-primary/5">{Math.round(result.typeConfidence * 100)}%</Badge>
                        </div>
                      </div>
                      
                      <Separator className="opacity-50" />
                      
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Review Status</p>
                        {result.needsReview ? (
                          <div className="flex items-start gap-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 p-5 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/5">
                            <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-bold text-base mb-1">Manual Review Required</p>
                              <p className="opacity-80 leading-relaxed">Confidence thresholds were not met for all extractions.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 p-5 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                            <CheckCircle className="w-6 h-6 shrink-0" />
                            <p className="text-base font-bold">Auto-Processed Successfully</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-none shadow-2xl rounded-[2rem] overflow-hidden flex flex-col h-[400px]">
                    <CardHeader className="bg-slate-500/5 dark:bg-slate-500/10 border-b border-slate-500/10 pb-6 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-500/20 rounded-xl text-slate-500">
                          <FileText className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Raw Text</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                      <ScrollArea className="h-full w-full">
                        <div className="p-8">
                          <p className="font-mono text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
