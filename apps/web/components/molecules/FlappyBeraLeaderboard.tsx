import clsx from 'clsx';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { User } from '@farty-bera/api-lib';

import { ApplicationData, Applications, X_URL } from '../../constants';
import { useApplications, useUser } from '../../contexts';
import { DateFormats } from '../../enums';
import {
  useGetInvitedUsersCount,
  useGetTopRanks,
  useGetUserRank,
  useTouchDevice,
} from '../../hooks';
import { truncateMiddle } from '../../utils';
import { Button, Table, TableColumn, TextInput } from '../atoms';
import { Window } from '../elements';

export function FlappyBeraLeaderboard() {
  const { address, isConnected } = useAccount();
  const {
    error,
    isLoading: isUserLoading,
    setOnSuccessfulUpdate,
    setUser,
    user: user = {} as User,
  } = useUser();
  const { isTouch } = useTouchDevice();
  const { applications } = useApplications();
  const [name, setName] = useState<string>(user?.displayName ?? '');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const application =
    applications.find(
      (app) => app.name === Applications.FLAPPY_BERA_LEADERBOARD,
    ) || ApplicationData[Applications.FLAPPY_BERA_LEADERBOARD];

  const { data: invitedUsersCount, isLoading: isGettingInvitedUsersCount } =
    useGetInvitedUsersCount();
  const {
    data: userRank = 0,
    isLoading: isGettingUserRank,
    refetch: refetchUserRank,
  } = useGetUserRank(address ?? '');
  const {
    data: topRanks = [],
    isLoading: isGettingTopRanks,
    refetch: refetchTopRanks,
  } = useGetTopRanks();

  const isInTopRanks = topRanks.some(
    (rankUser) => rankUser.address === address,
  );
  const tableData =
    isInTopRanks || !user?.address || !isConnected
      ? topRanks
      : [user, ...topRanks];
  const isLoading =
    isUserLoading ||
    isGettingUserRank ||
    isGettingTopRanks ||
    isGettingInvitedUsersCount;

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    setName(user?.displayName ?? '');
    setOnSuccessfulUpdate(() => setIsEditingName(false));
    refetchUserRank();
    refetchTopRanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const columns: TableColumn<User>[] = [
    {
      header: '# Rank',
      key: 'rank',
      render: (data, idx = 0) => {
        const isUser = data.address === address;

        return (
          <span className="font-bold">
            {isUser
              ? userRank ?? '-'
              : idx + (isInTopRanks || !user?.address ? 1 : 0)}
          </span>
        );
      },
    },
    {
      header: 'Player',
      key: 'user',
      render: (data) => (
        <div className="flex flex-col flex-nowrap gap-1 text-[11px]">
          <span className="font-bold">{truncateMiddle(data.address)}</span>
          <span>{data.displayName}</span>
        </div>
      ),
    },
    {
      header: 'Total Games Played',
      key: 'totalGamesPlayed',
      render: (data) => data.fartyGamesPlayed,
    },
    {
      header: 'Fart Date',
      key: 'fartDate',
      render: (data) => format(data.createdAt, DateFormats.FULL_DATE),
    },
    {
      header: (
        <div className="flex gap-1 text-xs items-center">
          <img
            alt="honey"
            className="size-[15px]"
            src="/images/honey-icon.svg"
          />
          <span className="font-bold">Score</span>
        </div>
      ),
      key: 'honeyScore',
    },
  ];

  function handleToggleEditName() {
    if (isUserLoading) {
      return;
    }

    if (isEditingName) {
      setUser({ displayName: name });
    } else {
      setIsEditingName(true);
    }
  }

  function handleOnSubmit() {
    if (isEditingName) {
      setUser({ displayName: name });
    }
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText(address ?? '');
  }

  async function handleShareHighScore(isTwitter?: boolean) {
    const shareUrl = `${window.location.origin}`;
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    const shareText = `I am so farty! I just hit a new high score of ${user.fartyHighScore} in the Farty Bera game ${isTwitter ? '@fartybera ' : `[@fartybera](${X_URL})`}. Bet you can't beat that!${isTwitter ? '%0a' : '\n'}${shareUrl}`;

    if (isTwitter) {
      window.open(
        `https://twitter.com/intent/post?text=${shareText}`,
        '_blank',
      );
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        // eslint-disable-next-line no-alert
        alert('Share message copied to clipboard!');
      }

      if (isTouch) {
        window.open(
          'discord://discordapp.com/channels/1227137926849363978/1227137926849363981',
        );
      } else {
        window.open(
          'https://discord.com/channels/1227137926849363978/1227137926849363981',
          '_blank',
        );
      }
    }
  }

  return (
    <Window center application={application}>
      <div className="flex flex-col p-2 gap-2 text-sm">
        <div className="flex items-top justify-center">
          {isConnected && (
            <div className="flex flex-1 gap-3">
              <div className="flex items-center justify-center border-inset size-[79px]">
                <img
                  alt="bear"
                  className="w-[60px]"
                  src="/images/not-connected-bear.png"
                />
              </div>
              <div className="flex flex-col gap-1 text-[11px] justify-center">
                <span className="flex flex-nowrap whitespace-nowrap items-top gap-1">
                  {isEditingName ? (
                    <>
                      <TextInput
                        className="!p-0 text-[11px] h-[15px]"
                        error={error}
                        errorClassName="text-[9px]"
                        max={20}
                        setValue={setName}
                        value={name}
                        onSubmit={handleOnSubmit}
                      />
                      #{userRank ?? '-'}
                    </>
                  ) : (
                    `${name} #${userRank ?? '-'}`
                  )}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">
                    {truncateMiddle(address ?? '')}
                  </span>
                  <img
                    alt="copy"
                    className="size-4 cursor-pointer"
                    role="button"
                    src="/images/copy-icon.svg"
                    onClick={handleCopyAddress}
                  />
                </div>
                <div
                  className={clsx(
                    'flex flex-nowrap text-[#C76F01] gap-1',
                    isUserLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer',
                  )}
                  role="button"
                  onClick={handleToggleEditName}
                >
                  <img alt="edit" src="/images/write-icon.svg" />
                  {isEditingName ? 'Save' : 'Set Name'}
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2 md:mr-2">
            <Button
              className="px-5 py-3 h-fit"
              type="primary"
              onClick={() => handleShareHighScore(true)}
            >
              <div className="flex md:flex-row items-center gap-1 flex-nowrap">
                <span className="whitespace-nowrap">Share on</span>
                <img alt="x icon" className="size-4" src="images/x-icon.svg" />
              </div>
            </Button>
            <Button
              className="px-5 py-3 h-fit"
              type="primary"
              onClick={() => handleShareHighScore()}
            >
              Share on Discord
            </Button>
          </div>
        </div>
        <Table<User>
          columns={columns}
          data={tableData}
          highlightRow={isInTopRanks ? userRank - 1 : 0}
          isLoading={isLoading}
          tableBodyClassName={clsx(
            application.fullScreen
              ? 'leaderboard-table'
              : 'h-full md:max-h-[40vh]',
          )}
        />
        <div className="flex flex-1 justify-center whitespace-nowrap font-bold text-base">
          Total Farties Invited:{' '}
          <span className="font-normal">{invitedUsersCount ?? '-'}</span>
        </div>
      </div>
    </Window>
  );
}
