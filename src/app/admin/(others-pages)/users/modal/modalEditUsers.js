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
import { HiOutlinePencilSquare, HiMiniUserGroup } from "react-icons/hi2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { successToast, errorToast } from "@/lib/toastUtils";

export const EditUsersModal = ({ onSave, userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    level: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form saat modal dibuka atau userData berubah
  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "", // Kosongkan password, biarkan user isi jika ingin ubah
        level: userData.level || "",
      });
      setErrors({});
    }
  }, [isOpen, userData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama tidak boleh kosong.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Format email tidak valid.";
      }
    }

    if (!formData.level) {
      newErrors.level = "Level harus dipilih.";
    }

    // Password bersifat opsional saat edit
    // Hanya validasi jika user mengisi password baru
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
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

    // Hanya kirim password jika diisi
    const submitData = {
      name: formData.name,
      email: formData.email,
      level: formData.level,
    };

    // Tambahkan password hanya jika diisi
    if (formData.password.trim()) {
      submitData.password = formData.password;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userData.id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status && response.data.code === 200) {
        successToast("Success.", {
          description: "User berhasil diubah.",
          duration: 4000,
        });
        
        // Callback ke parent component dengan data yang diupdate
        const updatedData = {
          ...userData,
          name: submitData.name,
          email: submitData.email,
          level: submitData.level,
        };
        
        if (onSave) {
          onSave(updatedData);
        }
        
        setIsOpen(false);
      } else if (response.data.code === 200 && !response.data.status) {
        // Email already exists
        setErrors({ 
          email: response.data.message || "Email sudah terdaftar." 
        });
      } else {
        setErrors({ 
          email: response.data.message || "Terjadi kesalahan saat mengubah user." 
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      
      if (error.response?.status === 400) {
        setErrors({ 
          email: error.response.data?.message || "Data tidak valid." 
        });
      } else if (error.response?.status === 404) {
        setErrors({ 
          email: "User tidak ditemukan." 
        });
        errorToast("Error.", {
          description: "User tidak ditemukan.",
          duration: 4000,
        });
      } else if (error.response?.status === 500) {
        setErrors({ 
          email: "Terjadi kesalahan server. Silakan coba lagi." 
        });
      } else {
        setErrors({ 
          email: "Gagal mengubah user." 
        });
      }
      
      errorToast("Error.", {
        description: error.response?.data?.message || "Gagal mengubah user.",
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
              <HiMiniUserGroup className="h-4 w-4" />
            </span>
            <p className="text-xs text-slate-700 w-full max-w-[135px] border-r">
              Edit User
            </p>
          </DialogTitle>
        </DialogHeader>
        
        <section className="w-full">
          {/* Name */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan email"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="password">
              Password 
              <span className="text-xs text-gray-500 ml-2">(Kosongkan jika tidak ingin ubah)</span>
            </Label>
            <div className="relative">
              <Input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password baru"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.password && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          {/* Level */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="level">Level</Label>
            <div className="relative">
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange("level", value)}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="petani">Petani</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.level}
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button
              className="text-xs items-center px-5 py-2 mt-5 bg-bluet hover:bg-blue-600 text-white"
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