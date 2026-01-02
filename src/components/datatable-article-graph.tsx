"use client";

import { Dispatch, SetStateAction, useId, useState } from "react";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  EyeOff,
  PlusIcon,
  SearchIcon,
  Edit2Icon,
  PlayIcon,
  PauseIcon,
} from "lucide-react";

import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  RowData,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { usePagination } from "@/hooks/use-pagination";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteArticle, publishArticle } from "@/actions/articles/actions";
import { CreateDialog } from "./create-article-dialog";
import { ArticleModel, TagModel } from "@/db/schema/articles";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export type Item = {
  id: number;
  image?: string;
  title: string;
  content: string;
  authorId: string;
};

//ColumnDef<ArticleModel & { tags: TagModel[] }>[]
const columns = ({
  setCurrentArticle,
  setShowCreate,
}: {
  setCurrentArticle: Dispatch<SetStateAction<(ArticleModel & { tags: TagModel[] }) | null>>;
  setShowCreate: Dispatch<SetStateAction<boolean>>;
}): ColumnDef<ArticleModel & { tags: TagModel[] }>[] => [
  {
    header: "Articles",
    accessorKey: "title",
    cell: ({ row }: { row: Row<ArticleModel & { tags: TagModel[] }> }) => (
      <div className="flex items-center gap-2">
        <div className="bg-primary/5 flex size-10 items-center justify-center rounded-sm">
          <img
            src={
              row.original.image ||
              "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-26.png"
            }
            alt={row.getValue("title")}
            className="w-7.5"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("title")}</span>
        </div>
      </div>
    ),
    size: 360,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }: { row: Row<ArticleModel & { tags: TagModel[] }> }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild disabled={!row.original.published}>
              {row.original.published ? (
                <Link href={`/articles/${row.original.id}`}>
                  <Button variant="ghost" size={"icon"} aria-label="View item">
                    <EyeIcon className="size-4.5" />
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" size={"icon"} aria-label="View item">
                  <EyeOff className="size-4.5" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/my-articles/${row.original.id}/edit`}>
                <Button variant="ghost" size={"icon"} aria-label="Delete item">
                  <Edit2Icon className="size-4.5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          {row.original.published ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={"icon"}
                  aria-label="Publish item"
                  onClick={() =>
                    publishArticle({
                      id: Number(row.original.id),
                      published: false,
                    })
                  }
                >
                  <PauseIcon className="size-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Unpublish</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={"icon"}
                  aria-label="Publish item"
                  onClick={() =>
                    publishArticle({
                      id: Number(row.original.id),
                      published: true,
                    })
                  }
                >
                  <PlayIcon className="size-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Publish</p>
              </TooltipContent>
            </Tooltip>
          )}
          <RowActions
            article={row.original}
            setCurrentArticle={setCurrentArticle}
            setShowCreate={setShowCreate}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];

const ArticleDatatable = ({
  data,
  tagsData,
}: {
  data: (ArticleModel & { tags: TagModel[] })[];
  tagsData: TagModel[];
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pageSize = 5;

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [currentArticle, setCurrentArticle] = useState<(ArticleModel & { tags: TagModel[] }) | null>(
    null
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns: columns({ setCurrentArticle, setShowCreate }),
    state: {
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 2,
  });

  return (
    <div className="w-full">
      <div className="border-b">
        <div className="flex gap-4 p-6 max-sm:flex-col sm:items-center sm:justify-between">
          <Filter column={table.getColumn("title")!} />
          <div className="flex items-center gap-4 max-sm:gap-2 sm:flex-wrap sm:justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="#rowSelect" className="sr-only">
                Show
              </Label>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger
                  id="rowSelect"
                  className="w-fit whitespace-nowrap"
                >
                  <SelectValue placeholder="Select number of results" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto">
                  {[5, 10, 25, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              <PlusIcon />
              New Article
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-14 border-t">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="text-muted-foreground first:pl-4 last:px-4"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-transparent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="h-14 first:w-12.5 first:pl-4 last:w-29 last:px-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          Showing{" "}
          <span>
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0
              ),
              table.getRowCount()
            )}
          </span>{" "}
          of <span>{table.getRowCount().toString()} entries</span>
        </p>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50"
                  variant={"ghost"}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  Previous
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages.map((page) => {
                const isActive =
                  page === table.getState().pagination.pageIndex + 1;

                return (
                  <PaginationItem key={page}>
                    <Button
                      size="icon"
                      className={`${!isActive && "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"}`}
                      onClick={() => table.setPageIndex(page - 1)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50"
                  variant={"ghost"}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  Next
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      {showCreate && (
        <CreateDialog
          onClose={() => {
            setCurrentArticle(null);
            setShowCreate(false);
          }}
          availableTags={tagsData}
          defaultValues={currentArticle}
        />
      )}
    </div>
  );
};

export default ArticleDatatable;

function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const columnHeader =
    typeof column.columnDef.header === "string" ? column.columnDef.header : "";

  return (
    <div className="w-full max-w-2xs">
      <Label htmlFor={`${id}-input`} className="sr-only">
        {columnHeader}
      </Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer pl-9"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="text"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}

function RowActions({
  article,
  setShowCreate,
  setCurrentArticle,
}: {
  article: ArticleModel & { tags: TagModel[] };
  setShowCreate: Dispatch<SetStateAction<boolean>>;
  setCurrentArticle: Dispatch<SetStateAction<(ArticleModel & { tags: TagModel[] }) | null>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-2"
            aria-label="Edit item"
          >
            <EllipsisVerticalIcon className="size-4.5" aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setCurrentArticle(article);
              setShowCreate(true);
            }}
          >
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteArticle({ id: article.id })}>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
