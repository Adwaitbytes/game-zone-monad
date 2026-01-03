import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';

export const useWeb3 = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { data: balance } = useBalance({
    address: address,
  });

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const formattedBalance = balance ? formatUnits(balance.value, balance.decimals) : '0';
  const displaySymbol = chain?.nativeCurrency?.symbol || balance?.symbol || 'ETH';

  return {
    address,
    isConnected,
    chain,
    balance: balance ? parseFloat(formattedBalance) : 0,
    balanceFormatted: formattedBalance,
    symbol: displaySymbol,
    connect,
    disconnect,
  };
};
