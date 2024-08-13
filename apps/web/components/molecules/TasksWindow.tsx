import clsx from 'clsx';
import { MouseEvent } from 'react';

import { ApplicationData, Applications } from '../../constants';
import { useApplications } from '../../contexts';
import { useTasksQuery, useTouchDevice } from '../../hooks';
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

export function TasksWindow() {
  const { applications, setApplications } = useApplications();
  const { isTouch } = useTouchDevice();
  const application = ApplicationData[Applications.TASKS];
  const { data = [] } = useTasksQuery();

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
        {data.map((task, idx) => {
          const taskData = TASK_DATA[idx % TASK_DATA.length];

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
                  <img
                    alt="honey"
                    className="size-5"
                    src="/images/honey-icon.svg"
                  />
                  {task.value ? `+${task.value}` : '???'}
                </div>
              </div>
              <Button
                className="flex py-[6px] justify-center w-[67px] font-normal text-[10px]"
                type="primary"
                onClick={() => {
                  // no op
                }}
              >
                {taskData.buttonTitle}
              </Button>
            </div>
          );
        })}
      </div>
    </Window>
  );
}
