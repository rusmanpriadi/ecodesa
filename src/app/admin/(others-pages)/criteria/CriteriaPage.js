"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { AddKriteriaModal } from "./modal/modalAddKriteria";

import axios from "axios";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DataTableToolbar } from "./table/data-table-toolbar";
import ColumnKriteria from "./table/columnKriteria";

const CriteriaPage = () => {
  const [data, setLokasi] = useState([]); // State untuk menyimpan data
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [refreshTable, setRefreshTable] = useState(false);

  // Mengambil data dari API saat komponen pertama kali dimuat

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/criteria`
        );
      

        setLokasi(response.data.data); // Simpan data dari API ke dalam state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLokasi();
  }, [refreshTable]); // Re-fetch when refresh prop changes

  const handleRefreshTable = () => {
    setRefreshTable((prev) => !prev);
  };

  const table = useReactTable({
    data,
    columns: ColumnKriteria({ onSave: handleRefreshTable }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="space-y-4 ">
      <section className="flex items-center justify-between w-full">
        <article>
          <h4 className="text-lg font-semibold">Kelola Criteria</h4>
          <p className="text-xs text-slate-500 mt-1">
            Make changes to your account here. Click save when you're done.
          </p>
        </article>
        <AddKriteriaModal  onSave={handleRefreshTable}
          existingKriteria={data}
        />
      </section>
      <div className="flex items-center justify-between mt-2">
        <DataTableToolbar table={table}  />
      </div>
      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-[13px]">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-[11px] text-slate-500 font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                  className="hover:bg-muted text-sm "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs">
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
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default CriteriaPage;
