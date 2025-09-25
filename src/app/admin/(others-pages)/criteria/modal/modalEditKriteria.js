"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HiMiniUserGroup } from "react-icons/hi2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HiOutlinePencilSquare,
  HiMiniMap,
} from "react-icons/hi2";
import { successToast, errorToast } from "@/lib/toastUtils";

export const EditKriteriaModal = ({ onSave, criteriaData, existingKriteria = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    kode_prefix: "K",
    kode_number: "",
    kode_kriteria: "",
    nama_kriteria: "",
    atribut: "",
    bobot: 0,
    deskripsi: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form saat modal dibuka atau criteriaData berubah
  useEffect(() => {
    if (isOpen && criteriaData) {
      // Parse kode kriteria menjadi prefix dan number
      const match = criteriaData.kode_kriteria?.match(/^K(\d+)$/);
      const kodeNumber = match ? match[1] : "";

      setFormData({
        kode_prefix: "K",
        kode_number: kodeNumber,
        nama_kriteria: criteriaData.nama_kriteria || "",
        atribut: criteriaData.atribut || "",
        bobot: criteriaData.bobot || 0,
        deskripsi: criteriaData.deskripsi || "",
      });
      setErrors({});
    }
  }, [isOpen, criteriaData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_number.trim()) {
      newErrors.kode_number = "Nomor kode tidak boleh kosong.";
    }

    if (!formData.nama_kriteria.trim()) {
      newErrors.nama_kriteria = "Nama kriteria tidak boleh kosong.";
    }

    if (!formData.atribut) {
      newErrors.atribut = "Atribut harus dipilih.";
    }

    if (!formData.bobot || formData.bobot <= 0) {
      newErrors.bobot = "Bobot harus lebih dari 0.";
    }

    // Validasi duplikasi kode kriteria (exclude current item)
    const newKodeKriteria = formData.kode_prefix + formData.kode_number;
    const isDuplicate = existingKriteria.some(
      item => item.kode_kriteria === newKodeKriteria && item.id !== criteriaData.id
    );

    if (isDuplicate) {
      newErrors.kode_number = "Kode kriteria sudah digunakan oleh kriteria lain.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user selects
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
      kode_kriteria: criteriaData.kode_kriteria,
      nama_kriteria: formData.nama_kriteria,
      atribut: formData.atribut,
      bobot: parseFloat(formData.bobot),
      deskripsi: formData.deskripsi || "",
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/criteria/${criteriaData.id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status && response.data.code === 200) {
        successToast("Success.", {
          description: "Kriteria berhasil diubah.",
          duration: 4000,
        });
        
        // Callback ke parent component dengan data yang diupdate
        const updatedData = {
          ...criteriaData,
          ...submitData
        };
        
        if (onSave) {
          onSave(updatedData);
        }
        
        setIsOpen(false);
      } else {
        setErrors({ 
          nama_kriteria: response.data.message || "Terjadi kesalahan saat mengubah kriteria." 
        });
      }
    } catch (error) {
      console.error("Error updating kriteria:", error);
      
      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes("kode kriteria")) {
          setErrors({ kode_number: error.response.data.message });
        } else {
          setErrors({ nama_kriteria: error.response.data?.message || "Data tidak valid." });
        }
      } else if (error.response?.status === 500) {
        setErrors({ nama_kriteria: "Terjadi kesalahan server. Silakan coba lagi." });
      } else {
        setErrors({ nama_kriteria: "Gagal mengubah kriteria." });
      }
      
      errorToast("Error.", {
        description: "Gagal mengubah kriteria.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Dialog className="p-2" open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Button
            variant="outline"
            size="none"
            className="text-xs py-2 px-2 text-slate-800 bg-white hover:bg-slate-200"
          >
            <HiOutlinePencilSquare className="text-lg font-semibold text-indigo-500" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="pb-14 px-4 pt-3 max-w-md">
        <DialogHeader className="w-full flex items-center justify-between flex-row">
          <DialogTitle className="w-full font-medium flex items-center space-x-2">
            <span className="p-1 text-bluet bg-muted rounded-full">
              <HiMiniMap className="h-4 w-4" />
            </span>
            <p className="text-xs text-slate-700 w-full max-w-[135px] border-r">
              Edit Kriteria
            </p>
          </DialogTitle>
         
        </DialogHeader>
        
        <section className="w-full">
          <div className="grid grid-cols-2 gap-2">
            {/* Kode Kriteria */}
            <div className="grid w-full items-center gap-3 mt-3">
              <Label htmlFor="kode_kriteria">Kode Kriteria</Label>
              <div className="flex items-center space-x-2">
              
                
                {/* Nomor kriteria (dapat diubah) */}
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    id="kode_kriteria"
                    value={criteriaData.kode_kriteria}
                    onChange={handleInputChange}
                    placeholder="01"
                    maxLength="4"
                    disabled
                    className="text-center"
                  />
                  {errors.kode_kriteria && (
                    <div className="flex items-center text-red-600 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.kode_kriteria}
                    </div>
                  )}
                </div>
              </div>
            
            </div>

            {/* Nama Kriteria */}
            <div className="grid w-full items-center gap-3 mt-3">
              <Label htmlFor="nama_kriteria">Nama Kriteria</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="nama_kriteria"
                  value={formData.nama_kriteria}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama kriteria"
                  
                />
                {errors.nama_kriteria && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.nama_kriteria}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Atribut */}
            <div className="grid w-full items-center gap-3 mt-3">
              <Label htmlFor="atribut">Atribut</Label>
              <div className="relative">
                <Select
                  value={formData.atribut}
                  onValueChange={(value) => handleSelectChange("atribut", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih atribut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost">Cost</SelectItem>
                    <SelectItem value="benefit">Benefit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.atribut && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.atribut}
                  </div>
                )}
              </div>
            </div>

            {/* Bobot */}
            <div className="grid w-full items-center gap-3 mt-3">
              <Label htmlFor="bobot">Bobot</Label>
              <div className="relative">
                <Input
                  type="number"
                  id="bobot"
                  value={formData.bobot}
                  onChange={handleInputChange}
                  placeholder="Masukkan bobot (0-1)"
                  step="0.01"
                  min="0"
                  max="1"
                />
                {errors.bobot && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.bobot}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <div className="relative">
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi kriteria (opsional)"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <div className="w-full flex justify-end">

           <Button
            className="text-xs items-center px-5 py-2 mt-5 mr-8 bg-bluet hover:bg-blue-600 text-white"
            size="none"
            variant="none"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Update"}
        </Button>
            </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};