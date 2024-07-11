import clsx from 'clsx';
import { get } from 'lodash';
import { ReactNode } from 'react';

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
    isLoading = false,
    noDataText = 'No data available',
    tableBodyClassName,
    tableClassName,
  } = props;

  const columnsLength = columns.length;
  const isEmpty = data.length === 0;
  const renderHeaders = columns.map((column, index) => (
    <th
      key={column.key.toString()}
      className={clsx(
        'whitespace-nowrap px-[10px] py-0 text-left normal-case font-normal',
        index === columnsLength - 1 && 'px-3',
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
      key={row.id?.toString()}
      className={clsx('hover:bg-gray whitespace-nowrap bg-[#131B2F]/60')}
    >
      {columns.map((column, index) => (
        <td
          key={`${row.id?.toString()}-${column.key.toString()}`}
          className={clsx('px-[10px] py-2 align-middle', column.className)}
        >
          <div
            className={clsx(
              'flex',
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
    <tr className="">
      <td className="py-4 pl-4 pr-3 text-center" colSpan={columnsLength}>
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      </td>
    </tr>
  );

  const renderEmptyPlaceholder = (
    <tr className="">
      <td className="px-3 py-4 text-center" colSpan={columnsLength}>
        {noDataText}
      </td>
    </tr>
  );

  const emptyDisplay = isEmpty ? renderEmptyPlaceholder : renderRows;
  const renderBody = isLoading ? renderLoading : emptyDisplay;

  return (
    <div className={clsx('w-full flex-1 overflow-auto', containerClassName)}>
      <table
        className={clsx(
          'w-full table-fixed text-[13px] border-spacing-y-[10px] border-separate',
          tableClassName,
        )}
      >
        <thead className={clsx('sticky top-0 border-0')}>
          <tr className="font-normal">{renderHeaders}</tr>
        </thead>
        <tbody
          className={clsx('overflow-auto font-medium', tableBodyClassName)}
        >
          {renderBody}
        </tbody>
      </table>
    </div>
  );
}
