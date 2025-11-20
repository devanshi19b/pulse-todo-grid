import { Bell, Palette, User, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pl-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 neon-glow-purple">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your task manager experience</p>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20 neon-glow-blue">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-summary" className="text-base">
                Daily Summary
              </Label>
              <Switch id="daily-summary" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders" className="text-base">
                Task Reminders
              </Label>
              <Switch id="task-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="deadline-alerts" className="text-base">
                Deadline Alerts
              </Label>
              <Switch id="deadline-alerts" defaultChecked />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card-purple rounded-2xl p-6 space-y-6 border-neon-purple/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-neon-purple/20 neon-glow-purple">
              <Palette className="w-5 h-5 text-neon-purple" />
            </div>
            <h2 className="text-xl font-bold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="text-base">
                Smooth Animations
              </Label>
              <Switch id="animations" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="glow-effects" className="text-base">
                Neon Glow Effects
              </Label>
              <Switch id="glow-effects" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="text-base">
                High Contrast Mode
              </Label>
              <Switch id="high-contrast" />
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-neon-green/20 neon-glow-green">
              <User className="w-5 h-5 text-neon-green" />
            </div>
            <h2 className="text-xl font-bold">Profile</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="streaks" className="text-base">
                Show Task Streaks
              </Label>
              <Switch id="streaks" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rewards" className="text-base">
                Enable Rewards
              </Label>
              <Switch id="rewards" defaultChecked />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-neon-pink/20 neon-glow-pink">
              <Shield className="w-5 h-5 text-neon-pink" />
            </div>
            <h2 className="text-xl font-bold">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="encryption" className="text-base">
                End-to-End Encryption
              </Label>
              <Switch id="encryption" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cloud-sync" className="text-base">
                Cloud Sync
              </Label>
              <Switch id="cloud-sync" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
