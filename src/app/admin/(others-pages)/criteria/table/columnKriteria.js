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
    header: () => <div className="">Kode Kriteria</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px]">
          {row.getValue("kode_kriteria")}
        </div>
      );
    },
  },
  {
    accessorKey: "nama_kriteria",
    header: () => <div className="">Nama kriteria</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px]">
          {row.getValue("nama_kriteria")}
        </div>
      );
    },
  },
  {
    accessorKey: "atribut",
    header: () => <div className="">Atribut</div>,

    cell: ({ row }) => {
      const atribut = row.getValue("atribut");
      return (
        <div className={`${atribut === "benefit" ? "bg-blue-100  border-blue-200 text-blue-800" : "bg-red-100 text-red-800 border-red-200"} text-xs font-medium  px-2 py-0.5 rounded-full inline-block truncate  max-w-[150px] border capitalize
                
`}>
          {row.getValue("atribut")}
        </div>
      );
    },
  },
  
  // {
  //   accessorKey: "bobot",
  //   header: () => <div className="">Bobot</div>,

  //   cell: ({ row }) => {
  //     return (
  //       <div className=" text-xs w-full max-w-[650px]">
  //         {row.getValue("bobot")}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "deskripsi",
    header: () => <div className="">Deskripsi</div>,

    cell: ({ row }) => {
      return (
        <div className=" text-xs w-full max-w-[650px]">
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
          <ModalDeletedCategori onSave={onSave} criteriaData={posisiData} />
          <EditKriteriaModal
          criteriaData={posisiData}
            onSave={onSave}
          />
        </div>
      );
    },
  },
];

export default ColumnKriteria;
