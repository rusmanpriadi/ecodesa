"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, X, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { successToast, errorToast } from "@/lib/toastUtils";





// Add Perbandingan Modal
 const AddPerbandinganModal = ({ sessions  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    created_at: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama) {
      newErrors.nama = "Kriteria pertama harus dipilih.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Ambil semua ID
const idSession = sessions.map((session) => session.id);

// Cari ID terbesar, kalau kosong default 0
const nextSessionId = (idSession.length > 0 ? Math.max(...idSession) : 0) + 1;




  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user makes changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = {
    
     nama: formData.nama
    };

    try {
      // Replace with actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.code === 201 || result.status) {
        setFormData({
          nama: "",
        });
        setErrors({});
        successToast("Success", {
          description: "Perbandingan kriteria berhasil ditambahkan.",
          duration: 4000,
        });
       
        setIsOpen(false);
      } else {
        setErrors({ value: result.message || "Gagal menambahkan perbandingan." });
      }
    } catch (error) {
      console.error("Error adding judgment:", error);
      setErrors({ value: "Gagal menambahkan perbandingan kriteria." });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs px-5 py-2" variant="green">
          <Plus size={16} className="mr-2" />
          Tambah Sesion
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-6 px-6 pt-4">
        <DialogHeader className="w-full flex flex-row items-center justify-between mb-4">
          <DialogTitle>
            <div className="w-full font-medium flex items-center space-x-2">
              <span className="p-1 text-green-600 bg-green-100 rounded-full">
                <Plus className="h-4 w-4" />
              </span>
              <p className="text-sm text-slate-700">
                Tambah Session
              </p>
            </div>
          </DialogTitle>

          <div className="flex gap-2 me-5">
            <Button
              className="text-xs px-4 py-2"
              variant="green"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Simpan"}
            </Button>
         
          </div>
        </DialogHeader>

        <section className="w-full space-y-4">
          {/* Session ID */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="session_id">Session ID</Label>
            <Input
              type="number"
              id="session_id"
              value={nextSessionId}
              onChange={(e) => handleInputChange('session_id', e.target.value)}
              placeholder="1"
              disabled
            />
           
          </div>

       

          {/* Nilai Perbandingan */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="nama">Nama Session</Label>
           <Input type="text" id="nama" name="nama" value={formData.nama} onChange={(e) => handleInputChange('nama', e.target.value)} placeholder="Nama Session" />
            {errors.nama && (
              <div className="flex items-center text-red-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.nama}
              </div>
            )}
          </div>

        
        </section>
      </DialogContent>
    </Dialog>
  );
};


export default AddPerbandinganModal