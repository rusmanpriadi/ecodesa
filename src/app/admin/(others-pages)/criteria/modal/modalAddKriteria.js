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
import { HiMiniMap } from "react-icons/hi2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import axios from "axios";

import { successToast } from "@/lib/toastUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddKriteriaModal = ({ onSave, existingKriteria = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    kode_kriteria: "",
    nama_kriteria: "",
    atribut: "",
    bobot: 0,
    deskripsi: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate kode kriteria otomatis
  const generateKodeKriteria = () => {
    if (existingKriteria.length === 0) {
      return "K01";
    }
    
    // Ambil nomor terakhir dari kode kriteria yang sudah ada
    const lastNumbers = existingKriteria
      .map(item => {
        const match = item.kode_kriteria.match(/^K(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => !isNaN(num));
    
    const maxNumber = Math.max(...lastNumbers, 0);
    const nextNumber = maxNumber + 1;
    
    // Format dengan leading zeros (3 digit)
    return `K${nextNumber.toString().padStart(3, '0')}`;
  };


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

    // Gabungkan prefix dan number untuk membuat kode_kriteria lengkap
    const kode_kriteria = formData.kode_prefix + formData.kode_number;
    const submitData = {
      kode_kriteria,
      nama_kriteria: formData.nama_kriteria,
      atribut: formData.atribut,
      bobot: formData.bobot,
      deskripsi: formData.deskripsi,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/criteria`,
        submitData
      );

      if (response.data.code === 201) {
        const nextNumber = generateKodeKriteria();
        setFormData({
          kode_prefix: "K",
          kode_number: nextNumber,
          nama_kriteria: "",
          atribut: "",
          bobot: 0,
          deskripsi: "",
        });
        setErrors({});
        successToast("Success.", {
          description: "Kriteria berhasil ditambah.",
          duration: 4000,
        });
        onSave(response.data.data);
        setIsOpen(false);
      } else if (response.data.code === 200) {
        setErrors({ nama_kriteria: response.data.message });
      }
    } catch (error) {
      console.error("Error adding kriteria:", error);
      if (error.response?.data?.message) {
        setErrors({ nama_kriteria: error.response.data.message });
      } else {
        setErrors({ nama_kriteria: "Gagal menambahkan kriteria." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Generate nomor kriteria otomatis saat modal dibuka
      const generateNumber = () => {
        if (!existingKriteria || existingKriteria.length === 0) {
          return "01";
        }
        
        // Ambil semua nomor yang ada dan urutkan
        const existingNumbers = existingKriteria
          .map(item => {
            const match = item.kode_kriteria?.match(/^K(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(num => !isNaN(num) && num > 0)
          .sort((a, b) => a - b);
        
        // Cari nomor yang kosong atau nomor selanjutnya
        let nextNumber = 1;
        for (let i = 0; i < existingNumbers.length; i++) {
          if (existingNumbers[i] !== nextNumber) {
            // Ada gap, gunakan nomor yang kosong
            break;
          }
          nextNumber++;
        }
        
        // Format dengan leading zero (2 digit)
        return nextNumber.toString().padStart(2, '0');
      };

      const nextNumber = generateNumber();
  
      setFormData({
        kode_prefix: "K",
        kode_number: nextNumber,
        nama_kriteria: "",
        atribut: "",
        bobot: 0,
        deskripsi: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Dialog className="p-2" open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs px-5 py-2" size="none" variant="green">
          Tambah
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-14 px-4 pt-3 max-w-md">
        <DialogHeader className="w-full flex flex-row items-center justify-between">
          <DialogTitle>
            <div className="w-full font-medium flex items-center space-x-2">
              <span className="p-1 text-greent bg-muted rounded-full">
                <HiMiniMap className="h-4 w-4" />
              </span>
              <p className="text-xs text-slate-700 w-full max-w-[135px] border-r">
                Create Kriteria
              </p>
            </div>
          </DialogTitle>

          <Button
            className="text-xs px-5 py-2 mr-8"
            size="none"
            variant="green"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Tambah"}
          </Button>
        </DialogHeader>

        <section className="w-full">

          <div className="grid grid-cols-2 gap-2">
          {/* Kode Kriteria */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="kode_kriteria">Kode Kriteria</Label>
            <div className="flex items-center space-x-2">
              {/* Prefix K (tidak dapat diubah) */}
              <div className="flex items-center">
                <Input
                  type="text"
                  value={formData.kode_prefix}
                  disabled
                  className="w-12 text-center bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              {/* Nomor kriteria (dapat diubah) */}
              <div className="flex-1 relative">
                <Input
                  type="text"
                  id="kode_number"
                  value={formData.kode_number}
                  onChange={handleInputChange}
                  placeholder="01"
                  maxLength="2"
                  className="text-center"
                />
                {errors.kode_number && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.kode_number}
                  </div>
                )}
              </div>
            </div>
            {/* <p className="text-xs text-gray-500">
              Preview: {formData.kode_prefix}{formData.kode_number}
            </p> */}
          </div>

          {/* Nama Kriteria */}
          <div className="grid w-full items-center gap-3 ">
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
            <div className="relative ">
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
        </section>
      </DialogContent>
    </Dialog>
  );
};