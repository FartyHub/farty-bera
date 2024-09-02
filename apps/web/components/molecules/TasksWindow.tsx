/* eslint-disable @typescript-eslint/naming-convention */
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { OAuthResponseDto, Task } from '@farty-bera/api-lib';

import { ApplicationData, Applications } from '../../constants';
import { useApplications, useUser } from '../../contexts';
import {
  useCreateUserTask,
  useGetTwitterOAuthLinkQuery,
  useSign,
  useTasksQuery,
  useTouchDevice,
} from '../../hooks';
import { Button } from '../atoms';
import { Window } from '../elements';

const TASK_DATA = [
  {
    buttonTitle: 'Check',
    icon: '/images/early-farty.png',
    id: '1',
  },
  {
    buttonTitle: 'Follow Now',
    icon: '/images/x-icon.svg',
    id: '2',
  },
  {
    buttonTitle: 'Join Now',
    icon: '/images/discord-icon.svg',
    id: '3',
  },
  {
    buttonTitle: 'Invite Now',
    icon: '/images/bera-friends.png',
    id: '4',
  },
  {
    buttonTitle: 'Explore',
    icon: '/images/bera-chain.png',
    id: '5',
  },
  {
    buttonTitle: 'Explore',
    icon: '/images/daily-gaming.png',
    id: '6',
  },
];

type TaskItemProps = {
  idx: number;
  onError?: (id: string) => void;
  refetch: () => void;
  task: Task;
};

function TaskItem({ idx, onError, refetch, task }: TaskItemProps) {
  const taskData = TASK_DATA[idx % TASK_DATA.length];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const navigation = useRouter();
  const { handleSignMessage } = useSign();
  const { user } = useUser();
  const { data } = useGetTwitterOAuthLinkQuery(taskData.id === '2');
  const { isPending, mutate: createUserTask } = useCreateUserTask({
    onError: () => {
      Cookies.remove('twitterOAuth');
      setIsLoading(false);
      onError?.(taskData.id);
    },
    onSuccess: () => {
      Cookies.remove('twitterOAuth');
      setIsLoading(false);
      refetch();
      navigation.replace('/');
    },
  });

  async function handleTwitterTask(twitterOAuth: OAuthResponseDto) {
    const signDto = await handleSignMessage(task.id);
    createUserTask({
      createUserTaskDto: {
        oauth_token: twitterOAuth.oauth_token,
        oauth_token_secret: twitterOAuth.oauth_token_secret,
        oauth_verifier: twitterOAuth.oauth_verifier,
        taskId: task.id,
      },
      signDto,
    });
  }

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const twitterOAuth: OAuthResponseDto = JSON.parse(
      Cookies.get('twitterOAuth') === 'undefined'
        ? '{}'
        : Cookies.get('twitterOAuth') ?? '{}',
    );
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [discordAccessToken, discordTokenType] = [
      fragment.get('access_token'),
      fragment.get('token_type'),
    ];

    if (
      twitterOAuth?.oauth_token_secret &&
      oauth_token &&
      oauth_verifier &&
      taskData.id === '2'
    ) {
      handleTwitterTask({
        ...twitterOAuth,
        oauth_token,
        oauth_verifier,
      });
    } else if (discordAccessToken && discordTokenType && taskData.id === '3') {
      handleSignMessage(task.id).then((signDto) => {
        createUserTask({
          createUserTaskDto: {
            discordToken: `${discordTokenType} ${discordAccessToken}`,
            taskId: task.id,
          },
          signDto,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleCreateUserTask() {
    setIsLoading(true);
    let signDto: {
      key: string;
      message: string;
      signature: string;
    };

    switch (taskData.id) {
      case '1':
        signDto = await handleSignMessage(task.id);
        createUserTask({
          createUserTaskDto: {
            taskId: task.id,
          },
          signDto,
        });
        break;
      case '2':
        Cookies.set('twitterOAuth', JSON.stringify(data));
        window.open(data?.url, '_blank');
        setIsLoading(false);
        break;
      case '3':
        window.open(process.env.NEXT_PUBLIC_DISCORD_AUTH_URL, '_blank');
        setIsLoading(false);
        break;
      case '4':
        window.open('https://fartybera.com/invite', '_blank');
        break;
      default:
        window.open('https://berachain.com', '_blank');
        break;
    }
  }

  return (
    <div
      key={task.id}
      className="border-outset-gray-100 flex justify-between items-center p-3 bg-[#B8C0C1] shadow-md"
    >
      <div className="flex items-center">
        <img alt="task" className="size-5" src={taskData.icon} />
        <div className="flex flex-col gap-[2px] mr-4 ml-[10px] w-[120px]">
          <span className="text-sm font-medium">{task.title}</span>
          {!!task.description && (
            <span className="text-[9px]">{task.description}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <img alt="honey" className="size-5" src="/images/honey-icon.svg" />
          {task.value ? `+${task.value}` : '???'}
        </div>
      </div>
      <Button
        className="flex py-[6px] justify-center w-[67px] font-normal text-[10px]"
        disabled={task.isDone}
        loading={isPending || isLoading}
        type="primary"
        onClick={handleCreateUserTask}
      >
        {taskData.buttonTitle}
      </Button>
    </div>
  );
}

export function TasksWindow() {
  const { applications, setApplications } = useApplications();
  const { isTouch } = useTouchDevice();
  const application = ApplicationData[Applications.TASKS];
  const { data = [], refetch } = useTasksQuery();

  function handleOnError(taskDataId: string) {
    if (taskDataId === '1') {
      setApplications([
        ...applications,
        ApplicationData[Applications.TASK_NOT_ELIGIBLE],
      ]);
    }
  }

  return (
    <Window
      application={application}
      className={clsx(
        'w-[400px] top-[270px] right-2 max-h-[calc(100%-270px-40px)]',
        isTouch && 'hidden',
      )}
      containerClassName="overflow-y-auto"
    >
      <div className="flex flex-col p-3 gap-3 text-sm">
        <img
          alt="task-header"
          className="size-auto"
          src="/images/task-header.png"
        />
        {data.map((task, idx) => (
          <TaskItem
            key={task.id}
            idx={idx}
            refetch={refetch}
            task={task}
            onError={handleOnError}
          />
        ))}
      </div>
    </Window>
  );
}
