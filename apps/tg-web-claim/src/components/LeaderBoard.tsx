import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Address } from 'ton-core';

import { useAuth } from '../contexts';
import {
  useGetLeaderboard,
  useGetMyLeaderboardPosition,
  useOutsideAlerter,
  useTonConnect,
} from '../hooks';
import { ClaimUserDto } from '../services/tgApiService';

import { Table, TableColumn } from './Table';

type Props = {
  className?: string;
};

const MAX_RANK = 200;

function calculateNOTs(gold: number, sum: number) {
  // eslint-disable-next-line no-magic-numbers
  return 1000000 * (gold / sum);
}

export function Leaderboard({ className }: Props) {
  const { data: leaderboard, isPending: isLoading } = useGetLeaderboard();
  const { list: users = [], sum = 0 } = leaderboard || {};
  const { data: myRank, isPending: isLoadingMyRank } =
    useGetMyLeaderboardPosition(WebApp.initData);
  const { connected, tonConnectUI } = useTonConnect();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogRef = useRef(null);
  useOutsideAlerter(dialogRef, () => setIsOpen(false));

  const isClaimed = user?.address;

  async function handleConnectWallet() {
    if (connected) {
      await tonConnectUI.disconnect();
    }

    tonConnectUI.openModal();
  }

  const columns: TableColumn<ClaimUserDto>[] = [
    {
      className: 'rounded-tl-[4px] rounded-bl-[4px]',
      header: 'Rank',
      key: 'rank',
      render: (_data, idx = 0) => idx + 1,
    },
    {
      header: 'Telegram ID',
      key: 'nickname',
    },
    {
      header: 'Score',
      key: 'totalGamesPlayed',
      render: (data) =>
        Intl.NumberFormat('en', {
          maximumFractionDigits: 2,
          notation: 'compact',
        }).format(data.gold),
    },
    {
      className: 'rounded-tr-[4px] rounded-br-[4px]',
      header: 'Rewards',
      key: 'rewards',
      render: (data, idx = 0) =>
        Intl.NumberFormat('en', {
          maximumFractionDigits: 2,
          notation: 'compact',
        }).format(calculateNOTs(idx >= MAX_RANK ? 0 : data.gold, sum)) +
        ' NOTs',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-white/20 border border-[#EBECEF]/20 justify-center py-[21px]">
        <img alt="logo" className="h-[17.5px]" src="/images/logo.png" />
      </div>
      <div className="flex flex-col gap-2 items-center text-center">
        <div className="px-3 py-2 bg-[#131B2F]/60 rounded-xl font-bold text-[13px]">
          2024.6.31 UTC 12:00:00 - 2024.7.4 UTC 12:00:00
        </div>
        <div className="font-bold text-[19px]">Farty League</div>
        <div className="font-normal text-[13px]">
          Monthly incentive league for Farty players.
          <br />
          Play Farty Claw, earn coins, and WIN PRIZE.
        </div>
        <div className="font-medium text-[13px] text-[#F2C94C]">
          Farty League Rules
        </div>
      </div>
      <div className="flex flex-col items-center gap-[10px] mx-[25px]">
        <button
          className="flex w-full px-4 py-[10px] items-center justify-between rounded-[4px] text-[13px] font-medium text-[#101828] bg-gradient-to-r from-[#FFF869] to-[#FFCA43]"
          onClick={() => setIsOpen(true)}
        >
          <span>{myRank?.rank || '-'}</span>
          <span>
            {myRank?.nickname ??
              (user?.firstName ?? '') + ' ' + (user?.lastName ?? '')}
          </span>
          <span>
            {Intl.NumberFormat('en', {
              maximumFractionDigits: 2,
              notation: 'compact',
            }).format(myRank?.gold ?? 0)}
          </span>
          <span>
            {Intl.NumberFormat('en', {
              maximumFractionDigits: 2,
              notation: 'compact',
            }).format(
              (myRank?.rank ?? 0) >= MAX_RANK
                ? 0
                : calculateNOTs(myRank?.gold ?? 0, sum),
            )}{' '}
            NOTs
          </span>
        </button>
        <Table<ClaimUserDto>
          columns={columns}
          data={users}
          isLoading={isLoading || isLoadingMyRank}
        />
      </div>

      <dialog
        ref={dialogRef}
        className={clsx(
          'text-white fixed bottom-0 flex w-screen items-center justify-center bg-transparent',
          'transition ease-in-out duration-300 data-[closed]:opacity-0',
          'data-[enter]:duration-300 data-[enter]:data-[closed]:translate-y-full',
          'data-[leave]:duration-300 data-[leave]:data-[closed]:translate-y-full',
          isOpen ? '' : 'hidden',
        )}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col gap-6 bg-[#131B2F] py-8 px-4 rounded-t-[10px] w-full">
          <div className="flex flex-col gap-4 items-center">
            <img alt="farty" className="w-[202px]" src="/images/farty.png" />
            <span className="text-[21px] font-bold">
              {isClaimed
                ? 'You will receive rewards soon.'
                : 'Congratulations!'}
            </span>
            {isClaimed ? (
              <span className="text-[15px] font-normal text-center">
                You will receive{' '}
                {Intl.NumberFormat('en').format(myRank?.gold ?? 0)} NOTs to your
                wallet {Address.parse(user.address).toString()} within 3 days.
              </span>
            ) : (
              <span className="text-[15px] font-normal text-center">
                You have won {Intl.NumberFormat('en').format(myRank?.gold ?? 0)}{' '}
                NOTs from Farty League.
                <br />
                Connect your wallet address.
              </span>
            )}
          </div>
          <button
            className="flex w-full px-4 py-[10px] items-center justify-center rounded-[6px] text-[15px] font-medium text-[#101828] bg-gradient-to-r from-[#FFF869] to-[#FFCA43]"
            onClick={() => {
              if (isClaimed) {
                setIsOpen(false);
              } else {
                handleConnectWallet();
              }
            }}
          >
            {isClaimed ? 'Close' : 'Connect Wallet'}
          </button>
        </div>
      </dialog>
    </div>
  );
}
