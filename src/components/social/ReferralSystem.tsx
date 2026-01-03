import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Users, Gift, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

interface ReferralSystemProps {
  userAddress?: string;
}

export const ReferralSystem = ({ userAddress }: ReferralSystemProps) => {
  const [referralCode, setReferralCode] = useState(
    userAddress ? `GZ${userAddress.slice(2, 8).toUpperCase()}` : "CONNECT_WALLET"
  );
  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  
  const [stats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingRewards: 0,
  });

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
    analytics.track('referral_link_generated', { code: referralCode });
  };

  const shareOnTwitter = () => {
    const text = `Join me on Game Zone Monad and get 10 MON free! 🎮🚀\n\nPlay skill-based games, win real rewards on Monad blockchain.\n\nUse my referral link:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
    analytics.track('referral_link_shared', { platform: 'twitter' });
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Refer & Earn</h2>
        <p className="text-muted-foreground">
          Invite friends and earn 10% of their winnings forever
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </div>
          <p className="text-3xl font-bold">{stats.totalReferrals}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <p className="text-sm text-muted-foreground">Total Earned</p>
          </div>
          <p className="text-3xl font-bold text-green-500">{stats.totalEarnings} MON</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-muted-foreground">Pending Rewards</p>
          </div>
          <p className="text-3xl font-bold text-amber-500">{stats.pendingRewards} MON</p>
        </GlassCard>
      </div>

      {/* Referral Link */}
      <GlassCard className="p-8">
        <h3 className="text-xl font-bold mb-4">Your Referral Link</h3>
        
        <div className="flex gap-3 mb-6">
          <Input
            value={referralLink}
            readOnly
            className="flex-1 font-mono text-sm"
          />
          <Button onClick={copyReferralLink} size="lg">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button onClick={shareOnTwitter} size="lg" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h4 className="font-semibold mb-3">How it works:</h4>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Share your link</p>
              <p className="text-sm text-muted-foreground">
                Send your unique referral link to friends
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">They sign up & play</p>
              <p className="text-sm text-muted-foreground">
                Your friend gets 10 MON bonus, you get rewards
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Earn forever</p>
              <p className="text-sm text-muted-foreground">
                Get 10% commission on all their winnings, lifetime
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
