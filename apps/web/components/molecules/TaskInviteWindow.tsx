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

export function TaskInviteWindow() {
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
  const application =
    applications.find((app) => app.name === Applications.TASK_INVITE) ||
    ApplicationData[Applications.TASK_INVITE];

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

    refetchUserRank();
    refetchTopRanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const columns: TableColumn<User>[] = [
    {
      header: 'Address',
      key: 'address',
      render: (data) => (
        <span className="font-bold text-[11px]">
          {truncateMiddle(data.address)}
        </span>
      ),
    },
    {
      header: (
        <span className="text-[11px] flex gap-[2px] items-center justify-center">
          <img
            alt="honey"
            className="size-[15px]"
            src="/images/honey-icon.svg"
          />
          Points Earned
        </span>
      ),
      key: 'value',
    },
  ];

  function handleCopyAddress() {
    navigator.clipboard.writeText(address ?? '');
  }

  function handleCopyInviteLink() {
    navigator.clipboard.writeText(address ?? '');
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
                  {user.displayName ?? 'Farty Bera'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold">
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
                  // onClick={handleToggleEditName}
                >
                  {/* <img alt="edit" src="/images/write-icon.svg" />
                  {isEditingName ? 'Save' : 'Set Name'} */}
                </div>
              </div>
            </div>
          )}
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
