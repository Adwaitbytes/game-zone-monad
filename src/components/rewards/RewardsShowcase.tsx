import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Crown, Target, Award } from "lucide-react";

interface NFTReward {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  requirement: string;
  owned: boolean;
}

const REWARDS: NFTReward[] = [
  {
    id: "1",
    name: "First Win",
    description: "Won your first game",
    rarity: "common",
    image: "🎯",
    requirement: "Win any game",
    owned: false,
  },
  {
    id: "2",
    name: "Crash Master",
    description: "Cashed out at 10x in Crash",
    rarity: "rare",
    image: "🚀",
    requirement: "Cash out at 10x multiplier",
    owned: false,
  },
  {
    id: "3",
    name: "Tournament Champion",
    description: "Won a tournament",
    rarity: "epic",
    image: "🏆",
    requirement: "Place 1st in any tournament",
    owned: false,
  },
  {
    id: "4",
    name: "Legendary Player",
    description: "Reached 100 game streak",
    rarity: "legendary",
    image: "👑",
    requirement: "Win 100 games in a row",
    owned: false,
  },
];

const rarityColors = {
  common: "from-gray-500 to-gray-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-amber-500 to-amber-600",
};

const rarityBorders = {
  common: "border-gray-500/50",
  rare: "border-blue-500/50",
  epic: "border-purple-500/50",
  legendary: "border-amber-500/50",
};

interface RewardsShowcaseProps {
  onClaimReward?: (rewardId: string) => void;
}

export const RewardsShowcase = ({ onClaimReward }: RewardsShowcaseProps) => {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Earn NFT Rewards</h2>
        <p className="text-muted-foreground">
          Complete challenges and unlock unique on-chain achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REWARDS.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className={`p-6 relative overflow-hidden ${rarityBorders[reward.rarity]}`}>
              {/* Rarity gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[reward.rarity]} opacity-10`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Rarity badge */}
                <div className="absolute top-0 right-0">
                  <Badge variant="outline" className={`text-xs ${rarityBorders[reward.rarity]}`}>
                    {reward.rarity.toUpperCase()}
                  </Badge>
                </div>

                {/* NFT Image */}
                <div className="w-full aspect-square mb-4 rounded-lg bg-black/20 flex items-center justify-center text-6xl">
                  {reward.image}
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold mb-2">{reward.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 h-12">
                  {reward.description}
                </p>

                {/* Requirement */}
                <div className="p-3 bg-black/20 rounded-lg mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Requirement:</p>
                  <p className="text-sm font-medium">{reward.requirement}</p>
                </div>

                {/* Action */}
                {reward.owned ? (
                  <Button disabled className="w-full">
                    <Trophy className="w-4 h-4 mr-2" />
                    Owned
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onClaimReward?.(reward.id)}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Unlock
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
