'use client';

import { useState, memo } from 'react';
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
} from '@helpdesk/shared/ui';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const SearchToolbarMemo = memo(function SearchToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="search"
        aria-label={searchPlaceholder}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={
          onSearchSubmit
            ? (e) => e.key === 'Enter' && onSearchSubmit()
            : undefined
        }
        className="max-w-sm"
      />
      {onSearchSubmit && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onSearchSubmit}
        >
          Ara
        </Button>
      )}
    </div>
  );
});

interface DataTableProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  serverSide?: boolean;
  pageCount?: number;
  itemCount?: number;
  pageIndex?: number;
  onPageChange?: (pageIndex: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
}

export function DataTable<TData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  serverSide = false,
  pageCount = 0,
  itemCount = 0,
  pageIndex = 0,
  onPageChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      ...(serverSide && {
        pagination: { pageIndex, pageSize: 0 },
      }),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    ...(serverSide
      ? {
          manualPagination: true,
          pageCount,
        }
      : {
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }),
  });

  const displayCount = serverSide
    ? itemCount
    : table.getFilteredRowModel().rows.length;
  const canPrev = serverSide ? pageIndex > 0 : table.getCanPreviousPage();
  const canNext = serverSide
    ? pageIndex < pageCount - 1
    : table.getCanNextPage();
  const currentPage = serverSide
    ? pageIndex + 1
    : table.getState().pagination.pageIndex + 1;
  const totalPages = serverSide ? Math.max(1, pageCount) : table.getPageCount();
  const handlePrev = serverSide
    ? () => onPageChange?.(pageIndex - 1)
    : () => table.previousPage();
  const handleNext = serverSide
    ? () => onPageChange?.(pageIndex + 1)
    : () => table.nextPage();
  const handleFirst = serverSide
    ? () => onPageChange?.(0)
    : () => table.setPageIndex(0);
  const handleLast = serverSide
    ? () => onPageChange?.(pageCount - 1)
    : () => table.setPageIndex(table.getPageCount() - 1);

  const searchInputValue =
    serverSide && searchKey && onSearchChange
      ? (searchValue ?? '')
      : ((table.getColumn(searchKey ?? '')?.getFilterValue() as string) ?? '');
  const searchInputOnChange =
    serverSide && searchKey && onSearchChange
      ? (e: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
      : (e: React.ChangeEvent<HTMLInputElement>) =>
          table.getColumn(searchKey ?? '')?.setFilterValue(e.target.value);

  const searchToolbar =
    searchKey && serverSide && onSearchChange ? (
      <SearchToolbarMemo
        searchPlaceholder={searchPlaceholder}
        searchValue={searchInputValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />
    ) : searchKey ? (
      <div className="flex items-center gap-2">
        <Input
          type="search"
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={searchInputValue}
          onChange={searchInputOnChange}
          onKeyDown={
            onSearchSubmit
              ? (e) => e.key === 'Enter' && onSearchSubmit()
              : undefined
          }
          className="max-w-sm"
        />
        {onSearchSubmit && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onSearchSubmit}
          >
            Ara
          </Button>
        )}
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      {searchToolbar}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Total {displayCount} records
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFirst}
            disabled={!canPrev}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={!canPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLast}
            disabled={!canNext}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
