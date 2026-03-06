import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PdfUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function PdfUploader({ onUpload, isUploading }: PdfUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        setError("Please upload a valid PDF document.");
        return;
      }

      try {
        await onUpload(file);
      } catch (err) {
        // Error handled in mutation
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden group cursor-pointer border-2 border-dashed rounded-3xl p-12
          transition-all duration-300 ease-out bg-white dark:bg-slate-900/50
          ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"}
          ${isDragReject ? "border-destructive bg-destructive/5" : ""}
          ${isUploading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className={`
            p-5 rounded-2xl transition-all duration-300
            ${isDragActive ? "bg-primary text-primary-foreground shadow-xl shadow-primary/25 scale-110" : "bg-primary/10 text-primary"}
          `}>
            {isUploading ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : isDragReject ? (
              <AlertCircle className="w-10 h-10 text-destructive" />
            ) : (
              <UploadCloud className="w-10 h-10" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              {isUploading ? "Processing Document..." : isDragActive ? "Drop PDF here" : "Upload Arrest Record"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {isUploading 
                ? "Our AI is extracting text and matching records against the inmate database." 
                : "Drag & drop a PDF document here, or click to select a file. Maximum file size 10MB."}
            </p>
          </div>

          <AnimatePresence>
            {!isUploading && !isDragActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button variant="outline" className="rounded-full px-8 py-5 h-auto font-semibold hover-elevate">
                  Select Document
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl transition-opacity group-hover:bg-primary/10" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transition-opacity group-hover:bg-blue-500/10" />
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive flex items-center gap-3 text-sm font-medium"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
