import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useInmates, useScrapeInmates } from "@/hooks/use-inmates";
import { RefreshCw, Search, Filter, ShieldAlert, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Inmates() {
  const { data: inmates, isLoading, isError } = useInmates();
  const scrapeMutation = useScrapeInmates();
  const [search, setSearch] = useState("");

  const filteredInmates = inmates?.filter(i => 
    i.fullName.toLowerCase().includes(search.toLowerCase()) || 
    i.bookingId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Active Roster</h1>
            <p className="text-muted-foreground mt-2 text-lg">Browse currently scraped inmates and booking details.</p>
          </div>
          
          <Button 
            onClick={() => scrapeMutation.mutate()} 
            disabled={scrapeMutation.isPending}
            className="rounded-full px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover-elevate bg-gradient-to-r from-primary to-indigo-500"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${scrapeMutation.isPending ? "animate-spin" : ""}`} />
            {scrapeMutation.isPending ? "Scraping Data..." : "Refresh Roster"}
          </Button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Search by name or booking ID..." 
                className="pl-12 py-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="py-6 rounded-2xl px-6">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-destructive">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-80" />
              <h3 className="text-xl font-bold">Failed to load roster</h3>
              <p className="mt-2 opacity-80 max-w-md">There was an issue connecting to the database. Please try refreshing.</p>
            </div>
          ) : filteredInmates?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No records found</h3>
              <p className="mt-2 text-slate-500 max-w-md">Try adjusting your search criteria or refresh the roster to pull new data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredInmates?.map((inmate, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 > 0.5 ? 0 : i * 0.05, duration: 0.3 }}
                  key={inmate.id}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 relative">
                      {inmate.photoUrl ? (
                        <img 
                          src={inmate.photoUrl} 
                          alt={inmate.fullName} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${inmate.fullName}&background=E2E8F0&color=475569`;
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground text-sm truncate leading-tight mb-1" title={inmate.fullName}>
                        {inmate.fullName}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                        ID: <span className="font-mono">{inmate.bookingId || inmate.id}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 font-medium">
                      {inmate.source}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10">
                      Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
