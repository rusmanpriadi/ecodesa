"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
    kode_number: "",
    pupuk: "",
    deskripsi: "",
    jenis: "",
    harga: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_number.trim()) {
      newErrors.kode_number = "Nomor kode tidak boleh kosong.";
    }

    if (!formData.pupuk.trim()) {
      newErrors.pupuk = "Nama pupuk tidak boleh kosong.";
    }

    if (formData.harga && isNaN(formData.harga)) {
      newErrors.harga = "Harga harus berupa angka.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          images: "Format gambar tidak valid. Gunakan JPG, PNG, atau WEBP.",
        }));
        return;
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "Ukuran gambar maksimal 5MB.",
        }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const kode_alternatif = formData.kode_prefix + formData.kode_number;

    // Gunakan FormData untuk mengirim file
    const submitFormData = new FormData();
    submitFormData.append("kode_alternatif", kode_alternatif);
    submitFormData.append("pupuk", formData.pupuk);
    submitFormData.append("deskripsi", formData.deskripsi);
    submitFormData.append("jenis", formData.jenis);
    submitFormData.append("harga", formData.harga || 0);
    
    if (imageFile) {
      submitFormData.append("images", imageFile);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alternatif`,
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code === 201) {
        setFormData({
          kode_prefix: "A",
          kode_number: "",
          pupuk: "",
          deskripsi: "",
          jenis: "",
          harga: "",
        });
        setImageFile(null);
        setImagePreview(null);
        setErrors({});
        successToast("Success.", {
          description: "Alternatif berhasil ditambahkan.",
          duration: 4000,
        });
        onSave(response.data.data);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error adding alternatif:", error);
      if (error.response?.data?.message) {
        setErrors({ pupuk: error.response.data.message });
      } else {
        setErrors({ pupuk: "Gagal menambahkan alternatif." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const generateNumber = () => {
        if (!existingAlternatif || existingAlternatif.length === 0) {
          return "01";
        }

        const existingNumbers = existingAlternatif
          .map((item) => {
            const match = item.kode_alternatif?.match(/^A(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter((num) => !isNaN(num) && num > 0)
          .sort((a, b) => a - b);

        let nextNumber = 1;
        for (let i = 0; i < existingNumbers.length; i++) {
          if (existingNumbers[i] !== nextNumber) {
            break;
          }
          nextNumber++;
        }

        return nextNumber.toString().padStart(2, "0");
      };

      const nextNumber = generateNumber();

      setFormData({
        kode_prefix: "A",
        kode_number: nextNumber,
        pupuk: "",
        deskripsi: "",
        jenis: "",
        harga: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setErrors({});
    }
  }, [isOpen, existingAlternatif]);

  return (
    <Dialog className="p-2" open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs px-5 py-2" size="none" variant="green">
          Tambah
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-14 px-4 pt-3 max-w-md max-h-[90vh] overflow-y-auto">
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
            {/* Kode Alternatif */}
            <div className="grid w-full items-center gap-3 mt-3">
              <Label htmlFor="kode_alternatif">Kode Alternatif</Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={formData.kode_prefix}
                    disabled
                    className="w-12 text-center bg-gray-100 cursor-not-allowed"
                  />
                </div>

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
            </div>

            {/* Nama Pupuk */}
            <div className="grid w-full items-center gap-3 mt-3">
              <Label htmlFor="pupuk">Pupuk</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="pupuk"
                  value={formData.pupuk}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama pupuk"
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
                placeholder="Masukkan deskripsi alternatif (opsional)"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Jenis dan Harga */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="jenis">Jenis</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="jenis"
                  value={formData.jenis}
                  onChange={handleInputChange}
                  placeholder="Masukkan jenis pupuk"
                />
                {errors.jenis && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.jenis}
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="harga">Harga</Label>
              <div className="relative">
                <Input
                  type="number"
                  id="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
                {errors.harga && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.harga}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="images">Gambar</Label>
            <div className="relative">
              <Input
                type="file"
                id="images"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="cursor-pointer"
              />
              {errors.images && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.images}
                </div>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};