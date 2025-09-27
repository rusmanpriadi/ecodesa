"use client";
import React, { useState, useEffect } from 'react';
import { Leaf, Calculator, TrendingUp, Home, Plus, FileText, ChevronRight } from 'lucide-react';
import axios from 'axios';

const RenderInputForm = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subkriteria`);
                console.log(response.data.data);
                setData(response.data.data);
                
                // Inisialisasi formData secara dinamis berdasarkan data yang diterima
                const initialFormData = {};
                response.data.data.forEach(item => {
                    initialFormData[item.kode_kriteria] = '';
                });
                setFormData(initialFormData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchdata();
    }, [])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        // Tambahkan logika untuk mengirim data ke backend atau proses lainnya
    };

    return (
        <div className="max-w-4xl mx-auto p-10">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Input Data Kondisi Lahan</h2>
                    <p className="text-gray-600">Masukkan informasi kondisi lahan Anda untuk mendapatkan rekomendasi pupuk terbaik</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.map((item) => (
                        <div className="space-y-2" key={item.id}>
                            <label className="block text-sm font-medium text-gray-700">
                                {item.nama_kriteria}
                            </label>
                            <select
                                value={formData[item.kode_kriteria] || ''}
                                onChange={(e) => handleInputChange(item.kode_kriteria, e.target.value)}
                                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">Pilih {item.nama_kriteria}</option>
                                {item.subkriteria_array.map((subkriteria) => (
                                    <option key={subkriteria.id} value={subkriteria.bobot}>
                                        {subkriteria.subkriteria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
                    >
                        <Calculator className="h-5 w-5" />
                        <span>Hitung Rekomendasi</span>
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Debug: Tampilkan data form */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Data Form (Debug):</h3>
                    <pre className="text-xs text-gray-600">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default RenderInputForm;