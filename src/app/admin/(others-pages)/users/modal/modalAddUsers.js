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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddUsersModal = ({ onSave, existingKriteria = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    level: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);




  
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
   

    setIsSubmitting(true);

   
    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      level: formData.level
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        submitData
      );

      console.log(response);
      if (response.data.code === 201) {
       
        setFormData({
          name: "",
          email: "",
          password: "",
          level: "",
        });
        setErrors({});
        successToast("Success.", {
          description: "Users berhasil ditambah.",
          duration: 4000,
        });
        onSave(response.data.data);
        setIsOpen(false);
      } else if (response.data.code === 200) {
        setErrors({ name: response.data.message });
      }
    } catch (error) {
      console.error("Error adding users:", error);
      if (error.response?.data?.message) {
        setErrors({ name: error.response.data.message });
      } else {
        setErrors({ name: "Gagal menambahkan users." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
     
   
  
      setFormData({
       name: "",
       email: "",
       password: "",
       level: "",
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
                Create Users
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
          {/* Name */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="atribut">Name</Label>
           <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan Name"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Email */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="email">Email</Label>
           <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan Email"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Email */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="password">Password</Label>
           <Input
              type="text"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Masukkan Email"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Level */}
          <div className="grid w-full items-center gap-3 mt-3">
            <Label htmlFor="atribut">Level</Label>
         <div className="relative ">
                      <Select
                        value={formData.level}
                        onValueChange={(value) => handleSelectChange("level", value)}
                       
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="petani">Petani</SelectItem>
                        </SelectContent>
                      </Select>
                      
                    </div>
                    
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          

   
        </section>
      </DialogContent>
    </Dialog>
  );
};