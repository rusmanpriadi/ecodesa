"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calculator, TrendingUp, FileText, CheckCircle, Eye, Calendar, User, X, Loader, Trash } from 'lucide-react';
import Cookies from 'js-cookie';
import ComprehensiveResultsPage from './table/tablePerbandingan';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import ModalDeletedRiwayat from './table/modalDeletedRiwayat';

const HasilPage = () => {
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [user, setUser] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
    const [kriteria, setKriteria] = useState([]);
      const [alternatives, setAlternatives] = useState([]);
      const [kriteriaJudgment, setJudgmentData] = useState([]);
      const [alternatifJudgmentData, setalternatifJetJudgmentData] = useState([]);
      const [inputKrteria, setInputKriteria] = useState([]);
       const [userInput, setUserInput] = useState({});
          const [calculationResults, setCalculationResults] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    criteriaComparison: true,
    alternativeComparison: true,
    calculations: true,
    finalResults: true
  });

  const userId = Cookies.get('id');

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);
        const userData = await userResponse.json();
        setUser(userData.data);

        const riwayatResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/riwayat/getAll`);
        const riwayatData = await riwayatResponse.json();
        setRiwayat(riwayatData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userId) {
      fetchResponse();
    }
  }, [userId]);

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const fetchDetailCalculation = async (kodeInput) => {
    setLoading(true);
    const fetchData = async () => {
      try {
      // Fetch all required data based on kode_input
      const [kriteriaRes, alternatifRes, kriteriaJudgmentRes, alternatifJudgmentRes, inputKriteriaRes, userRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/criteria`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/alternatif`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment/get-kriteria-judgment-id?kode_input=${kodeInput}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/alternatif_judgment`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/input-kriteria/get-input-id?kode_input=${kodeInput}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/riwayat/getUserByKInput?kode_input=${kodeInput}`)
      ]);

   setKriteria(kriteriaRes.data.data);
   setAlternatives(alternatifRes.data.data);
   setJudgmentData(kriteriaJudgmentRes.data.data);
   setalternatifJetJudgmentData(alternatifJudgmentRes.data.data);
   setInputKriteria(inputKriteriaRes.data.data);
   setUserInput(userRes.data.data);
    } catch (error) {
      console.error('Error fetching detail calculation:', error);
    } finally {
      setLoading(false);
    }
    }

    fetchData();
  };

  const buildMatrix = (judgments, items, itemIdKey = 'id') => {
    const matrix = [];
    
    items.forEach((item, i) => {
      matrix[i] = [];
      items.forEach((otherItem, j) => {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const judgment = judgments.find(j => 
            (j.id_kriteria_i === item[itemIdKey] && j.id_kriteria_j === otherItem[itemIdKey]) ||
            (j.id_alternatif_i === item[itemIdKey] && j.id_alternatif_j === otherItem[itemIdKey])
          );
          matrix[i][j] = judgment ? parseFloat(judgment.value) : 1;
        }
      });
    });

    return matrix;
  };

  const calculateWeights = (matrix) => {
    const n = matrix.length;
    const columnSums = Array(n).fill(0);
    
    // Calculate column sums
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        columnSums[j] += matrix[i][j];
      }
    }
    
    // Normalize and calculate weights
    const weights = [];
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += matrix[i][j] / columnSums[j];
      }
      weights[i] = sum / n;
    }
    
    return weights;
  };

  const calculateConsistency = (matrix, weights) => {
    const n = matrix.length;
    if (n <= 2) return { CI: 0, RI: 0, CR: 0, lambdaMax: n };

    const RI_VALUES = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    
    let lambdaMax = 0;
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += matrix[i][j] * weights[j];
      }
      lambdaMax += sum / weights[i];
    }
    lambdaMax = lambdaMax / n;

    const CI = (lambdaMax - n) / (n - 1);
    const RI = RI_VALUES[n] || 1.49;
    const CR = CI / RI;

    return { CI, RI, CR, lambdaMax };
  };

  // const processAHPCalculation = (kriteria, alternatif, kriteriaJudgments, alternatifJudgments, inputKriteria) => {
  //   // Build criteria matrix
  //   const criteriaMatrix = buildMatrix(kriteriaJudgments, kriteria);
  //   const criteriaWeights = calculateWeights(criteriaMatrix);
  //   const criteriaConsistency = calculateConsistency(criteriaMatrix, criteriaWeights);

  //   // Build alternative matrices for each criterion
  //   const alternativeMatrices = {};
  //   const alternativeWeights = {};

  //   kriteria.forEach((criterion, idx) => {
  //     const criterionJudgments = alternatifJudgments.filter(j => j.id_kriteria === criterion.id);
  //     const matrix = buildMatrix(criterionJudgments, alternatif);
  //     const weights = calculateWeights(matrix);
      
  //     alternativeMatrices[criterion.id] = matrix;
  //     alternativeWeights[criterion.id] = weights;
  //   });

  //   // Calculate final scores
  //   const finalScores = alternatif.map((alt, altIdx) => {
  //     let score = 0;
  //     kriteria.forEach((criterion, critIdx) => {
  //       const altWeight = alternativeWeights[criterion.id]?.[altIdx] || 0;
  //       const critWeight = criteriaWeights[critIdx] || 0;
  //       score += altWeight * critWeight;
  //     });
  //     return {
  //       ...alt,
  //       score: score,
  //       ranking: 0
  //     };
  //   });

  //   // Sort and assign rankings
  //   finalScores.sort((a, b) => b.score - a.score);
  //   finalScores.forEach((item, idx) => {
  //     item.ranking = idx + 1;
  //     item.rekomendasi = idx === 0 ? 'Sangat Direkomendasikan' :
  //                        idx === 1 ? 'Direkomendasikan' :
  //                        idx === 2 ? 'Cukup Direkomendasikan' : 'Kurang Direkomendasikan';
  //   });

  //   return {
  //     kriteria: kriteria.map((k, idx) => ({
  //       ...k,
  //       bobot: criteriaWeights[idx]
  //     })),
  //     alternatif,
  //     criteriaMatrix,
  //     criteriaWeights,
  //     criteriaConsistency,
  //     alternativeMatrices,
  //     alternativeWeights,
  //     finalScores
  //   };
  // };

  // const toggleSection = (section) => {
  //   setExpandedSections(prev => ({
  //     ...prev,
  //     [section]: !prev[section]
  //   }));
  // };

  const handleViewDetail = async (calculation) => {
    console.log(calculation)
    console.log(calculation)
    setSelectedCalculation(calculation);
    await fetchDetailCalculation(calculation);
  };

  const handleCloseDetail = () => {
    setSelectedCalculation(null);
    setDetailData(null);
  };


  // List view
  if (!selectedCalculation) {
    return (
      <div className=" mx-auto space-y-6 p-4">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Riwayat Perhitungan AHP</h1>
          <p className="text-green-100">Daftar hasil analisis rekomendasi pupuk kompos yang telah dilakukan</p>
        </div>

        <div className="space-y-4">
          {riwayat.map((calc) => {
            console.log(calc)
            return (
            <div
              key={calc.id_riwayat}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatTanggal(calc.tanggal)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{calc.nama_user}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{calc.hasil}</h3>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Skor: {calc.persen}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Button
                    size="none"
                    variant="default"
                    onClick={() => handleViewDetail(calc.kode_input)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    <Eye className="h-5 w-5" />
                    Lihat Detail
                  </Button>
                 <ModalDeletedRiwayat alternatifData={calc.kode_input}  />
                </div>
              </div>
            </div>
          )})}
        </div>

        {riwayat.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Perhitungan</h3>
            <p className="text-gray-500">Mulai perhitungan pertama Anda untuk melihat riwayat di sini</p>
          </div>
        )}
      </div>
    );
  }

  // Detail view with loading state
  if (loading || !setSelectedCalculation) {
    return (
      <div className=" mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat detail perhitungan...</p>
          </div>
        </div>
      </div>
    );
  }

  // Detail view with actual data
  return (
    <div className=" mx-auto space-y-6 p-6">
      <button
        onClick={handleCloseDetail}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
      >
        <X className="h-5 w-5" />
        Kembali ke List
      </button>

     

   <div className="mt-8">
                    <ComprehensiveResultsPage 
                        kriteriaData={kriteria} 
                        alternatifData={alternatives} 
                        kriteriaJudgment={kriteriaJudgment}
                        alternatifJudgmentData={alternatifJudgmentData}
                        kodeInput={2}
                        inputKrteria={inputKrteria}
                        userInput={userInput}
                        // calculationTimestamp={timestamp}
                    
                    />
                </div>

      {/* <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Pupuk yang Tidak Direkomendasikan:</h2>
        <ul className="list-disc list-inside">
          {detailData.finalScores.slice(1).map((result) => (
            <li key={result.id} className="mb-2">
              {result.pupuk}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default HasilPage;