"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Loader2, Edit3, Plus, Calendar, FileText, Image } from "lucide-react";
import React, { useState, useEffect } from "react";
import AddGaleri from "./dialog/addGaleri";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ModalDeletedGaleri from "./dialog/modalDeletedGaleri";
import { EditGaleriModal } from "./dialog/modalEditGaleri";

const GaleriAdmin = () => {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  


  // Form state
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    images: null
  });

  const resetForm = () => {
    setFormData({
      judul: "",
      deskripsi: "",
      tanggal: "",
      images: null
    });
    setEditMode(false);
    setEditId(null);
    setShowAddForm(false);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/galeri");
      const data = await response.json();

      if (data.status) {
        setGaleri(data.data);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.log("Error fetching galeri:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleri();
  }, [refreshTable]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.judul.trim()) {
      alert("Judul harus diisi!");
      return;
    }

    if (!editMode && !formData.images) {
      alert("Pilih foto terlebih dahulu!");
      return;
    }

    const submitData = async () => {
      try {
        setUploading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("judul", formData.judul);
        formDataToSend.append("deskripsi", formData.deskripsi);
        formDataToSend.append("tanggal", formData.tanggal);
        
        if (formData.images) {
          formDataToSend.append("images", formData.images);
        }

        const url = editMode ? `/api/galeri?id=${editId}` : "/api/galeri";
        const method = editMode ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          body: formDataToSend,
        });

        const data = await response.json();

        if (data.status) {
          alert(editMode ? "Galeri berhasil diupdate!" : "Galeri berhasil ditambahkan!");
          resetForm();
          fetchGaleri();

        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Terjadi error saat menyimpan data");
      } finally {
        setUploading(false);
      }
    };

    submitData();
  };





  const formatDate = (dateString) => {
    if (!dateString) return "Tidak ada tanggal";
    
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  const handleRefreshTable = () => {
    setRefreshTable((prev) => !prev);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className=" mx-auto py-8 px-4 ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kelola Galeri
              </h1>
              <p className="text-gray-600 mt-2">Tambahkan dan kelola foto galeri untuk landing page</p>
            </div>
            <AddGaleri handleSubmit={handleSubmit} handleInputChange={handleInputChange} formData={formData} editMode={editMode} resetForm={resetForm} uploading={uploading}/>
          </div>
        </div>
      </header>

      <main className="py-10">

       
       
      

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-4 ">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <span className="text-gray-600 text-lg">Memuat galeri...</span>
              </div>
            </div>
          ) : galeri.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl mb-2">Belum ada item di galeri</p>
              <p className="text-gray-400 text-base mb-6">
                Klik tombol "Tambah Galeri" untuk menambahkan item pertama!
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Galeri Pertama
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {galeri.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                >
                  <div className="relative">
                    
                    <img
                      src={item.images}
                      alt={item.judul || `Gallery Image ${item.id}`}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                      }}
                    />

                 

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                     {/* Action Buttons Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                     <EditGaleriModal onSave={handleRefreshTable} galeriData={item}  />
                        <ModalDeletedGaleri  galeriData={item} refreshTable={handleRefreshTable} editMode={editMode}  />
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-10 w-10 p-0 shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>

                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {item.judul || "Tanpa Judul"}
                    </h3>
                    
                    {item.deskripsi && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {item.deskripsi}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(item.tanggal)}
                      </span>
                     
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {galeri.length > 0 && galeri.length % 20 === 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                console.log("Load more clicked");
              }}
              className="px-8 py-3 text-base border-gray-300 hover:bg-gray-50"
            >
              Muat Lebih Banyak
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GaleriAdmin;