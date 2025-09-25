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
import { AlertCircle, FileText, Image, Calendar } from "lucide-react";
import axios from "axios";

import {
  HiOutlinePencilSquare,
  HiMiniMap,
} from "react-icons/hi2";
import { successToast, errorToast } from "@/lib/toastUtils";

export const EditGaleriModal = ({ onSave, editMode = true, galeriData}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    images: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when galeriData changes
  useEffect(() => {
    if (galeriData) {
      setFormData({
        judul: galeriData.judul || "",
        deskripsi: galeriData.deskripsi || "",
        tanggal: galeriData.tanggal ? new Date(galeriData.tanggal).toISOString().split('T')[0] : "",
        images: null, // File input always starts null
      });
    }
  }, [galeriData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = "Judul tidak boleh kosong.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    
    if (id === "images" && files) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

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

  try {
    // Create FormData for file upload
    const formDataSubmit = new FormData();
    formDataSubmit.append('judul', formData.judul);
    formDataSubmit.append('tanggal', formData.tanggal || '');
    formDataSubmit.append('deskripsi', formData.deskripsi || '');
    
    if (formData.images) {
      formDataSubmit.append('file', formData.images);
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/galeri/${galeriData.id}`,
      formDataSubmit,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.status && response.data.code === 200) {
      successToast("Berhasil!", {
        description: "Galeri berhasil diubah.",
        duration: 4000,
      });
      
      const updatedData = response.data.data;
      
      if (onSave) {
        onSave(updatedData);
      }
      
      setIsOpen(false);
    } else {
      setErrors({ 
        judul: response.data.message || "Terjadi kesalahan saat mengubah galeri." 
      });
    }
  } catch (error) {
    console.error("Error updating galeri:", error);
    
    if (error.response?.status === 400) {
      setErrors({ judul: error.response.data.message || "Data tidak valid." });
    } else if (error.response?.status === 404) {
      setErrors({ judul: "Data galeri tidak ditemukan." });
    } else if (error.response?.status === 405) {
      setErrors({ judul: "Method tidak diizinkan. Periksa endpoint API." });
    } else if (error.response?.status === 500) {
      setErrors({ judul: "Terjadi kesalahan server. Silakan coba lagi." });
    } else {
      setErrors({ judul: "Gagal mengubah galeri." });
    }
    
    errorToast("Error!", {
      description: "Gagal mengubah galeri.",
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
      // Reset form data to original values
      if (galeriData) {
        setFormData({
          judul: galeriData.judul || "",
          deskripsi: galeriData.deskripsi || "",
          tanggal: galeriData.tanggal ? new Date(galeriData.tanggal).toISOString().split('T')[0] : "",
          images: null,
        });
      }
    }
  }, [isOpen, galeriData]);

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
            <span className="p-1 text-blue-600 bg-muted rounded-full">
              <HiMiniMap className="h-4 w-4" />
            </span>
            <p className="text-xs text-slate-700 w-full max-w-[135px] border-r">
              Edit Galeri
            </p>
          </DialogTitle>
        </DialogHeader>
        
        <section className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul */}
            <div>
              <Label htmlFor="judul" className="text-base font-medium text-gray-700 flex items-center mb-2">
                <FileText className="mr-2 h-4 w-4" />
                Judul *
              </Label>
              <Input
                id="judul"
                name="judul"
                type="text"
                value={formData.judul}
                onChange={handleInputChange}
                placeholder="Masukkan judul galeri"
                required
                className={`h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.judul ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.judul && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {errors.judul}
                </p>
              )}
            </div>

            {/* Tanggal */}
            <div>
              <Label htmlFor="tanggal" className="text-base font-medium text-gray-700 flex items-center mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                Tanggal
              </Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="deskripsi" className="text-base font-medium text-gray-700 flex items-center mb-2">
              <FileText className="mr-2 h-4 w-4" />
              Deskripsi
            </Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi untuk galeri ini"
              rows={4}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Upload Foto */}
          <div>
            <Label htmlFor="images" className="text-base font-medium text-gray-700 flex items-center mb-2">
              <Image className="mr-2 h-4 w-4" />
              Foto {editMode ? "(Opsional - biarkan kosong jika tidak ingin mengubah foto)" : "*"}
            </Label>
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="cursor-pointer h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.images && (
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <Image className="mr-1 h-4 w-4" />
                File dipilih: {formData.images.name}
              </p>
            )}
            {galeriData?.images && !formData.images && (
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <Image className="mr-1 h-4 w-4" />
                Foto saat ini: {galeriData.images.split('/').pop()}
              </p>
            )}
          </div>

          <div className="w-full flex justify-end">
            <Button
              className="text-xs items-center px-5 py-2 mt-5 mr-8 bg-blue-600 hover:bg-blue-700 text-white"
              size="none"
              variant="none"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengupdate..." : "Update Galeri"}
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};