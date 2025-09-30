"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Download, Eye, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AHPCalculation = (  {kriteriaData , kriteriaJudgment , 
  alternatifData , 
  alternatifJudgmentData}  ) => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  
  const [alternatives, setAlternatives] = useState([]);

  const [alternativeJudgments, setAlternativeJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Calculation results
  const [criteriaMatrix, setCriteriaMatrix] = useState({});
  const [criteriaWeights, setCriteriaWeights] = useState({});

  
  // Consistency calculations
  const [criteriaCI, setCriteriaCI] = useState(0);
  const [criteriaRI, setCriteriaRI] = useState(0);
  const [criteriaCR, setCriteriaCR] = useState(0);

  const RI_VALUES = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
  const RI_TABLE = [
  { ordo: 1, ri: 0.00 },
  { ordo: 2, ri: 0.00 },
  { ordo: 3, ri: 0.58 },
  { ordo: 4, ri: 0.90 },
  { ordo: 5, ri: 1.12 },
  { ordo: 6, ri: 1.24 },
  { ordo: 7, ri: 1.32 },
  { ordo: 8, ri: 1.41 },
  { ordo: 9, ri: 1.45 },
  { ordo: 10, ri: 1.49 }
];

  useEffect(() => {
    fetchSessions();
  
    fetchAlternatives();
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchJudgmentData();
    }
  }, [activeSession]);

  useEffect(() => {
    if (kriteriaJudgment.length > 0 && alternativeJudgments.length > 0) {
      calculateAHP();
    }
  }, [kriteriaJudgment, alternativeJudgments, kriteriaData, alternatives]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session`);
      const data = await res.json();
      setSessions(data.data || []);
      if (!activeSession && data.data && data.data.length > 0) {
        setActiveSession(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };


  const fetchAlternatives = async () => {
    try {
      const response = await fetch('/api/alternatif');
      const data = await response.json();
      setAlternatives(data.data || []);
    } catch (error) {
      console.error('Error fetching alternatives:', error);
    }
  };

  const fetchJudgmentData = async () => {
    try {
      setLoading(true);
      
  
      // Fetch alternative judgments
      const alternativeRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alternatif_judgment?session_id=${activeSession}`
      );
      const alternativeData = await alternativeRes.json();
      setAlternativeJudgments(alternativeData.status ? alternativeData.data : []);

    } catch (error) {
      console.error('Error fetching judgment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildMatrix = (judgments, items, itemIdKey = 'id') => {
    const matrix = {};
    
    // Initialize matrix
    items.forEach(item => {
      matrix[item[itemIdKey]] = {};
      items.forEach(otherItem => {
        if (item[itemIdKey] === otherItem[itemIdKey]) {
          matrix[item[itemIdKey]][otherItem[itemIdKey]] = 1;
        } else {
          matrix[item[itemIdKey]][otherItem[itemIdKey]] = 0;
        }
      });
    });

    // Fill matrix with judgments
    judgments.forEach(judgment => {
      const { id_kriteria_i, id_kriteria_j, id_alternatif_i, id_alternatif_j, value } = judgment;
      const i = id_kriteria_i || id_alternatif_i;
      const j = id_kriteria_j || id_alternatif_j;
      const numValue = parseFloat(value);
      
      if (matrix[i] && matrix[j]) {
        matrix[i][j] = numValue;
        matrix[j][i] = parseFloat((1 / numValue).toFixed(3));
      }
    });

    return matrix;
  };

  const calculateWeights = (matrix, items, itemIdKey = 'id') => {
    const weights = {};
    const columnSums = {};
    const rowTotals = {};
    
    // Calculate column sums
    items.forEach(item => {
      columnSums[item[itemIdKey]] = items.reduce((sum, otherItem) => {
        return sum + (matrix[otherItem[itemIdKey]]?.[item[itemIdKey]] || 0);
      }, 0);
    });
    
    // Calculate normalized matrix and row averages
    items.forEach(item => {
      let weightSum = 0;
      let rowTotal = 0;
      
      items.forEach(otherItem => {
        const normalizedValue = columnSums[otherItem[itemIdKey]] > 0 
          ? (matrix[item[itemIdKey]]?.[otherItem[itemIdKey]] || 0) / columnSums[otherItem[itemIdKey]]
          : 0;
        weightSum += normalizedValue;
        rowTotal += matrix[item[itemIdKey]]?.[otherItem[itemIdKey]] || 0;
      });
      
      weights[item[itemIdKey]] = (weightSum / items.length).toFixed(3);
      rowTotals[item[itemIdKey]] = rowTotal.toFixed(3);
    });
    
    return { weights, columnSums, rowTotals };
  };

  const calculateConsistency = (matrix, weights, items, itemIdKey = 'id') => {
    const n = items.length;
    if (n <= 2) return { CI: 0, RI: 0, CR: 0 };

    // Calculate λmax
    let lambdaMax = 0;
    items.forEach(item => {
      let sum = 0;
      items.forEach(otherItem => {
        sum += (matrix[item[itemIdKey]]?.[otherItem[itemIdKey]] || 0) * parseFloat(weights[otherItem[itemIdKey]]);
      });
      lambdaMax += sum / parseFloat(weights[item[itemIdKey]]);
    });
    lambdaMax = lambdaMax / n;

    const CI = (lambdaMax - n) / (n - 1);
    const RI = RI_VALUES[n] || 1.49;
    const CR = CI / RI;

    return { CI, RI, CR, lambdaMax };
  };

  const calculateAHP = () => {
    // 1. Build criteria matrix
    const critMatrix = buildMatrix(kriteriaJudgment, kriteriaData);
    setCriteriaMatrix(critMatrix);

    // 2. Calculate criteria weights
    const { weights: critWeights, columnSums: critColumnSums, rowTotals: critRowTotals } = calculateWeights(critMatrix, kriteriaData);
    setCriteriaWeights({ weights: critWeights, columnSums: critColumnSums, rowTotals: critRowTotals });

    // 3. Calculate criteria consistency
    const critConsistency = calculateConsistency(critMatrix, critWeights, kriteriaData);
    setCriteriaCI(critConsistency.CI);
    setCriteriaRI(critConsistency.RI);
    setCriteriaCR(critConsistency.CR);

    // 4. Build alternative matrices for each criterion
    const altMatrices = {};
    const altWeights = {};
    
    kriteriaData.forEach(criterion => {
      const criterionJudgments = alternativeJudgments.filter(j => j.id_kriteria === criterion.id);
      const matrix = buildMatrix(criterionJudgments, alternatives);
      const { weights, columnSums, rowTotals } = calculateWeights(matrix, alternatives);
      
      altMatrices[criterion.id] = matrix;
      altWeights[criterion.id] = { weights, columnSums, rowTotals };
    });
    
 
 

    // 5. Calculate final scores
    const scores = {};
    alternatives.forEach(alternative => {
      let score = 0;
      kriteriaData.forEach(criterion => {
        const altWeight = parseFloat(altWeights[criterion.id]?.weights[alternative.id] || 0);
        const critWeight = parseFloat(critWeights[criterion.id] || 0);
        score += altWeight * critWeight;
      });
      scores[alternative.id] = score.toFixed(3);
    });
    
 
   
  };

  // Tambahkan fungsi untuk menghitung Consistency Measure setelah fungsi calculateConsistency
const calculateConsistencyMeasure = (matrix, weights, items, itemIdKey = 'id') => {
  const consistencyMeasures = {};
  let totalCM = 0;
  
  items.forEach(rowItem => {
    let cm = 0;
    items.forEach(colItem => {
      const matrixValue = matrix[rowItem[itemIdKey]]?.[colItem[itemIdKey]] || 0;
      const weight = parseFloat(weights[colItem[itemIdKey]] || 0);
      cm += matrixValue * weight;
    });
    consistencyMeasures[rowItem[itemIdKey]] = cm.toFixed(3);
    totalCM += cm;
  });
  
  const lambdaMax = totalCM;
  return { consistencyMeasures, lambdaMax };
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Memuat perhitungan...</p>
        </div>
      </div>
    );
  }
