"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, X, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import axios from "axios";
import { successToast, errorToast } from "@/lib/toastUtils";




// Add Perbandingan Modal
 const AddPerbandinganModal = ({  existingJudgments = [], criteriaList, sessionId  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    session_id: sessionId,
    id_kriteria_i: "",
    id_kriteria_j: "",
    value: "1"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

    // kalau sessionId di parent berubah, update state modal juga
  useEffect(() => {
    setFormData((prev) => ({ ...prev, session_id: sessionId }));
  }, [sessionId]);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.id_kriteria_i) {
      newErrors.id_kriteria_i = "Kriteria pertama harus dipilih.";
    }

    if (!formData.id_kriteria_j) {
      newErrors.id_kriteria_j = "Kriteria kedua harus dipilih.";
    }

    if (formData.id_kriteria_i === formData.id_kriteria_j) {
      newErrors.id_kriteria_j = "Kriteria tidak boleh sama.";
    }

    if (!formData.value || parseFloat(formData.value) < 1 || parseFloat(formData.value) > 9) {
      newErrors.value = "Nilai perbandingan harus antara 1-9.";
    }

    // Check if comparison already exists
    const comparisonExists = existingJudgments.some(judgment => 
      (judgment.id_kriteria_i === parseInt(formData.id_kriteria_i) && 
       judgment.id_kriteria_j === parseInt(formData.id_kriteria_j)) ||
      (judgment.id_kriteria_i === parseInt(formData.id_kriteria_j) && 
       judgment.id_kriteria_j === parseInt(formData.id_kriteria_i))
    );

    if (comparisonExists) {
      newErrors.id_kriteria_j = "Perbandingan kriteria ini sudah ada.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user makes changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      session_id: parseInt(formData.session_id),
      id_kriteria_i: parseInt(formData.id_kriteria_i),
      id_kriteria_j: parseInt(formData.id_kriteria_j),
      value: formData.value
    };

    try {
      // Replace with actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.code === 201 || result.status) {
        setFormData({
          session_id: 1,
          id_kriteria_i: "",
          id_kriteria_j: "",
          value: "1"
        });
        setErrors({});
        successToast("Success", {
          description: "Perbandingan kriteria berhasil ditambahkan.",
          duration: 4000,
        });
       
        setIsOpen(false);
      } else {
        setErrors({ value: result.message || "Gagal menambahkan perbandingan." });
      }
    } catch (error) {
      console.error("Error adding judgment:", error);
      setErrors({ value: "Gagal menambahkan perbandingan kriteria." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableCriteriaJ = () => {
    if (!formData.id_kriteria_i) return criteriaList;
    
    // Filter out the selected criteria I and any existing comparisons
    return criteriaList.filter(criteria => {
      if (criteria.id.toString() === formData.id_kriteria_i) return false;
      
      // Check if comparison already exists
      const comparisonExists = existingJudgments.some(judgment => 
        (judgment.id_kriteria_i === parseInt(formData.id_kriteria_i) && 
         judgment.id_kriteria_j === criteria.id) ||
        (judgment.id_kriteria_i === criteria.id && 
         judgment.id_kriteria_j === parseInt(formData.id_kriteria_i))
      );
      
      return !comparisonExists;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs px-5 py-2" variant="green">
          <Plus size={16} className="mr-2" />
          Tambah Sesion
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-6 px-6 pt-4">
        <DialogHeader className="w-full flex flex-row items-center justify-between mb-4">
          <DialogTitle>
            <div className="w-full font-medium flex items-center space-x-2">
              <span className="p-1 text-green-600 bg-green-100 rounded-full">
                <Plus className="h-4 w-4" />
              </span>
              <p className="text-sm text-slate-700">
                Tambah Perbandingan Kriteria
              </p>
            </div>
          </DialogTitle>

          <div className="flex gap-2 me-5">
            <Button
              className="text-xs px-4 py-2"
              variant="green"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Simpan"}
            </Button>
         
          </div>
        </DialogHeader>

        <section className="w-full space-y-4">
          {/* Session ID */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="session_id">Session ID</Label>
            <Input
              type="number"
              id="session_id"
              value={formData.session_id}
              onChange={(e) => handleInputChange('session_id', e.target.value)}
              placeholder="1"
              disabled
            />
            {errors.session_id && (
              <div className="flex items-center text-red-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.session_id}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Kriteria I */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="kriteria_i">Kriteria Pertama</Label>
            <Select
  value={formData.id_kriteria_i}
  onValueChange={(value) => handleInputChange("id_kriteria_i", value)}
>
  {/* Tombol dropdown */}
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Pilih Kriteria Pertama" />
  </SelectTrigger>

  {/* Isi dropdown */}
  <SelectContent>
    {criteriaList.map((criteria) => (
      <SelectItem key={criteria.id} value={criteria.id.toString()}>
        C{String(criteria.id).padStart(2, "0")} - {criteria.nama_kriteria}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
              {errors.id_kriteria_i && (
                <div className="flex items-center text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.id_kriteria_i}
                </div>
              )}
            </div>

            {/* Kriteria J */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="kriteria_j">Kriteria Kedua</Label>
              <Select
                value={formData.id_kriteria_j}
                onValueChange={(value) => handleInputChange('id_kriteria_j', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kriteria Kedua" />
                </SelectTrigger>
                <SelectContent>

                  <SelectGroup>


                <SelectItem >Pilih Kriteria</SelectItem>
                {getAvailableCriteriaJ().map((criteria) => (
                  <SelectItem key={criteria.id} value={criteria.id.toString()}>
                    C{String(criteria.id).padStart(2, '0')} - {criteria.nama_kriteria}
                  </SelectItem>
                ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.id_kriteria_j && (
                <div className="flex items-center text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.id_kriteria_j}
                </div>
              )}
            </div>
          </div>

          {/* Nilai Perbandingan */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="value">Nilai Perbandingan</Label>
            <Select
              value={formData.value}
              onValueChange={(value) => handleInputChange('value', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Nilai Perbandingan" />
              </SelectTrigger>
              <SelectContent>

              <SelectItem value="1">1 - Sama penting dengan</SelectItem>
              <SelectItem value="2">2 - Mendekati sedikit lebih penting</SelectItem>
              <SelectItem value="3">3 - Sedikit lebih penting dari</SelectItem>
              <SelectItem value="4">4 - Mendekati lebih penting dari</SelectItem>
              <SelectItem value="5">5 - Lebih penting dari</SelectItem>
              <SelectItem value="6">6 - Mendekati sangat penting dari</SelectItem>
              <SelectItem value="7">7 - Sangat penting dari</SelectItem>
              <SelectItem value="8">8 - Mendekati mutlak dari</SelectItem>
              <SelectItem value="9">9 - Mutlak sangat penting dari</SelectItem>
              </SelectContent>
            </Select>
            {errors.value && (
              <div className="flex items-center text-red-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.value}
              </div>
            )}
          </div>

          {/* Preview */}
          {formData.id_kriteria_i && formData.id_kriteria_j && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Preview:</strong> Kriteria {criteriaList.find(c => c.id.toString() === formData.id_kriteria_i)?.name} 
                {" "}adalah <strong>{formData.value}x</strong> lebih penting dari Kriteria {criteriaList.find(c => c.id.toString() === formData.id_kriteria_j)?.name}
              </p>
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};


export default AddPerbandinganModal