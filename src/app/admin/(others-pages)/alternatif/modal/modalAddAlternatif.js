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


export const AddAlternatifModal = ({ onSave, existingAlternatif = [] }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    kode_prefix: "A",
  kode_number: "",   // <-- ini yg dipakai
    pupuk: "",
    deskripsi: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate kode pupuk otomatis
  const generateKodeAlternatif = () => {
    if (existingAlternatif.length === 0) {
      return "A01";
    }
    
    // Ambil nomor terakhir dari kode alternaitf yang sudah ada
    const lastNumbers = existingAlternatif
      .map(item => {
        const match = item.kode_alternatif.match(/^A(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => !isNaN(num));
    
      
    // Cari nomor tertinggi dan tambahkan 1
    const maxNumber = Math.max(...lastNumbers, 0);
    const nextNumber = maxNumber + 1;

    // Format dengan leading zeros (3 digit)
    return `A${nextNumber.toString().padStart(3, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_number.trim()) {
      newErrors.kode_number = "Nomor kode tidak boleh kosong.";
    }

    if (!formData.pupuk.trim()) {
      newErrors.pupuk = "Nama pupuk tidak boleh kosong.";
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



  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Gabungkan prefix dan number untuk membuat kode_alternatif lengkap
    const kode_alternatif = formData.kode_prefix + formData.kode_number;
    const submitData = {
      kode_alternatif,
      pupuk: formData.pupuk,
      deskripsi: formData.deskripsi,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alternatif`,
        submitData
      );

      if (response.data.code === 201) {
        const nextNumber = generateKodeAlternatif();
        setFormData({
          kode_prefix: "A",
          kode_number: nextNumber,
          pupuk: "",
          deskripsi: "",
        });
        setErrors({});
        successToast("Success.", {
          description: "alternaitf berhasil ditambah.",
          duration: 4000,
        });
        onSave(response.data.data);
        setIsOpen(false);
      } else if (response.data.code === 200) {
        setErrors({ pupuk: response.data.message });
      }
    } catch (error) {
      console.error("Error adding alternaitf:", error);
      if (error.response?.data?.message) {
        setErrors({ pupuk: error.response.data.message });
      } else {
        setErrors({ pupuk: "Gagal menambahkan alternaitf." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Generate nomor alternaitf otomatis saat modal dibuka
      const generateNumber = () => {
        if (!existingAlternatif || existingAlternatif.length === 0) {
          return "01";
        }
        
        // Ambil semua nomor yang ada dan urutkan
        const existingNumbers = existingAlternatif
          .map(item => {
            const match = item.kode_alternatif?.match(/^A(\d+)$/);
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
        kode_prefix: "A",
        kode_number: nextNumber,
        pupuk: "",
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
                Create Alternatif
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
          {/* Kode alternaitf */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="kode_alternatif">Kode Alternatif</Label>
            <div className="flex items-center space-x-2">
              {/* Prefix A (tidak dapat diubah) */}
              <div className="flex items-center">
                <Input
                  type="text"
                  value={formData.kode_prefix}
                  disabled
                  className="w-12 text-center bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              {/* Nomor alternatif (dapat diubah) */}
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

          {/* Nama alternaitf */}
          <div className="grid w-full items-center gap-3 ">
            <Label htmlFor="pupuk">Pupuk</Label>
            <div className="relative">
              <Input
                type="text"
                id="pupuk"
                value={formData.pupuk}
                onChange={handleInputChange}
                placeholder="Masukkan nama alternaitf"
              />
              {errors.pupuk && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.pupuk}
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
                placeholder="Masukkan deskripsi alternaitf (opsional)"
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