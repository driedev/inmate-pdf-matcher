import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const themeContext = useTheme();
  const theme = themeContext?.theme ?? "dark";
  const setTheme = themeContext?.setTheme ?? (() => {});

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full gradient-bg ${theme}`}>
        <AppSidebar />
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 glass-panel border-b-0 border-transparent rounded-b-[2rem] mx-4 mt-2 mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-xl p-2" />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full w-10 h-10 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-90"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-sm font-bold text-white">AD</span>
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
