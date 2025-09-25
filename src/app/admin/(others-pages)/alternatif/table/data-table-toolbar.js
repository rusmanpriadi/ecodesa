

import React from "react";

import {
  HiOutlineTicket,
  HiOutlineCodeBracketSquare,
  HiOutlineTrash,
} from "react-icons/hi2";


import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";

export function DataTableToolbar({ table }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari data alternatif..."
          value={
            typeof table.getColumn("pupuk")?.getFilterValue() ===
            "string"
              ? table.getColumn("pupuk")?.getFilterValue()
              : ""
          }
          onChange={(event) =>
            table.getColumn("pupuk")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
    
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
