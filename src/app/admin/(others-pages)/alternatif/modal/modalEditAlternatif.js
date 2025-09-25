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
  HiOutlinePencilSquare,
  HiMiniMap,
} from "react-icons/hi2";
import { successToast, errorToast } from "@/lib/toastUtils";

export const EditAlternatifModal = ({ onSave, alternatifData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    kode_prefix: "A",
    kode_number: "",
    kode_alternatif: "",
    pupuk: "",
    deskripsi: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form saat modal dibuka atau alternatifData berubah
  useEffect(() => {
    if (isOpen && alternatifData) {
      // Parse kode alternatif menjadi prefix dan number
      const match = alternatifData.kode_alternatif?.match(/^A(\d+)$/);
      const kodeNumber = match ? match[1] : "";

      setFormData({
        kode_prefix: "A",
        kode_number: kodeNumber,
        kode_alternatif: alternatifData.kode_alternatif || "",
        pupuk: alternatifData.pupuk || "",
        deskripsi: alternatifData.deskripsi || "",
      });
      setErrors({});
    }
  }, [isOpen, alternatifData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_number.trim()) {
      newErrors.kode_number = "Nomor kode tidak boleh kosong.";
    }

    if (!formData.pupuk.trim()) {
      newErrors.pupuk = "Nama kriteria tidak boleh kosong.";
    }

    // Validasi duplikasi kode kriteria (exclude current item)
    // Note: Anda perlu menambahkan existingKriteria sebagai prop atau state
    // const newKodeAlternatif = formData.kode_prefix + formData.kode_number;
    // const isDuplicate = existingKriteria.some(
    //   item => item.kode_alternatif === newKodeAlternatif && item.id !== alternatifData.id
    // );

    // if (isDuplicate) {
    //   newErrors.kode_number = "Kode alternatif sudah digunakan oleh alternatif lain.";
    // }

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

    const submitData = {
      kode_alternatif: formData.kode_alternatif,
      pupuk: formData.pupuk,
      deskripsi: formData.deskripsi || "",
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alternatif/${alternatifData.id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status && response.data.code === 200) {
        successToast("Success.", {
          description: "Alternatif berhasil diubah.",
          duration: 4000,
        });
        
        // Callback ke parent component dengan data yang diupdate
        const updatedData = {
          ...alternatifData,
          ...submitData
        };
        
        if (onSave) {
          onSave(updatedData);
        }
        
        setIsOpen(false);
      } else {
        setErrors({ 
          pupuk: response.data.message || "Terjadi kesalahan saat mengubah kriteria." 
        });
      }
    } catch (error) {
      console.error("Error updating kriteria:", error);
      
      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes("kode alternatif")) {
          setErrors({ kode_number: error.response.data.message });
        } else {
          setErrors({ pupuk: error.response.data?.message || "Data tidak valid." });
        }
      } else if (error.response?.status === 500) {
        setErrors({ pupuk: "Terjadi kesalahan server. Silakan coba lagi." });
      } else {
        setErrors({ pupuk: "Gagal mengubah alternatif." });
      }
      
      errorToast("Error.", {
        description: "Gagal mengubah alternatif.",
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
              Edit Alternatif
            </p>
          </DialogTitle>
        </DialogHeader>
        
        <section className="w-full">
          <div className="grid grid-cols-2 gap-2">
            {/* Kode alternatif */}
            <div className="grid w-full items-center gap-3 mt-3">
              <Label htmlFor="kode_alternatif">Kode Alternatif</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    id="kode_alternatif"
                    value={formData.kode_alternatif}
                    onChange={handleInputChange}
                    placeholder="A01"
                    disabled // Tetap disabled jika kode tidak boleh diubah
                    className="text-center"
                  />
                  {errors.kode_alternatif && (
                    <div className="flex items-center text-red-600 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.kode_alternatif}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nama alternatif */}
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="pupuk">Pupuk</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="pupuk"
                  value={formData.pupuk} // Menggunakan formData.pupuk bukan alternatifData.pupuk
                  onChange={handleInputChange}
                  placeholder="Masukkan nama alternatif"
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
                value={formData.deskripsi} // Menggunakan formData.deskripsi bukan alternatifData.deskripsi
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi alternatif (opsional)"
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