if (!kriteriaData || !Array.isArray(kriteriaData) || kriteriaData.length === 0) {
  return <p className="text-center text-gray-500">Data kriteria belum tersedia</p>
}
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Perhitungan Metode AHP
              </h1>
              <p className="text-gray-600">Analytic Hierarchy Process - Langkah Perhitungan Lengkap</p>
            </div>
           
          </div>
        </div>

        {/* Step 1: Perhitungan Bobot Prioritas Kriteria */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
        
          
          <div className="p-6">
            {/* 1. Matriks Perbandingan Kriteria */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">1. Matriks Perbandingan Kriteria</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 font-semibold">Kriteria</th>
                      {(kriteriaData || []).map(criterion => (
  <th key={criterion.id} className="border border-gray-300 px-3 py-2 font-semibold text-center">
    {criterion.kode_kriteria}
  </th>
))}
                      {/* <th className="border border-gray-300 px-3 py-2 font-semibold text-center">Total Baris</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {kriteriaData.map(rowCriterion => (
                      <tr key={rowCriterion.id}>
                        <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">
                         {`${rowCriterion.kode_kriteria} (${rowCriterion.nama_kriteria})`}
                        </td>
                        {kriteriaData.map(colCriterion => (
                          <td key={colCriterion.id} className="border border-gray-300 px-3 py-2 text-center">
                            {criteriaMatrix[rowCriterion.id]?.[colCriterion.id] || 0}
                          </td>
                        ))}
                        {/* <td className="border border-gray-300 px-3 py-2 text-center font-semibold bg-blue-50">
                          {criteriaWeights.rowTotals?.[rowCriterion.id] || 0}
                        </td> */}
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 px-3 py-2 font-semibold">Total Kolom</td>
                      {kriteriaData.map(criterion => (
                        <td key={criterion.id} className="border border-gray-300 px-3 py-2 text-center font-semibold">
                          {criteriaWeights.columnSums?.[criterion.id].toFixed(3) || 0}
                        </td>
                      ))}
                      {/* <td className="border border-gray-300 px-3 py-2"></td> */}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Matriks Normalisasi */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">2. Matriks Normalisasi</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 font-semibold">Kriteria</th>
                      {kriteriaData.map(criterion => (
                        <th key={criterion.id} className="border border-gray-300 px-3 py-2 font-semibold text-center">
                           {criterion.kode_kriteria}
                        </th>
                      ))}
                      <th className="border border-gray-300 px-3 py-2 font-semibold text-center">Bobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kriteriaData.map(rowCriterion => (
                      <tr key={rowCriterion.id}>
                        <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">
                          {rowCriterion.kode_kriteria}
                        </td>
                        {kriteriaData.map(colCriterion => {
                          const originalValue = criteriaMatrix[rowCriterion.id]?.[colCriterion.id] || 0;
                          const columnSum = criteriaWeights.columnSums?.[colCriterion.id] || 1;
                          const normalizedValue = (originalValue / columnSum).toFixed(3);
                          return (
                            <td key={colCriterion.id} className="border border-gray-300 px-3 py-2 text-center">
                              {normalizedValue}
                            </td>
                          );
                        })}
                        <td className="border border-gray-300 px-3 py-2 text-center font-semibold bg-green-50">
                          {criteriaWeights.weights?.[rowCriterion.id] || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


      {/* // Tambahkan bagian ini setelah "2. Matriks Normalisasi" dan sebelum "3. Uji Konsistensi" */}
            {/* 2.5. Tabel Consistency Measure (CM) */}
            <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">3. Tabel Consistency Measure (CM)</h3>
            <p className="text-sm text-gray-600 mb-4">
                CM diperoleh dari perkalian setiap baris matriks perbandingan dengan bobot prioritas masing-masing kolom
            </p>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 font-semibold">Kriteria</th>
                    {kriteriaData.map(criterion => (
                        <th key={criterion.id} className="border border-gray-300 px-3 py-2 font-semibold text-center text-xs">
                        {criterion.kode_kriteria}<br/>
                        <span className="text-xs font-normal">({criteriaWeights.weights?.[criterion.id] || 0})</span>
                        </th>
                    ))}
                    <th className="border border-gray-300 px-3 py-2 font-semibold text-center bg-blue-100">CM</th>
                    <th className="border border-gray-300 px-3 py-2 font-semibold text-center bg-orange-100">CM/Bobot</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                    const { consistencyMeasures } = calculateConsistencyMeasure(criteriaMatrix, criteriaWeights.weights || {}, kriteriaData);
                    return kriteriaData.map(rowCriterion => {
                        const cm = consistencyMeasures[rowCriterion.id];
                        const weight = parseFloat(criteriaWeights.weights?.[rowCriterion.id] || 0);
                        const cmOverWeight = weight > 0 ? (parseFloat(cm) / weight).toFixed(3) : '0.0000';
                        
                        return (
                        <tr key={rowCriterion.id}>
                            <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">
                            {rowCriterion.kode_kriteria}
                            </td>
                            {kriteriaData.map(colCriterion => (
                            <td key={colCriterion.id} className="border border-gray-300 px-3 py-2 text-center text-sm">
                                {criteriaMatrix[rowCriterion.id]?.[colCriterion.id] || 0}
                                <span className="text-xs text-gray-500 block">
                                × {criteriaWeights.weights?.[colCriterion.id] || 0}
                                </span>
                            </td>
                            ))}
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold bg-blue-50">
                            {cm}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold bg-orange-50">
                            {cmOverWeight}
                            </td>
                        </tr>
                        );
                    });
                    })()}
                    <tr className="bg-gray-100">
                    <td className="border border-gray-300 px-3 py-2 font-bold" colSpan={kriteriaData.length + 1}>
                        λmax (Lambda Max)
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold bg-yellow-100">
                        {(() => {
                        const { consistencyMeasures } = calculateConsistencyMeasure(criteriaMatrix, criteriaWeights.weights || {}, kriteriaData);
                        let total = 0;
                        kriteriaData.forEach(criterion => {
                            const weight = parseFloat(criteriaWeights.weights?.[criterion.id] || 0);
                            const cm = parseFloat(consistencyMeasures[criterion.id] || 0);
                            if (weight > 0) total += cm / weight;
                        });
                        return (total / kriteriaData.length).toFixed(3);
                        })()}
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            
            {/* Penjelasan Formula */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Formula Perhitungan:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                <p>• <strong>CM (Consistency Measure)</strong> = Σ (nilai baris × bobot kolom)</p>
                <p>• <strong>CM/Bobot</strong> = CM ÷ Bobot Prioritas</p>
                <p>• <strong>λmax</strong> = (Σ CM/Bobot) ÷ n</p>
                <p>• <strong>CI</strong> = (λmax - n) ÷ (n - 1)</p>
                </div>
            </div>
            </div>


            {/* 3. Uji Konsistensi */}
           {/* // 2. Ganti bagian "3. Uji Konsistensi" dengan kode berikut: */}
{/* 3. Uji Konsistensi */}
<div className="mb-6">
  <h3 className="text-lg font-semibold mb-4">4. Uji Konsistensi Kriteria</h3>
  
  {/* Tabel Random Index */}
  <div className="mb-6">
    <h4 className="text-md font-semibold mb-3">Tabel Random Index (RI)</h4>
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 font-semibold">Ordo Matriks</th>
            {RI_TABLE.map(item => (
              <th key={item.ordo} className={`border border-gray-300 px-3 py-2 font-semibold text-center ${item.ordo === kriteriaData.length ? 'bg-yellow-100' : ''}`}>
                {item.ordo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">Random Index</td>
            {RI_TABLE.map(item => (
              <td key={item.ordo} className={`border border-gray-300 px-3 py-2 text-center ${item.ordo === kriteriaData.length ? 'bg-yellow-100 font-bold' : ''}`}>
                {item.ri.toFixed(2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  {/* Tabel Hasil Konsistensi */}
  <div className="mb-6">
    <h4 className="text-md font-semibold mb-3">Hasil Perhitungan Konsistensi</h4>
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-3 font-semibold text-left">Parameter</th>
            <th className="border border-gray-300 px-4 py-3 font-semibold text-center">Nilai</th>
            <th className="border border-gray-300 px-4 py-3 font-semibold text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-3 font-semibold">Ordo Matriks (n)</td>
            <td className="border border-gray-300 px-4 py-3 text-center">{kriteriaData.length}</td>
            <td className="border border-gray-300 px-4 py-3 text-gray-600">Jumlah kriteria yang dibandingkan</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-3 font-semibold">Consistency Index (CI)</td>
            <td className="border border-gray-300 px-4 py-3 text-center font-mono">{criteriaCI.toFixed(4)}</td>
            <td className="border border-gray-300 px-4 py-3 text-gray-600">CI = (λmax - n) / (n - 1)</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-3 font-semibold">Random Index (RI)</td>
            <td className="border border-gray-300 px-4 py-3 text-center font-mono">{criteriaRI.toFixed(2)}</td>
            <td className="border border-gray-300 px-4 py-3 text-gray-600">Berdasarkan ordo matriks {kriteriaData.length}</td>
          </tr>
          <tr className={`${criteriaCR <= 0.1 ? 'bg-green-50' : 'bg-red-50'}`}>
            <td className="border border-gray-300 px-4 py-3 font-semibold">Consistency Ratio (CR)</td>
            <td className={`border border-gray-300 px-4 py-3 text-center font-mono font-bold ${criteriaCR <= 0.1 ? 'text-green-600' : 'text-red-600'}`}>
              {criteriaCR.toFixed(4)}
            </td>
            <td className="border border-gray-300 px-4 py-3">
              <span className="text-gray-600">CR = CI / RI, </span>
              <span className={`font-semibold ${criteriaCR <= 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                {criteriaCR <= 0.1 ? 'Konsisten (≤ 0.1)' : 'Tidak Konsisten (> 0.1)'}
              </span>
            </td>
          </tr>
          <tr className={`${criteriaCR <= 0.1 ? 'bg-green-100' : 'bg-red-100'}`}>
            <td className="border border-gray-300 px-4 py-3 font-bold">Status Konsistensi</td>
            <td className="border border-gray-300 px-4 py-3 text-center">
              <div className={`flex items-center justify-center gap-2 font-bold ${criteriaCR <= 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                {criteriaCR <= 0.1 ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                {criteriaCR <= 0.1 ? 'KONSISTEN' : 'TIDAK KONSISTEN'}
              </div>
            </td>
            <td className="border border-gray-300 px-4 py-3">
              <span className={`font-semibold ${criteriaCR <= 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                {criteriaCR <= 0.1 
                  ? 'Matriks perbandingan dapat diterima' 
                  : 'Perlu revisi penilaian perbandingan'
                }
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
          </div>
        </div>

      
      </div>
    </div>
  );
}

export default AHPCalculation;