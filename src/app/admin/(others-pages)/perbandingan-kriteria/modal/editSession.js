"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ModalEditSession = ({ open, onClose, session, onUpdated }) => {
  const [nama, setNama] = useState(session?.nama || "");

  const handleSubmit = async () => {
    try {
      await axios.put("/api/session", { id: session.id, nama });
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error update session", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
        </DialogHeader>
        <Input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama session"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalEditSession