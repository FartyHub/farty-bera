import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useAccount } from 'wagmi';

import { DISCORD_URL, TELEGRAM_URL, X_URL } from '../../constants';
import { truncateMiddle } from '../../utils';
import { Button } from '../atoms';

type Props = {
  className?: string;
};

type TabProps = {
  children: ReactNode;
  disabled?: boolean;
  link: string;
};

function Tab({ children, disabled, link }: TabProps) {
  const router = useRouter();
  const isOnThisPage = router.pathname === link;

  return (
    <Link
      className={clsx(
        'font-bold text-lg text-white items-center flex',
        disabled && 'cursor-not-allowed opacity-50',
        isOnThisPage && 'border-b-[3px] border-[#FECE4F]',
      )}
      href={disabled ? '#' : link}
    >
      {children}
    </Link>
  );
}

export function Header({ className }: Props) {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  return (
    <header
      className={clsx(
        'flex items-center justify-between bg-[#D69B72] border-b-[3px] border-[#C96920] text-white',
        className,
      )}
    >
      <div className="flex gap-6">
        <img
          alt="user"
          className="size-[56px] border-2 border-white rounded-full m-4 mr-0"
          src="/images/bear.svg"
        />
        <div className="flex gap-8 h-auto">
          <Tab link="/">Game</Tab>
          <Tab disabled link="/leaderboard">
            Leaderboard (Coming Soon)
          </Tab>
        </div>
      </div>
      <div className="flex gap-9 items-center mr-4">
        <div className="flex gap-4">
          <Link href={X_URL} target="_blank">
            <img
              alt="x"
              className="size-6 text-[#FFEEDA]"
              src="/images/x-icon.svg"
            />
          </Link>
          <Link href={TELEGRAM_URL} target="_blank">
            <img
              alt="telegram"
              className="size-6 text-[#FFEEDA]"
              src="/images/telegram-icon.svg"
            />
          </Link>
          <Link href={DISCORD_URL} target="_blank">
            <img
              alt="discord"
              className="size-6 text-[#FFEEDA]"
              src="/images/discord-icon.svg"
            />
          </Link>
        </div>
        <Button type="secondary" onClick={() => open()}>
          {address ? truncateMiddle(address) : 'Connect Wallet'}
        </Button>
      </div>
    </header>
  );
}
