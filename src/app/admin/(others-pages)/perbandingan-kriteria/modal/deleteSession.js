"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ModalDeleteSession = ({ open, onClose, session, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await axios.delete("/api/session", { data: { id: session.id } });
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Error delete session", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Session</DialogTitle>
        </DialogHeader>
        <p>Apakah Anda yakin ingin menghapus session "{session?.nama}"?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDeleteSession