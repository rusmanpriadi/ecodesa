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
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { successToast } from "@/lib/toastUtils";

export const AddSubKriteriaModal = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kriteria, setKriteria] = useState([]);
  const [formData, setFormData] = useState({
    kode_kriteria: "",
  });
  const [subkriteriaList, setSubkriteriaList] = useState([
    { subkriteria: "", bobot: "" },
    { subkriteria: "", bobot: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/criteria`
        );
        setKriteria(response.data.data);
      } catch (error) {
        console.error("Error fetching kriteria:", error);
      }
    };
    fetchKriteria();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_kriteria) {
      newErrors.kode_kriteria = "Kriteria harus dipilih";
    }

    subkriteriaList.forEach((item, index) => {
      if (!item.subkriteria.trim()) {
        newErrors[`subkriteria_${index}`] = "Nama subkriteria tidak boleh kosong";
      }
      if (!item.bobot || Number(item.bobot) <= 0) {
        newErrors[`bobot_${index}`] = "Bobot harus lebih dari 0";
      }
    });

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
  };

  const addSubkriteriaRow = () => {
    setSubkriteriaList([...subkriteriaList, { subkriteria: "", bobot: "" }]);
  };

  const removeSubkriteriaRow = (index) => {
    if (subkriteriaList.length > 1) {
      const newList = subkriteriaList.filter((_, i) => i !== index);
      setSubkriteriaList(newList);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcriteria`,
        submitData
      );

      if (response.data.code === 201) {
        setFormData({ kode_kriteria: "" });
        setSubkriteriaList([
          { subkriteria: "", bobot: "" },
          { subkriteria: "", bobot: "" },
        ]);
        setErrors({});
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
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Gagal menambahkan subkriteria." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* Select Kriteria */}
          <div className="w-full space-y-2">
            <Label>Pilih Kriteria</Label>
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
                {kriteria.map((item) => (
                  <SelectItem key={item.id} value={item.kode_kriteria}>
                    {`${item.kode_kriteria} - ${item.nama_kriteria}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kode_kriteria && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.kode_kriteria}
              </p>
            )}
          </div>

          {/* Subkriteria List */}
          <div className="w-full space-y-2">
            <Label>Daftar SubKriteria</Label>
            <ul className="w-full space-y-3">
              {subkriteriaList.map((item, index) => (
                <li key={index} className="w-full space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium mt-2 min-w-[20px]">
                      {index + 1}.
                    </span>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Nama Subkriteria"
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
                        placeholder="Bobot"
                        value={item.bobot}
                        onChange={(e) =>
                          handleSubkriteriaChange(index, "bobot", e.target.value)
                        }
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
                    {subkriteriaList.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubkriteriaRow(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Add More Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubkriteriaRow}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Subkriteria
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};