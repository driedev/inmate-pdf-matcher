import { motion } from "framer-motion";
import { User, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { type MatchResult } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface MatchResultCardProps {
  match: MatchResult;
  index: number;
}

export function MatchResultCard({ match, index }: MatchResultCardProps) {
  const isHighConfidence = (match.confidence || 0) > 85;
  const confidenceColor = isHighConfidence ? "text-emerald-600" : "text-amber-500";
  const confidenceBg = isHighConfidence ? "bg-emerald-100 dark:bg-emerald-950/50" : "bg-amber-100 dark:bg-amber-950/50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {match.inmateDetails?.photoUrl ? (
            <div className="relative">
              <img 
                src={match.inmateDetails.photoUrl} 
                alt={match.matchedName || "Inmate"} 
                className="w-16 h-16 rounded-xl object-cover shadow-inner bg-slate-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${match.matchedName || "Unknown"}&background=E2E8F0&color=475569`;
                }}
              />
              {match.isMatch && (
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-foreground truncate" style={{ fontFamily: 'var(--font-display)' }}>
                {match.matchedName || "Unknown Name"}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                Extracted: <span className="font-mono text-xs">{match.pdfName}</span>
              </p>
            </div>
            
            {match.confidence && (
              <Badge variant="secondary" className={`${confidenceBg} ${confidenceColor} border-none font-bold shrink-0 rounded-lg px-2.5 py-1`}>
                {Math.round(match.confidence)}% Match
              </Badge>
            )}
          </div>
          
          <div className="mt-3">
            {match.isMatch && match.inmateDetails ? (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  ID: {match.inmateDetails.bookingId || match.inmateDetails.id}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Src: {match.inmateDetails.source}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                No record found in current database
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
