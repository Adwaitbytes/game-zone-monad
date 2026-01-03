import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, type Address } from 'viem';
import { TOURNAMENT_ABI, CONTRACTS } from '@/config/contracts';
import { toast } from 'sonner';

export const useTournament = () => {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const enterTournament = async (tournamentId: string, entryFee: number) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // @ts-ignore - wagmi v3 type mismatch
      writeContract({
        address: CONTRACTS.TOURNAMENT as Address,
        abi: TOURNAMENT_ABI,
        functionName: 'enterTournament',
        args: [BigInt(tournamentId)],
        value: parseEther(entryFee.toString()),
      });
      
      toast.success("Entering tournament...", {
        description: "Please confirm the transaction in your wallet",
      });
    } catch (error) {
      console.error('Error entering tournament:', error);
      toast.error("Failed to enter tournament");
    }
  };

  const submitScore = async (tournamentId: string, score: number, proof: string[]) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // @ts-ignore - wagmi v3 type mismatch
      writeContract({
        address: CONTRACTS.TOURNAMENT as Address,
        abi: TOURNAMENT_ABI,
        functionName: 'submitScore',
        args: [BigInt(tournamentId), BigInt(score), proof as `0x${string}`[]],
      });
      
      toast.success("Submitting score...");
    } catch (error) {
      console.error('Error submitting score:', error);
      toast.error("Failed to submit score");
    }
  };

  const claimPrize = async (tournamentId: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // @ts-ignore - wagmi v3 type mismatch
      writeContract({
        address: CONTRACTS.TOURNAMENT as Address,
        abi: TOURNAMENT_ABI,
        functionName: 'claimPrize',
        args: [BigInt(tournamentId)],
      });
      
      toast.success("Claiming prize...");
    } catch (error) {
      console.error('Error claiming prize:', error);
      toast.error("Failed to claim prize");
    }
  };

  return {
    enterTournament,
    submitScore,
    claimPrize,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: hash,
  };
};

export const useTournamentData = (tournamentId: string) => {
  const { data: tournamentData, isLoading } = useReadContract({
    address: CONTRACTS.TOURNAMENT as Address,
    abi: TOURNAMENT_ABI,
    functionName: 'getTournament',
    args: [BigInt(tournamentId)],
  });

  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useReadContract({
    address: CONTRACTS.TOURNAMENT as Address,
    abi: TOURNAMENT_ABI,
    functionName: 'getLeaderboard',
    args: [BigInt(tournamentId), BigInt(100)],
  });

  return {
    tournament: tournamentData,
    leaderboard,
    isLoading: isLoading || isLoadingLeaderboard,
  };
};
