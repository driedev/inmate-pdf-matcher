import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950">
        <AppSidebar />
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 glass-panel border-b-0 border-transparent rounded-b-3xl mx-4 mt-2 mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-xl p-2" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">AD</span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto px-4 sm:px-8 pb-12 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
