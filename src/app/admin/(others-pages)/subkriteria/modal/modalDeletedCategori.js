"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

import {
  HiOutlineArchiveBoxXMark,
} from "react-icons/hi2";
import { infoToast } from "@/lib/toastUtils";

export default function ModalDeletedCategori({ onSave, criteriaData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subkriteria/${criteriaData.id}`
      );
      onSave(); // Call the parent component's refresh function
      infoToast("Info.", {
        description: "Subkriteria berhasil dihapus",
        duration: 4000,
      })
      setIsOpen(false); // Close the modal
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="none"
          className="py-2 px-2 text-xs  text-slate-800 bg-white  hover:bg-slate-200 "
          onClick={() => setIsOpen(true)}
        >
          <HiOutlineArchiveBoxXMark className="text-lg  font-semibold text-red-500 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-5">
        <DialogHeader>
          <DialogTitle>Delete Kriteria</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Apakah Anda yakin ingin menghapus Subkriteria ini?</p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
           variant="destructive"
            onClick={handleDelete}
            disabled={loading}
           
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
