"use client";
import React, { useState, useEffect } from 'react';
import { Leaf, Calculator, TrendingUp, Home, Plus, FileText, ChevronRight, Eye, BarChart3 } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import ComprehensiveResultsPage from './table/tablePerbandingan';

const RenderInputForm = () => {
    const [data, setData] = useState([]);
    // PERUBAHAN: Simpan object lengkap (id_subkriteria dan bobot)
    const [formData, setFormData] = useState({});
    const [inputKriteria, setInputKriteria] = useState([]);
    const [kriteria, setKriteria] = useState([]);
    const [alternatives, setAlternatives] = useState([]);
    const [judgmentData, setJudgmentData] = useState([]);
    const [alternatifJudgmentData, alternatifJetJudgmentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);
    const [ahpMatrix, setAhpMatrix] = useState([]);
    const [ahpWeights, setAhpWeights] = useState({});
    const [calculationResults, setCalculationResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [currentKodeInput, setCurrentKodeInput] = useState(null);
    const userId = Cookies.get('id');

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const [subkriteriaRes, inputKriteriaRes, kriteriaRes, alternatifRes, kriteriaJudgmentRes, alternaitJudgmentRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subkriteria`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/input-kriteria`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/criteria`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/alternatif`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/alternatif_judgment`),
                ])
               
                setData(subkriteriaRes.data.data);
                setInputKriteria(inputKriteriaRes.data.data);
                setKriteria(kriteriaRes.data.data);
                setAlternatives(alternatifRes.data.data);
                setJudgmentData(kriteriaJudgmentRes.data.data);
                alternatifJetJudgmentData(alternaitJudgmentRes.data.data);
          
                // Inisialisasi formData
                const initialFormData = {};
                subkriteriaRes.data.data.forEach(item => {
                    initialFormData[item.kode_kriteria] = {
                        id_subkriteria: '',
                        bobot: ''
                    };
                });
            
                setFormData(initialFormData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchdata();
    }, [])

    // PERUBAHAN: Handler untuk menyimpan id_subkriteria dan bobot
    const handleInputChange = (kode_kriteria, selectedSubkriteriaId) => {
        // Cari kriteria dan subkriteria yang dipilih
        const kriteria = data.find(item => item.kode_kriteria === kode_kriteria);
        if (!kriteria) return;

        const selectedSubkriteria = kriteria.subkriteria_array.find(
            sub => sub.id === parseInt(selectedSubkriteriaId)
        );

        if (selectedSubkriteria) {
            setFormData(prev => ({
                ...prev,
                [kode_kriteria]: {
                    id_subkriteria: selectedSubkriteria.id,
                    bobot: selectedSubkriteria.bobot
                }
            }));
        }
    };

    const getNextKodeInput = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/input-kriteria/get-last-kode-input`);
            const lastKode = response.data.last_kode || 0;
            return lastKode + 1;
        } catch (error) {
            console.error('Error getting last kode_input:', error);
            return 1;
        }
    };

  

    const handleSubmit = async () => {
        // Validasi: Pastikan semua field terisi
        const emptyFields = Object.keys(formData).filter(
            key => !formData[key].id_subkriteria || !formData[key].bobot
        );
        
        if (emptyFields.length > 0) {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        const kode_input = await getNextKodeInput();

        const formattedData = Object.entries(formData);
        setLoading(true);

        try {
            const id_user = userId;
            
            // Simpan data input kriteria ke database
            const promises = Object.keys(formData).map(async (kode_kriteria) => {
                const { id_subkriteria, bobot } = formData[kode_kriteria];
                
                const payload = {
                    id_user,
                    kode_input: parseInt(kode_input),
                    id_subkriteria: id_subkriteria,
                    kode_kriteria: kode_kriteria,
                    bobot: parseFloat(bobot)
                };
                
                console.log('Sending payload:', payload); // Debug
                return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/input-kriteria`, payload);
            });

            await Promise.all(promises);

            // Membuat matriks AHP
            const n = formattedData.length;
            const matrix = Array.from({ length: n }, () => Array(n).fill(1));

            for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                    const value = Number(formattedData[i][1].bobot / formattedData[j][1].bobot); 
                    matrix[i][j] = value;
                    matrix[j][i] = 1 / value;
                }
            }

            // Simpan matriks perbandingan
            const matrixPromises = [];
            for (let i = 0; i < formattedData.length; i++) {
                for (let j = i + 1; j < formattedData.length; j++) {
                    const [kode_i] = formattedData[i];
                    const [kode_j] = formattedData[j];
                    
                    const kriteria_i = data.find(item => item.kode_kriteria === kode_i);
                    const kriteria_j = data.find(item => item.kode_kriteria === kode_j);

                    const nilai_i = Number(formData[kode_i].bobot);
                    const nilai_j = Number(formData[kode_j].bobot);
                    
                    const valueRes = nilai_i / nilai_j;

                    const matrixPayload = {
                        kode_input,
                        id_kriteria_i: kriteria_i?.id,
                        id_kriteria_j: kriteria_j?.id,
                        value: valueRes,
                    };

                    matrixPromises.push(
                        fetch(`/api/kriteria_judgment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(matrixPayload),
                        })
                        .then(async (response) => {
                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`HTTP ${response.status}: ${errorText}`);
                            }
                            return response.json();
                        })
                        .catch((error) => {
                            console.error('Matrix save error:', error);
                            return { error: error.message };
                        })
                    );
                }
            }

            await Promise.all(matrixPromises);

            // Fetch data terbaru
            const [newKriteriaJudgment] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment?kode_input=${kode_input}`),
            ]);

            setCalculationResults({
                kode_input: kode_input,
                kriteriaJudgment: newKriteriaJudgment.data.data,
                matrix: matrix,
                formData: formData,
                timestamp: new Date().toISOString()
            });

            setAhpMatrix(matrix);
            setShowMatrix(true);
            setShowResults(true);
            
            alert('Data berhasil disimpan dan matriks AHP telah dihitung!');
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Terjadi kesalahan saat menyimpan data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto md:p-16">
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
                                value={formData[item.kode_kriteria]?.id_subkriteria || ''}
                                onChange={(e) => handleInputChange(item.kode_kriteria, e.target.value)}
                                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                disabled={loading}
                            >
                                <option value="">Pilih {item.nama_kriteria}</option>
                                {item.subkriteria_array.map((subkriteria) => (
                                    <option key={subkriteria.id} value={subkriteria.id}>
                                        {subkriteria.subkriteria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-between">
                    {showMatrix && (
                        <button
                            onClick={() => setShowMatrix(!showMatrix)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span>{showMatrix ? 'Sembunyikan' : 'Tampilkan'} Matriks AHP</span>
                        </button>
                    )}
                    
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center space-x-2 ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                        }`}
                    >
                        <Calculator className="h-5 w-5" />
                        <span>{loading ? 'Memproses...' : 'Hitung Rekomendasi'}</span>
                        {!loading && <ChevronRight className="h-5 w-5" />}
                    </button>
                </div>

                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Data Form (Debug):</h3>
                    <pre className="text-xs text-gray-600">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>
            </div>

            {showResults && calculationResults && (
                <div className="mt-8">
                    <ComprehensiveResultsPage 
                        kriteriaData={kriteria} 
                        alternatifData={alternatives} 
                        kriteriaJudgment={calculationResults.kriteriaJudgment}
                        alternatifJudgmentData={alternatifJudgmentData}
                        kodeInput={calculationResults.kode_input}
                        calculationTimestamp={calculationResults.timestamp}
                    
                    />
                </div>
            )}
        </div>
    );
}

export default RenderInputForm;