import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Address } from 'ton-core';

import { useAuth } from '../contexts';
import {
  useGetLeaderboard,
  useGetMyLeaderboardPosition,
  useOutsideAlerter,
  useStarknet,
} from '../hooks';
import { ClaimUserDto } from '../services/tgApiService';
import { truncateMiddle } from '../utils';

import { Table, TableColumn } from './Table';

type Props = {
  className?: string;
};

const MAX_RANK = 200;
const MAX_NOTS = 100000;
const MAX_ADDRESS_LENGTH = 8;

function calculateNOTs(gold: number, sum: number) {
  // eslint-disable-next-line no-magic-numbers
  return MAX_NOTS * (gold / sum);
}

export function Leaderboard({ className }: Props) {
  const startTime = new Date('2024-06-04T12:00:00Z');
  const endTime = new Date('2024-07-25T00:00:00Z');
  const sDate = startTime.toISOString().split('T')[0];
  const { data: leaderboard, isPending: isLoading } = useGetLeaderboard(
    sDate,
    endTime.toISOString(),
  );
  const { list: users = [], sum = 1 } = leaderboard || {};
  const { data: myRank, isPending: isLoadingMyRank } =
    useGetMyLeaderboardPosition(
      WebApp.initData,
      String(WebApp.initDataUnsafe.user?.id ?? ''),
      sDate,
      endTime.toISOString(),
    );
  const { connected, connectWallet, disconnect } = useStarknet();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogRef = useRef(null);
  useOutsideAlerter(dialogRef, () => setIsOpen(false));
  const hasEnded = Date.now() >= endTime.getTime();
  const canOpen =
    hasEnded &&
    ((myRank?.rank ?? 0) > MAX_RANK
      ? false
      : !!calculateNOTs(myRank?.gold ?? 0, sum));

  const isClaimed = user?.address;

  useEffect(() => {
    if (canOpen) {
      setIsOpen(hasEnded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEnded]);

  async function handleConnectWallet() {
    if (connected) {
      await disconnect();
    }

    connectWallet();
  }

  const columns: TableColumn<ClaimUserDto>[] = [
    {
      className: 'rounded-tl-[4px] rounded-bl-[4px]',
      header: 'Rank',
      headerClassName: 'w-9',
      key: 'rank',
      render: (_data, idx = 0) => idx + 1,
    },
    {
      className: 'truncate',
      header: 'Telegram ID',
      headerClassName: 'w-24',
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
      <div className="flex flex-col gap-2 items-center text-center px-[25px]">
        <div className="flex justify-between text-[13px] font-medium items-center w-full">
          {user?.address ? (
            <span className="flex gap-[6px] items-center">
              <img alt="wallet" className="size-4" src="/images/wallet.svg" />
              {truncateMiddle(
                Address.parse(user.address).toString(),
                MAX_ADDRESS_LENGTH,
              )}
            </span>
          ) : (
            <span />
          )}
          <button
            className="flex gap-[6px] items-center px-2 py-1 rounded-full border border-gray-200"
            onClick={handleConnectWallet}
          >
            {user?.address ? (
              <>
                <img alt="logout" className="size-4" src="/images/logout.svg" />
                Switch Wallet
              </>
            ) : (
              <>
                <img alt="wallet" className="size-4" src="/images/wallet.svg" />
                Connect Wallet
              </>
            )}
          </button>
        </div>
        <div className="font-bold text-[19px]">Farty League</div>
        <div className="font-normal text-[13px] text-[#98A2B3]">
          <span className="text-[#FFCA0D] font-bold">
            {Intl.NumberFormat('en').format(MAX_NOTS)} NOTs
          </span>{' '}
          rewarded to{' '}
          <span className="text-[#FFCA0D] font-bold">
            TOP {Intl.NumberFormat('en').format(MAX_RANK)} players
          </span>{' '}
          <br />
          with accumulated Farty Claw Coins.
        </div>
        <div className="p-2 w-full bg-[#131B2F]/60 rounded-xl font-bold text-[13px] whitespace-nowrap">
          {hasEnded ? (
            <>
              Ended on {endTime.getUTCFullYear()}.{endTime.getUTCMonth() + 1}.
              {endTime.getUTCDate()} UTC{' '}
              {String(endTime.getUTCHours()).padStart(2, '0')}:
              {String(endTime.getUTCMinutes()).padStart(2, '0')}:
              {String(endTime.getUTCSeconds()).padStart(2, '0')}
            </>
          ) : (
            <>
              {startTime.getUTCFullYear()}.{startTime.getUTCMonth() + 1}.
              {startTime.getUTCDate()} UTC{' '}
              {String(startTime.getUTCHours()).padStart(2, '0')}:
              {String(startTime.getUTCMinutes()).padStart(2, '0')}:
              {String(startTime.getUTCSeconds()).padStart(2, '0')} -{' '}
              {endTime.getUTCFullYear()}.{endTime.getUTCMonth() + 1}.
              {endTime.getUTCDate()} UTC{' '}
              {String(endTime.getUTCHours()).padStart(2, '0')}:
              {String(endTime.getUTCMinutes()).padStart(2, '0')}:
              {String(endTime.getUTCSeconds()).padStart(2, '0')}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-[10px] mx-[25px]">
        <button
          className="flex w-full px-4 py-[10px] items-center justify-between rounded-[4px] text-[13px] font-medium text-[#101828] bg-gradient-to-r from-[#FFF869] to-[#FFCA43]"
          onClick={() => {
            if (canOpen) {
              setIsOpen(true);
            }
          }}
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
              (myRank?.rank ?? 0) > MAX_RANK
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
                {Intl.NumberFormat('en', {
                  maximumFractionDigits: 2,
                  notation: 'compact',
                }).format(
                  (myRank?.rank ?? 0) > MAX_RANK
                    ? 0
                    : calculateNOTs(myRank?.gold ?? 0, sum),
                )}{' '}
                NOTs to your wallet {Address.parse(user.address).toString()}{' '}
                within 3 days.
              </span>
            ) : (
              <span className="text-[15px] font-normal text-center">
                You have won{' '}
                {Intl.NumberFormat('en', {
                  maximumFractionDigits: 2,
                  notation: 'compact',
                }).format(
                  (myRank?.rank ?? 0) > MAX_RANK
                    ? 0
                    : calculateNOTs(myRank?.gold ?? 0, sum),
                )}{' '}
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
