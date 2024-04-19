import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useAccount } from 'wagmi';

import { DISCORD_URL, TELEGRAM_URL, X_URL } from '../../constants';
import { useApplications } from '../../contexts';
import { Application } from '../../types';
import { truncateMiddle } from '../../utils';
import { Button } from '../atoms';

type Props = {
  className?: string;
};

type TabProps = {
  disabled?: boolean;
  iconUrl: string;
  link: string;
  title: string;
};

function Tab({ disabled, iconUrl, link, title }: TabProps) {
  return (
    <Link
      className={clsx(
        'flex items-center gap-1 p-2 rounded-none first:border-none border-t-groove hover:bg-[#5B3200] hover:text-white whitespace-nowrap',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
      href={disabled ? '#' : link}
      target={disabled ? '' : '_blank'}
    >
      <img alt={title} className="size-6" src={iconUrl} />
      <span className="font-normal text-[13px]">{title}</span>
    </Link>
  );
}

export function Footer({ className }: Props) {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const router = useRouter();
  const { applications, setApplications } = useApplications();
  const [hasTabs, setHasTabs] = useState<boolean>(false);

  function handleClickSocial(url: string) {
    window.open(url, '_blank');
  }

  function handleToggleTabs() {
    setHasTabs((prev) => !prev);
  }

  function handleClickTab(app: Application) {
    setApplications(
      applications.map((application) =>
        application.name === app.name
          ? { ...application, minimized: false }
          : application,
      ),
    );
  }

  return (
    <footer
      className={clsx(
        'flex items-left bg-[#B8C0C1] border-outset p-0.5 gap-1 items-center',
        className,
      )}
    >
      {hasTabs && (
        <div className="absolute bottom-[40px] left-1 flex flex-col px-1 bg-[#B8C0C1] border-outset z-[100]">
          <OutsideClickHandler
            onOutsideClick={() => {
              setHasTabs(false);
            }}
          >
            <Tab
              iconUrl="/images/x-icon.svg"
              link="https://twitter.com/bera_farty"
              title="X (Twitter)"
            />
            <Tab
              iconUrl="/images/discord-icon.svg"
              link={DISCORD_URL}
              title="Discord"
            />
            <Tab
              iconUrl="/images/telegram-icon.svg"
              link={TELEGRAM_URL}
              title="Telegram"
            />
            <Tab
              disabled
              iconUrl="/images/document-icon.svg"
              link=""
              title="White Paper"
            />
          </OutsideClickHandler>
        </div>
      )}
      <Button
        className="flex items-center"
        type="primary"
        onClick={handleToggleTabs}
      >
        <img alt="windows" src="/images/windows.svg" />
        <span className="font-bold text-sm">OOGA BOOGA</span>
      </Button>
      <div className="border-l-groove h-full" />
      <div className="border-outset h-3/4" />
      <img
        alt="x"
        className="h-1/2 cursor-pointer"
        src="/images/x-icon.svg"
        onClick={() => handleClickSocial(X_URL)}
      />
      <img
        alt="discord"
        className="h-1/2 cursor-pointer"
        src="/images/discord-icon.svg"
        onClick={() => handleClickSocial(DISCORD_URL)}
      />
      <div className="border-l-groove h-full" />
      <div className="border-outset h-3/4" />
      {applications.map((application) => (
        <Button
          key={application.name}
          className="flex items-center"
          type="primary"
          onClick={() => handleClickTab(application)}
        >
          <img
            alt={application.name}
            className="h-[19px]"
            src={application.iconUrl}
          />
          <span className="font-normal text-[13px]">{application.name}</span>
        </Button>
      ))}
    </footer>
  );
}
