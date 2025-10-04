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

export const AddSubKriteriaModal = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kriteria, setKriteria] = useState([]);
  const [kriteriaWithSub, setKriteriaWithSub] = useState([]);
  const [formData, setFormData] = useState({
    kode_kriteria: "",
  });
  const [subkriteriaList, setSubkriteriaList] = useState([
    { subkriteria: "", bobot: "" },
    { subkriteria: "", bobot: "" },
    { subkriteria: "", bobot: "" },
    { subkriteria: "", bobot: "" },
    { subkriteria: "", bobot: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch kriteria dan subkriteria yang sudah ada
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kriteriaRes, subkriteriaRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/criteria`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subkriteria`),
        ]);

       

        setKriteria(kriteriaRes.data.data || []);

        // Ambil kode_kriteria yang sudah punya subkriteria
        // Response API bentuknya array objek dengan property console
        if (subkriteriaRes.data.data && Array.isArray(subkriteriaRes.data.data)) {
          const usedKriteria = subkriteriaRes.data.data.map((item) => item.kode_kriteria);
         
          setKriteriaWithSub(usedKriteria);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        errorToast("Error", {
          description: "Gagal memuat data kriteria.",
          duration: 4000,
        });
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Validasi kriteria HARUS dipilih
    if (!formData.kode_kriteria) {
      newErrors.kode_kriteria = "Kriteria harus dipilih";
      errorToast("Error", {
        description: "Kriteria harus dipilih terlebih dahulu.",
        duration: 4000,
      });
      setErrors(newErrors);
      return false;
    }

    // Validasi kriteria sudah punya subkriteria
    if (kriteriaWithSub.includes(formData.kode_kriteria)) {
      newErrors.kode_kriteria = "Kriteria ini sudah memiliki subkriteria";
      setErrors(newErrors);
      errorToast("Error", {
        description: "Kriteria yang dipilih sudah memiliki subkriteria.",
        duration: 4000,
      });
      return false;
    }

    // Validasi HARUS tepat 5 subkriteria
    if (subkriteriaList.length !== 5) {
      newErrors.general = "Harus tepat 5 subkriteria";
      setErrors(newErrors);
      errorToast("Error", {
        description: "Subkriteria harus tepat 5, tidak boleh kurang atau lebih.",
        duration: 4000,
      });
      return false;
    }

    // Validasi setiap subkriteria TIDAK BOLEH KOSONG
    let hasEmptyField = false;
    subkriteriaList.forEach((item, index) => {
      if (!item.subkriteria.trim()) {
        newErrors[`subkriteria_${index}`] = "Nama subkriteria tidak boleh kosong";
        hasEmptyField = true;
      }
      
      const bobotNum = Number(item.bobot);
      if (!item.bobot || isNaN(bobotNum) || bobotNum < 1 || bobotNum > 5) {
        newErrors[`bobot_${index}`] = "Bobot harus antara 1-5";
        hasEmptyField = true;
      }
    });

    if (hasEmptyField) {
      setErrors(newErrors);
      errorToast("Error", {
        description: "Semua field subkriteria harus diisi dengan lengkap.",
        duration: 4000,
      });
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectChange = (value) => {
    setFormData({ kode_kriteria: value });
    if (errors.kode_kriteria) {
      setErrors((prev) => ({ ...prev, kode_kriteria: "" }));
    }
  };

  const handleSubkriteriaChange = (index, field, value) => {
    const newList = [...subkriteriaList];
    newList[index][field] = value;
    setSubkriteriaList(newList);

    // Clear error
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      kode_kriteria: formData.kode_kriteria,
      subkriteriaList: subkriteriaList.map((item) => ({
        subkriteria: item.subkriteria.trim(),
        bobot: Number(item.bobot),
      })),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subkriteria`,
        submitData
      );

      if (response.data.code === 201) {
        setFormData({ kode_kriteria: "" });
        setSubkriteriaList([
          { subkriteria: "", bobot: "" },
          { subkriteria: "", bobot: "" },
          { subkriteria: "", bobot: "" },
          { subkriteria: "", bobot: "" },
          { subkriteria: "", bobot: "" },
        ]);
        setErrors({});
        
        // Update kriteriaWithSub
        setKriteriaWithSub([...kriteriaWithSub, formData.kode_kriteria]);
        
        successToast("Success.", {
          description: "Subkriteria berhasil ditambahkan.",
          duration: 4000,
        });
        onSave(response.data.data);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error adding subkriteria:", error);
      if (error.response?.data?.message) {
        errorToast("Error", {
          description: error.response.data.message,
          duration: 4000,
        });
        setErrors({ general: error.response.data.message });
      } else {
        errorToast("Error", {
          description: "Gagal menambahkan subkriteria.",
          duration: 4000,
        });
        setErrors({ general: "Gagal menambahkan subkriteria." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData({ kode_kriteria: "" });
      setSubkriteriaList([
        { subkriteria: "", bobot: "" },
        { subkriteria: "", bobot: "" },
        { subkriteria: "", bobot: "" },
        { subkriteria: "", bobot: "" },
        { subkriteria: "", bobot: "" },
      ]);
      setErrors({});
    }
  }, [isOpen]);

  // Filter kriteria yang belum punya subkriteria
  const availableKriteria = kriteria.filter(
    (item) => !kriteriaWithSub.includes(item.kode_kriteria)
  );

 

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

        <section className="w-full space-y-4">
          {/* Error General */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-xs text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700 space-y-1">
              <p className="font-medium">Ketentuan:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Kriteria harus dipilih (wajib)</li>
                <li>Harus tepat 5 subkriteria (tidak boleh kurang/lebih)</li>
                <li>Semua field harus diisi (tidak boleh kosong)</li>
                <li>Bobot harus antara 1-5</li>
              </ul>
            </div>
          </div>

          {/* Select Kriteria */}
          <div className="w-full space-y-2">
            <Label>
              Pilih Kriteria <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.kode_kriteria}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger
                className={`h-11 w-full ${
                  errors.kode_kriteria ? "border-red-500" : "border-gray-300"
                } hover:border-indigo-400 focus:border-indigo-500 transition-colors`}
              >
                <SelectValue placeholder="Pilih Kriteria" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {availableKriteria.length === 0 ? (
                  <div className="p-2 text-center text-sm text-gray-500">
                    Semua kriteria sudah memiliki subkriteria
                  </div>
                ) : (
                  availableKriteria.map((item) => (
                    <SelectItem key={item.id} value={item.kode_kriteria}>
                      {`${item.kode_kriteria} - ${item.nama_kriteria}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.kode_kriteria && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.kode_kriteria}
              </p>
            )}
          </div>

          {/* Subkriteria List - FIXED 5 items */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Daftar SubKriteria <span className="text-red-500">*</span>
              </Label>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Tepat 5 Subkriteria
              </span>
            </div>
            <ul className="w-full space-y-3">
              {subkriteriaList.map((item, index) => (
                <li key={index} className="w-full space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium mt-2 min-w-[20px]">
                      {index + 1}.
                    </span>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Nama Subkriteria *"
                        value={item.subkriteria}
                        onChange={(e) =>
                          handleSubkriteriaChange(
                            index,
                            "subkriteria",
                            e.target.value
                          )
                        }
                        className={
                          errors[`subkriteria_${index}`]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors[`subkriteria_${index}`] && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[`subkriteria_${index}`]}
                        </p>
                      )}
                      <Input
                        type="number"
                        placeholder="Bobot (1-5) *"
                        value={item.bobot}
                        onChange={(e) =>
                          handleSubkriteriaChange(index, "bobot", e.target.value)
                        }
                        min="1"
                        max="5"
                        className={
                          errors[`bobot_${index}`] ? "border-red-500" : ""
                        }
                      />
                      {errors[`bobot_${index}`] && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[`bobot_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};