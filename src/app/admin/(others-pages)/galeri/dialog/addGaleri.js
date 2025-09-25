import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Loader2, Edit3, Plus, Calendar, FileText, Image } from "lucide-react";
 const AddGaleri = ({ handleSubmit, handleInputChange, formData, editMode, resetForm , uploading}) => {
  return (
   <Dialog className=" mx-auto mb-10">
              <DialogTrigger className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
               Tambah Galeri
              </DialogTrigger>
            <DialogContent className="shadow-xl border-0  backdrop-blur-sm">
            <DialogHeader>
      <DialogTitle>Create Galeri</DialogTitle>
      <DialogDescription/>
    </DialogHeader>
            
           
                <div onSubmit={handleSubmit} className="space-y-6">
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
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
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

                  {/* deskripsi */}
                  <div>
                    <Label htmlFor="deskripsi" className="text-base font-medium text-gray-700 flex items-center mb-2">
                      <FileText className="mr-2 h-4 w-4" />
                      deskripsi/Deskripsi
                    </Label>
                    <Textarea
                      id="deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi atau deskripsi untuk galeri ini"
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
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      onClick={handleSubmit}
                      disabled={uploading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white  text-base shadow-lg"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {editMode ? "Mengupdate..." : "Menyimpan..."}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-5 w-5" />
                          {editMode ? "Update Galeri" : "Simpan Galeri"}
                        </>
                      )}
                    </Button>
                   
                      <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
                  </div>
                </div>
         
            </DialogContent>
          </Dialog>
  )
}

export default AddGaleri