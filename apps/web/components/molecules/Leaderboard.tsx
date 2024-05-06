import clsx from 'clsx';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { User } from '@farty-bera/api-lib';

import { ApplicationData, Applications } from '../../constants';
import { useApplications, useUser } from '../../contexts';
import { DateFormats } from '../../enums';
import {
  useGetInvitedUsersCount,
  useGetTopRanks,
  useGetUserRank,
} from '../../hooks';
import { truncateMiddle } from '../../utils';
import { Table, TableColumn, TextInput } from '../atoms';
import { Window } from '../elements';

export function Leaderboard() {
  const { address, isConnected } = useAccount();
  const {
    error,
    isLoading: isUserLoading,
    setOnSuccessfulUpdate,
    setUser,
    user: user = {} as User,
  } = useUser();
  const { applications } = useApplications();
  const [name, setName] = useState<string>(user?.displayName ?? '');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const application =
    applications.find((app) => app.name === Applications.LEADERBOARD) ||
    ApplicationData[Applications.LEADERBOARD];

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

  return (
    <Window center application={application}>
      <div className="flex flex-col p-2 gap-2 text-sm">
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
