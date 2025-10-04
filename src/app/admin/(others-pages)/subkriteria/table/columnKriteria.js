import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HiOutlineArchiveBoxXMark,
  HiOutlineEye,
  HiMiniStop,
} from "react-icons/hi2";
import { FaCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

import { EditKriteriaModal } from "../modal/modalEditKriteria";
import ModalDeletedCategori from "../modal/modalDeletedCategori";

const ColumnKriteria = ({ onSave }) => [
  {
    accessorKey: "No",
    header: () => <div className="">No</div>,
    cell: ({ row }) => <div className=" text-xs">{row.index + 1}</div>,
  },
  {
    accessorKey: "kode_kriteria",
    header: () => <div className="">Kode </div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px]">
          {row.getValue("kode_kriteria")}
        </div>
      );
    },
  },
  {
    accessorKey: "kriteria",
    header: () => <div className=""> Kriteria</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-[450px]">
          {row.getValue("nama_kriteria")}
        </div>
      );
    },
  },
  {
    accessorKey: "nama_kriteria",
    header: () => <div className="">SubKriteria</div>,

    cell: ({ row }) => {
  
      const posisiData = row.original;
      // console.log('posisiData', posisiData);
      return (
        <div className=" text-xs  w-[450px]">
          {posisiData.subkriteria_array
.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-[12px] text-black">
                {item.bobot}.
              </span>
              <span className="">{item.subkriteria}</span>
            </div>
          ))}
          {posisiData.length === 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-500">
                <FaCircle className="h-2 w-2" />
              </span>
              <span className="">-</span>
            </div>
          )}
        </div>

      );
    },
  },
 
 
  
  {
    id: "actions",
    header: () => <div className="text-center">Aksi</div>,
    cell: ({ row }) => {
      const posisiData = row.original;
   

      return (
        <div className="w-full flex space-x-2 items-center justify-center">
          <ModalDeletedCategori onSave={onSave} criteriaData={posisiData} />
          {/* <EditKriteriaModal
          criteriaData={posisiData}
            onSave={onSave}
          /> */}
        </div>
      );
    },
  },
];

export default ColumnKriteria;
