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

import { EditUsersModal } from "../modal/modalEditUsers";
import ModalDeletedCategori from "../modal/modalDeletedUsers";

const ColumnKriteria = ({ onSave }) => [
  {
    accessorKey: "No",
    header: () => <div className="">No</div>,
    cell: ({ row }) => <div className=" text-xs">{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: () => <div className="">Nama</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px]">
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="">Email</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px]">
          {row.getValue("email")}
        </div>
      );
    },
  },
 
  
  {
    accessorKey: "level",
    header: () => <div className="">Level</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px]">
          {row.getValue("level")}
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
          <ModalDeletedCategori onSave={onSave} usersData={posisiData} />
          <EditUsersModal
          userData={posisiData}
            onSave={onSave}
          />
        </div>
      );
    },
  },
];

export default ColumnKriteria;
