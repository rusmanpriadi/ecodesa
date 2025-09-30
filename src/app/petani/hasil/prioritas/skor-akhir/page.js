"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Download, Eye, CheckCircle, AlertCircle, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const SkorAkhir = ({kriteriaData = [], kriteriaJudgment = []}) => {

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  
  const [alternatives, setAlternatives] = useState([]);
  const [criteriaJudgments, setCriteriaJudgments] = useState([]);
  const [alternativeJudgments, setAlternativeJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Calculation results
  const [criteriaMatrix, setCriteriaMatrix] = useState({});
  const [criteriaWeights, setCriteriaWeights] = useState({});
  const [alternativeMatrices, setAlternativeMatrices] = useState({});
  const [alternativeWeights, setAlternativeWeights] = useState({});
  const [finalScores, setFinalScores] = useState({});
  const [ranking, setRanking] = useState([]);
  
  // Consistency calculations
  const [criteriaCI, setCriteriaCI] = useState(0);
  const [criteriaRI, setCriteriaRI] = useState(0);
  const [criteriaCR, setCriteriaCR] = useState(0);

  const RI_VALUES = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

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
      
      const criteriaRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment?session_id=${activeSession}`
      );
      const criteriaData = await criteriaRes.json();
      setCriteriaJudgments(criteriaData.status ? criteriaData.data : []);

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

    judgments.forEach(judgment => {
      const { id_kriteria_i, id_kriteria_j, id_alternatif_i, id_alternatif_j, value } = judgment;
      const i = id_kriteria_i || id_alternatif_i;
      const j = id_kriteria_j || id_alternatif_j;
      const numValue = parseFloat(value);
      
      if (matrix[i] && matrix[j]) {
        matrix[i][j] = numValue;
        matrix[j][i] = parseFloat((1 / numValue).toFixed(6));
      }
    });

    return matrix;
  };

  const calculateWeights = (matrix, items, itemIdKey = 'id') => {
    const weights = {};
    const columnSums = {};
    const rowTotals = {};
    
    items.forEach(item => {
      columnSums[item[itemIdKey]] = items.reduce((sum, otherItem) => {
        return sum + (matrix[otherItem[itemIdKey]]?.[item[itemIdKey]] || 0);
      }, 0);
    });
    
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
      
      weights[item[itemIdKey]] = (weightSum / items.length).toFixed(4);
      rowTotals[item[itemIdKey]] = rowTotal.toFixed(4);
    });
    
    return { weights, columnSums, rowTotals };
  };

  const calculateConsistency = (matrix, weights, items, itemIdKey = 'id') => {
    const n = items.length;
    if (n <= 2) return { CI: 0, RI: 0, CR: 0 };

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
    const critMatrix = buildMatrix(kriteriaJudgment, kriteriaData);
    setCriteriaMatrix(critMatrix);

    const { weights: critWeights, columnSums: critColumnSums, rowTotals: critRowTotals } = calculateWeights(critMatrix, kriteriaData);
    setCriteriaWeights({ weights: critWeights, columnSums: critColumnSums, rowTotals: critRowTotals });

    const critConsistency = calculateConsistency(critMatrix, critWeights, kriteriaData);
    setCriteriaCI(critConsistency.CI);
    setCriteriaRI(critConsistency.RI);
    setCriteriaCR(critConsistency.CR);

    const altMatrices = {};
    const altWeights = {};
    
    kriteriaData.forEach(criterion => {
      const criterionJudgments = alternativeJudgments.filter(j => j.id_kriteria === criterion.id);
      const matrix = buildMatrix(criterionJudgments, alternatives);
      const { weights, columnSums, rowTotals } = calculateWeights(matrix, alternatives);
      
      altMatrices[criterion.id] = matrix;
      altWeights[criterion.id] = { weights, columnSums, rowTotals };
    });
    
    setAlternativeMatrices(altMatrices);
    setAlternativeWeights(altWeights);

    const scores = {};
    alternatives.forEach(alternative => {
      let score = 0;
      kriteriaData.forEach(criterion => {
        const altWeight = parseFloat(altWeights[criterion.id]?.weights[alternative.id] || 0);
        const critWeight = parseFloat(critWeights[criterion.id] || 0);
        score += altWeight * critWeight;
      });
      scores[alternative.id] = score.toFixed(4);
    });
    
    setFinalScores(scores);

    const ranked = alternatives
      .map(alt => ({
        ...alt,
        score: parseFloat(scores[alt.id])
      }))
      .sort((a, b) => b.score - a.score);
    
    setRanking(ranked);

    // Auto save to riwayat after calculation
    saveToRiwayat(ranked, critWeights);
  };

  const getNextKodeInput = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/input-kriteria/get-last-kode-input`);
      const lastKode = response.data.last_kode || 0;
      return lastKode 
    } catch (error) {
      console.error('Error getting last kode_input:', error);
      return 1;
    }
  };

  const saveToRiwayat = async (rankedResults, weights) => {
    if (!rankedResults || rankedResults.length === 0 || !activeSession) return;

    try {
      setSaving(true);

      // Get top result
      const topResult = rankedResults[0];
      const topScore = topResult.score;
      const topPercentage = (topScore * 100).toFixed(2);
     
      // Get next Kode Input
      const kode_input = await getNextKodeInput();
      console.log('getNextKodeInput', kode_input);

      // Save to riwayat
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/riwayat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hasil: topResult.pupuk,
          persen: parseFloat(topPercentage),
          kode_input
        })
      });

      const result = await response.json();
      
      if (result.status) {
        console.log('Hasil berhasil disimpan ke riwayat:', result.data);
      } else {
        console.error('Gagal menyimpan ke riwayat:', result.message);
      }

    } catch (error) {
      console.error('Error saving to riwayat:', error);
    } finally {
      setSaving(false);
    }
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

  // Add check for required data before rendering tables
  const hasData = kriteriaData.length > 0 && alternatives.length > 0 && ranking.length > 0;

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
            <div className="flex items-center gap-3">
              {/* <Select value={activeSession?.toString()} onValueChange={(val) => setActiveSession(Number(val))}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              <Button
                onClick={fetchJudgmentData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </Button>
              {saving && (
                <div className="flex items-center gap-2 text-green-600">
                  <Save size={16} className="animate-pulse" />
                  <span className="text-sm">Menyimpan...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Belum Tersedia</h3>
            <p className="text-gray-600">Silakan pilih session dan klik Refresh untuk memuat data perhitungan.</p>
          </div>
        ) : (
          <>
            {/* Step 3: Perhitungan Skor Akhir dan Ranking */}
            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calculator size={20} />
                  C. Perhitungan Skor Akhir dan Ranking
                </h2>
              </div>
              
              <div className="p-6">
                {/* Tabel Perhitungan Skor Final */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">1. Perhitungan Skor Final</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2 font-semibold">Alternatif</th>
                          {kriteriaData.map(criterion => (
                            <th key={criterion.id} className="border border-gray-300 px-3 py-2 font-semibold text-center">
                              K{String(criterion.id).padStart(2, '0')}<br/>
                              <span className="text-xs font-normal">
                                ({criteriaWeights.weights?.[criterion.id] || 0})
                              </span>
                            </th>
                          ))}
                          <th className="border border-gray-300 px-3 py-2 font-semibold text-center">Skor Final</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alternatives.map(alternative => (
                          <tr key={alternative.id}>
                            <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">
                              A{String(alternative.id).padStart(2, '0')}
                            </td>
                            {kriteriaData.map(criterion => {
                              const altWeight = alternativeWeights[criterion.id]?.weights?.[alternative.id] || 0;
                              const critWeight = criteriaWeights.weights?.[criterion.id] || 0;
                              const score = (parseFloat(altWeight) * parseFloat(critWeight)).toFixed(4);
                              return (
                                <td key={criterion.id} className="border border-gray-300 px-3 py-2 text-center">
                                  {altWeight} × {critWeight} = {score}
                                </td>
                              );
                            })}
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold bg-purple-50">
                              {finalScores[alternative.id] || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ranking Final */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">2. Ranking Akhir</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-3 font-semibold">Ranking</th>
                          <th className="border border-gray-300 px-4 py-3 font-semibold">Kode</th>
                          <th className="border border-gray-300 px-4 py-3 font-semibold">Nama Alternatif</th>
                          <th className="border border-gray-300 px-4 py-3 font-semibold text-center">Skor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ranking.map((alternative, index) => (
                          <tr key={alternative.id} className={index === 0 ? 'bg-yellow-50' : ''}>
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 
                                index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                              }`}>
                                {index + 1}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 font-semibold">
                              {alternative.kode_alternatif}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              {alternative.pupuk}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center font-bold">
                              {alternative.score.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-600 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText size={20} />
                  Ringkasan Hasil Perhitungan
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-lg font-semibold text-gray-900">Alternatif Terpilih</div>
                    <div className="text-xl font-bold text-yellow-600 mt-2">
                      {`${ranking[0]?.kode_alternatif} - ${ranking[0]?.pupuk || 'N/A'}`}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Skor: {ranking[0]?.score.toFixed(4) || 'N/A'} ({(ranking[0]?.score * 100).toFixed(2)}%)
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-lg font-semibold text-gray-900">Total Alternatif</div>
                    <div className="text-xl font-bold text-blue-600 mt-2">
                      {alternatives.length}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="text-3xl mb-2">💾</div>
                    <div className="text-lg font-semibold text-gray-900">Status Penyimpanan</div>
                    <div className="text-sm text-green-600 mt-2">
                      {saving ? 'Sedang menyimpan...' : 'Tersimpan otomatis'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SkorAkhir;