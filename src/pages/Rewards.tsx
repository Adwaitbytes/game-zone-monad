import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/game/Header";
import { RewardsShowcase } from "@/components/rewards/RewardsShowcase";
import { ReferralSystem } from "@/components/social/ReferralSystem";
import { Trophy, Users, Sparkles } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { toast } from "sonner";

const Rewards = () => {
  const { address, isConnected } = useWeb3();

  const handleClaimReward = (rewardId: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet to claim rewards");
      return;
    }
    toast.success("Reward claimed! NFT minted to your wallet");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header showGameNav={false} />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
            Rewards & Referrals
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Earn NFT achievements, refer friends, and unlock exclusive benefits
          </p>
        </motion.div>

        <Tabs defaultValue="nfts" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="nfts" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              NFT Rewards
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Referrals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nfts" className="space-y-8">
            <RewardsShowcase onClaimReward={handleClaimReward} />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-8">
            <ReferralSystem userAddress={address} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Rewards;
