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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { successToast } from "@/lib/toastUtils";


export const AddKriteriaModal = ({ onSave, existingKriteria = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kriteria, setKriteria] = useState([]);
  const [formData, setFormData] = useState({
    kode_kriteria: "",
   subkriteria: "",
   bobot: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate kode kriteria otomatis

useEffect(() => {
  const fetchKriteria = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/criteria`
      );
      
      setKriteria(response.data.data);
      console.log(response.data.data);
     
    } catch (error) {
      console.error("Error fetching kriteria:", error);
    }
  };
  fetchKriteria();
}, []);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_kriteria.trim()) {
      newErrors.kode_kriteria = "Nomor kode tidak boleh kosong.";
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
                Create SubKriteria
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

          <div className="w-full">
          {/* Kode Kriteria */}
            <Select
            className="w-full"
                    value={formData.id}
                    onValueChange={(value) =>
                      handleSelectChange("id", value)
                    }
                  >
                    <SelectTrigger
                      className={`h-11 w-full ${
                        errors.id ? "border-red-500" : "border-gray-300"
                      } hover:border-indigo-400 focus:border-indigo-500 transition-colors`}
                    >
                      <SelectValue placeholder="Pilih Lokasi" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {kriteria.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                         {`${item.kode_kriteria} - ${item.nama_kriteria}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
          </div>
          <div className="w-full mt-6">
            <Label>Nama SubKriteria</Label>
            <ul className="w-full mt-6 space-y-5">
              <li className="w-full space-y-2">
              <div className="flex items-center space-x-2">
              <span value={formData.bobot}>1</span>  
              

              <Input id="nama_subkriteria" value={formData.nama_subkriteria} onChange={handleInputChange} />
              </div>
              </li>
              <li className="w-full space-y-2">
              <div className="flex items-center space-x-2">
              <span value={formData.bobot}>1</span>  
              

              <Input id="nama_subkriteria" value={formData.nama_subkriteria} onChange={handleInputChange} />
              </div>
              </li>
             
            </ul>
          </div>
         
        </section>
      </DialogContent>
    </Dialog>
  );
};