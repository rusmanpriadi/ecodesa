"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Download, Eye, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AHPCalculation = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [criteriaJudgments, setCriteriaJudgments] = useState([]);
  const [alternativeJudgments, setAlternativeJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
    fetchCriteria();
    fetchAlternatives();
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchJudgmentData();
    }
  }, [activeSession]);

  useEffect(() => {
    if (criteriaJudgments.length > 0 && alternativeJudgments.length > 0) {
      calculateAHP();
    }
  }, [criteriaJudgments, alternativeJudgments, criteria, alternatives]);

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

  const fetchCriteria = async () => {
    try {
      const response = await fetch('/api/criteria');
      const data = await response.json();
      setCriteria(data.data || []);
    } catch (error) {
      console.error('Error fetching criteria:', error);
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
      
      // Fetch criteria judgments
      const criteriaRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment?session_id=${activeSession}`
      );
      const criteriaData = await criteriaRes.json();
      setCriteriaJudgments(criteriaData.status ? criteriaData.data : []);

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
        matrix[j][i] = parseFloat((1 / numValue).toFixed(6));
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
      
      weights[item[itemIdKey]] = (weightSum / items.length).toFixed(4);
      rowTotals[item[itemIdKey]] = rowTotal.toFixed(4);
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
    const critMatrix = buildMatrix(criteriaJudgments, criteria);
    setCriteriaMatrix(critMatrix);

    // 2. Calculate criteria weights
    const { weights: critWeights, columnSums: critColumnSums, rowTotals: critRowTotals } = calculateWeights(critMatrix, criteria);
    setCriteriaWeights({ weights: critWeights, columnSums: critColumnSums, rowTotals: critRowTotals });

    // 3. Calculate criteria consistency
    const critConsistency = calculateConsistency(critMatrix, critWeights, criteria);
    setCriteriaCI(critConsistency.CI);
    setCriteriaRI(critConsistency.RI);
    setCriteriaCR(critConsistency.CR);

    // 4. Build alternative matrices for each criterion
    const altMatrices = {};
    const altWeights = {};
    
    criteria.forEach(criterion => {
      const criterionJudgments = alternativeJudgments.filter(j => j.id_kriteria === criterion.id);
      const matrix = buildMatrix(criterionJudgments, alternatives);
      const { weights, columnSums, rowTotals } = calculateWeights(matrix, alternatives);
      
      altMatrices[criterion.id] = matrix;
      altWeights[criterion.id] = { weights, columnSums, rowTotals };
    });
    
    setAlternativeMatrices(altMatrices);
    setAlternativeWeights(altWeights);

    // 5. Calculate final scores
    const scores = {};
    alternatives.forEach(alternative => {
      let score = 0;
      criteria.forEach(criterion => {
        const altWeight = parseFloat(altWeights[criterion.id]?.weights[alternative.id] || 0);
        const critWeight = parseFloat(critWeights[criterion.id] || 0);
        score += altWeight * critWeight;
      });
      scores[alternative.id] = score.toFixed(4);
    });
    
    setFinalScores(scores);

    // 6. Create ranking
    const ranked = alternatives
      .map(alt => ({
        ...alt,
        score: parseFloat(scores[alt.id])
      }))
      .sort((a, b) => b.score - a.score);
    
    setRanking(ranked);
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
              <Select value={activeSession?.toString()} onValueChange={(val) => setActiveSession(Number(val))}>
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
              </Select>
              <Button
                onClick={fetchJudgmentData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

       

        {/* Step 2: Perhitungan Bobot Alternatif per Kriteria */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calculator size={20} />
              B. Perhitungan Bobot Alternatif per Kriteria
            </h2>
          </div>
          
          <div className="p-6 space-y-8">
            {criteria.map(criterion => (
              <div key={criterion.id} className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Kriteria {criterion.kode_kriteria} - {criterion.nama_kriteria}
                </h3>
                
                {/* Alternative Matrix for this criterion */}
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 font-semibold">Alternatif</th>
                        {alternatives.map(alternative => (
                          <th key={alternative.id} className="border border-gray-300 px-3 py-2 font-semibold text-center">
                            {alternative.kode_alternatif}
                          </th>
                        ))}
                        <th className="border border-gray-300 px-3 py-2 font-semibold text-center">Bobot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alternatives.map(rowAlternative => (
                        <tr key={rowAlternative.id}>
                          <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">
                            {rowAlternative.kode_alternatif}
                          </td>
                          {alternatives.map(colAlternative => {
                            const originalValue = alternativeMatrices[criterion.id]?.[rowAlternative.id]?.[colAlternative.id] || 0;
                            const columnSum = alternativeWeights[criterion.id]?.columnSums?.[colAlternative.id] || 1;
                            const normalizedValue = (originalValue / columnSum).toFixed(4);
                            return (
                              <td key={colAlternative.id} className="border border-gray-300 px-3 py-2 text-center">
                                {normalizedValue}
                              </td>
                            );
                          })}
                          <td className="border border-gray-300 px-3 py-2 text-center font-semibold bg-green-50">
                            {alternativeWeights[criterion.id]?.weights?.[rowAlternative.id] || 0}
                          </td>
                        </tr>
                        
                      ))}
                     
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </div>
  );
}

export default AHPCalculation;