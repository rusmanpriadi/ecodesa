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

import { EditAlternatifModal } from "../modal/modalEditAlternatif";
import ModalDeletedAlternatif from "../modal/modalDeletedCategori";

const ColumnAlternatif = ({ onSave }) => [
  {
    accessorKey: "No",
    header: () => <div className="">No</div>,
    cell: ({ row }) => <div className=" text-xs w-[50px]">{row.index + 1}</div>,
  },
  {
    accessorKey: "kode_alternatif",
    header: () => <div className="">Kode Alternatif</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[150px]">
          {row.getValue("kode_alternatif")}
        </div>
      );
    },
  },
  {
    accessorKey: "pupuk",
    header: () => <div className="">Pupuk</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs max-w-[650px]">
          {row.getValue("pupuk")}
        </div>
      );
    },
  },
  
  {
    accessorKey: "deskripsi",
    header: () => <div className="">Deskripsi</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px] text-wrap">
          {row.getValue("deskripsi")}
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
          <ModalDeletedAlternatif onSave={onSave} alternatifData={posisiData} />
          <EditAlternatifModal
            alternatifData={posisiData}
            onSave={onSave}
          />
        </div>
      );
    },
  },
];

export default ColumnAlternatif;
