/* eslint-disable sonarjs/no-duplicate-string */
import clsx from 'clsx';
import { get } from 'lodash';
import { ReactNode } from 'react';

import { useTouchDevice } from '../../hooks';

import { Spinner } from './Spinner';

export type TableProps<T> = {
  columns: TableColumn<T>[];
  containerClassName?: string;
  data?: T[];
  headerClassName?: string;
  highlightRow?: number;
  isLoading?: boolean;
  noDataText?: string;
  tableBodyClassName?: string;
  tableClassName?: string;
};

export type TableColumn<T> = {
  className?: string;
  header: string | ReactNode;
  headerClassName?: string;
  key: keyof T | string;
  render?: (data: T, index?: number) => ReactNode;
};

export function Table<T extends { id: string }>(props: TableProps<T>) {
  const {
    columns,
    containerClassName,
    data = [],
    headerClassName,
    highlightRow,
    isLoading = false,
    noDataText = 'No data available',
    tableBodyClassName,
    tableClassName,
  } = props;
  const { isTouch } = useTouchDevice();

  const columnsLength = columns.length;
  const isEmpty = data.length === 0;
  const renderHeaders = columns.map((column, index) => (
    <th
      key={column.key.toString()}
      className={clsx(
        'whitespace-nowrap py-2 text-left normal-case',
        index === columnsLength - 1 && 'px-3',
        isTouch && 'px-3',
        headerClassName,
        column.headerClassName,
      )}
      scope="col"
    >
      {column.header}
    </th>
  ));

  const renderRows = data.map((row, idx) => (
    <tr
      key={row.id.toString()}
      className={clsx(
        'cursor-pointer hover:bg-gray w-full whitespace-nowrap',
        !isTouch && 'table table-fixed',
        highlightRow === idx && 'bg-[#FFDEAF]',
      )}
    >
      {columns.map((column, index) => (
        <td
          key={`${row.id.toString()}-${column.key.toString()}`}
          className={clsx('px-3 py-2 align-top', column.className)}
        >
          <div
            className={clsx(
              'flex',
              isTouch && 'px-3',
              index === columnsLength - 1 && 'justify-center',
            )}
          >
            {column?.render?.(row, idx) ?? get(row, column.key)}
          </div>
        </td>
      ))}
    </tr>
  ));

  const renderLoading = (
    <tr className={clsx('w-full', !isTouch && 'table table-fixed')}>
      <td className="py-4 pl-4 pr-3 text-center" colSpan={columnsLength}>
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      </td>
    </tr>
  );

  const renderEmptyPlaceholder = (
    <tr className={clsx('w-full', !isTouch && 'table table-fixed')}>
      <td className="px-3 py-4 text-center" colSpan={columnsLength}>
        {noDataText}
      </td>
    </tr>
  );

  const renderBody = isLoading
    ? renderLoading
    : isEmpty
      ? renderEmptyPlaceholder
      : renderRows;

  return (
    <div
      className={clsx(
        'w-full',
        isTouch && 'overflow-x-auto',
        containerClassName,
      )}
    >
      <table
        className={clsx(
          'text-[11px] w-full',
          !isTouch && 'table table-fixed',
          tableClassName,
        )}
      >
        <thead className={clsx('top-0 uppercase table w-full')}>
          <tr className={clsx('w-full', !isTouch && 'table table-fixed')}>
            {renderHeaders}
          </tr>
        </thead>
        <tbody
          className={clsx(
            'bg-white border-inset size-full block overflow-y-auto',
            tableBodyClassName,
          )}
        >
          {renderBody}
        </tbody>
      </table>
    </div>
  );
}
