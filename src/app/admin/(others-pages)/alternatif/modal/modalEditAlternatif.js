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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, X, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { HiOutlinePencilSquare, HiMiniMap } from "react-icons/hi2";
import { successToast, errorToast } from "@/lib/toastUtils";

export const EditAlternatifModal = ({ onSave, alternatifData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    kode_alternatif: "",
    pupuk: "",
    deskripsi: "",
    jenis: "",
    harga: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when modal opens
  useEffect(() => {
    if (isOpen && alternatifData) {
      setFormData({
        kode_alternatif: alternatifData.kode_alternatif || "",
        pupuk: alternatifData.pupuk || "",
        deskripsi: alternatifData.deskripsi || "",
        jenis: alternatifData.jenis || "",
        harga: alternatifData.harga || "",
      });
      setCurrentImage(alternatifData.images || null);
      setImagePreview(null);
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen, alternatifData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_alternatif.trim()) {
      newErrors.kode_alternatif = "Kode alternatif tidak boleh kosong.";
    }

    if (!formData.pupuk.trim()) {
      newErrors.pupuk = "Nama pupuk tidak boleh kosong.";
    }

    if (formData.harga && isNaN(formData.harga)) {
      newErrors.harga = "Harga harus berupa angka.";
    }

    if (formData.harga && Number(formData.harga) < 0) {
      newErrors.harga = "Harga tidak boleh negatif.";
    }

    // Validate image file if selected
    if (imageFile) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageFile.type)) {
        newErrors.images = "Format file harus JPEG, JPG, PNG, atau WebP.";
      }
      // if (imageFile.size > 5 * 1024 * 1024) {
      //   newErrors.images = "Ukuran file maksimal 5MB.";
      // }
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
    const file = e.target.files?.[0];
    if (file) {
      // Validate immediately
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, images: "Format file harus JPEG, JPG, PNG, atau WebP." }));
        return;
      }
      // if (file.size > 5 * 1024 * 1024) {
      //   setErrors((prev) => ({ ...prev, images: "Ukuran file maksimal 5MB." }));
      //   return;
      // }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("images");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("kode_alternatif", formData.kode_alternatif);
      submitFormData.append("pupuk", formData.pupuk);
      submitFormData.append("deskripsi", formData.deskripsi || "");
      submitFormData.append("jenis", formData.jenis || "");
      submitFormData.append("harga", formData.harga || 0);

      // Only append image if a new one was selected
      if (imageFile) {
        submitFormData.append("images", imageFile);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alternatif/${alternatifData.id}`,
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status && response.data.code === 200) {
        successToast("Berhasil!", {
          description: "Alternatif berhasil diperbarui.",
          duration: 4000,
        });

        if (onSave) {
          onSave(response.data.data);
        }

        setIsOpen(false);
      } else {
        throw new Error(response.data.message || "Gagal memperbarui alternatif");
      }
    } catch (error) {
      console.error("Error updating alternatif:", error);

      let errorMessage = "Gagal memperbarui alternatif.";

      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Data tidak valid.";
        if (errorMessage.toLowerCase().includes("kode alternatif")) {
          setErrors({ kode_alternatif: errorMessage });
        } else if (errorMessage.toLowerCase().includes("format file") || errorMessage.toLowerCase().includes("ukuran file")) {
          setErrors({ images: errorMessage });
        } else {
          setErrors({ pupuk: errorMessage });
        }
      } else if (error.response?.status === 404) {
        errorMessage = "Alternatif tidak ditemukan.";
      } else if (error.response?.status === 500) {
        errorMessage = "Terjadi kesalahan server. Silakan coba lagi.";
      }

      errorToast("Error!", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (currentImage) return `${process.env.NEXT_PUBLIC_API_URL}${currentImage}`;
    return null;
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="none"
          className="text-xs py-2 px-2 text-slate-800 bg-white hover:bg-slate-200 transition-colors"
        >
          <HiOutlinePencilSquare className="text-lg font-semibold text-indigo-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-6 px-4 pt-3 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="w-full flex items-center justify-between flex-row">
          <DialogTitle className="w-full font-medium flex items-center space-x-2">
            <span className="p-1 text-blue-600 bg-muted rounded-full">
              <HiMiniMap className="h-4 w-4" />
            </span>
            <p className="text-xs text-slate-700 w-full max-w-[135px] border-r pr-3">
              Edit Alternatif
            </p>
          </DialogTitle>
        </DialogHeader>

        <section className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Kode alternatif */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="kode_alternatif" className="text-xs font-medium">
                Kode Alternatif
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="kode_alternatif"
                  value={formData.kode_alternatif}
                  onChange={handleInputChange}
                  placeholder="A01"
                  disabled
                  className="text-center bg-gray-50 cursor-not-allowed"
                />
                {errors.kode_alternatif && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{errors.kode_alternatif}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nama pupuk */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="pupuk" className="text-xs font-medium">
                Nama Pupuk <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="pupuk"
                  value={formData.pupuk}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama pupuk"
                  className="text-sm"
                />
                {errors.pupuk && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{errors.pupuk}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="deskripsi" className="text-xs font-medium">
              Deskripsi
            </Label>
            <div className="relative">
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi alternatif (opsional)"
                rows={3}
                className="resize-none text-sm"
              />
            </div>
          </div>

          {/* Jenis dan Harga */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="jenis" className="text-xs font-medium">
                Jenis
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="jenis"
                  value={formData.jenis}
                  onChange={handleInputChange}
                  placeholder="Masukkan jenis pupuk"
                  className="text-sm"
                />
                {errors.jenis && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{errors.jenis}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="harga" className="text-xs font-medium">
                Harga (Rp)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  id="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="text-sm"
                />
                {errors.harga && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{errors.harga}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="images" className="text-xs font-medium">
              Gambar Produk
            </Label>
            <div className="relative">
              <Input
                type="file"
                id="images"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: JPEG, PNG, WebP. Max: 5MB
              </p>
              {errors.images && (
                <div className="flex items-start text-red-600 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{errors.images}</span>
                </div>
              )}
              
              {/* Image Preview */}
              {getImageUrl() && (
                <div className="mt-3 relative">
                  <div className="relative inline-block">
                    <img
                      src={getImageUrl()}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                        title="Hapus gambar baru"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {imagePreview ? (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        Gambar baru dipilih
                      </p>
                    ) : currentImage ? (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        Gambar saat ini
                      </p>
                    ) : null}
                  </div>
                </div>
              )}

              {!getImageUrl() && (
                <div className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Belum ada gambar</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              className="text-xs items-center px-5 py-2"
              size="none"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="text-xs items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              size="none"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Memperbarui...
                </>
              ) : (
                "Update Data"
              )}
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};