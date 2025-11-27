import { Bell, Palette, User, Shield, Edit2, Mail, Phone, Upload, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const Settings = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    if (data) {
      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });
        if (emailError) throw emailError;
      }

      // Update phone if changed
      if (phone !== user.phone) {
        const { error: phoneError } = await supabase.auth.updateUser({
          phone,
        });
        if (phoneError) throw phoneError;
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pl-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 neon-glow-purple">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your task manager experience</p>
        </div>

        {/* Edit Profile */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon-green/20 neon-glow-green">
                <Edit2 className="w-5 h-5 text-neon-green" />
              </div>
              <h2 className="text-xl font-bold">Edit Profile</h2>
            </div>
            <ChevronDown 
              className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${
                isProfileExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>

          {isProfileExpanded && (
            <div className="space-y-6 animate-in fade-in-50 slide-in-from-top-2 duration-300">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback className="text-lg">
                    {username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="avatar-url" className="text-sm font-medium">
                    Profile Picture URL
                  </Label>
                  <Input
                    id="avatar-url"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="glass-card border-border/50"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-card border-border/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-card border-border/50"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="glass-card border-border/50"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full neon-glow-green"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
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

        {/* Profile Preferences */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-neon-green/20 neon-glow-green">
              <User className="w-5 h-5 text-neon-green" />
            </div>
            <h2 className="text-xl font-bold">Profile Preferences</h2>
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
