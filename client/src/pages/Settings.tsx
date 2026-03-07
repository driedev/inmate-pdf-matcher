import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ShieldAlert, Settings as SettingsIcon, Bell, Mail, Lock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoScrape, setAutoScrape] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2 text-lg">Configure system behavior and integration parameters.</p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
              <CardDescription>Configure where match alerts are sent.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send an email when a high-confidence match is found.</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="alert-email">Recipient Email</Label>
                <Input id="alert-email" placeholder="alerts@example.com" defaultValue="recipient@example.com" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <CardTitle>API Configuration</CardTitle>
              </div>
              <CardDescription>Manage credentials for external services.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-status">OpenAI Integration</Label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Connected via Replit AI Integrations
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gmail-user">Gmail User</Label>
                <Input id="gmail-user" type="email" placeholder="user@gmail.com" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="rounded-full px-8 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover-elevate">
              <Save className="w-5 h-5 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
