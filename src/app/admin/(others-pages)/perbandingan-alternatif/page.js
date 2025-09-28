"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calculator, Eye, Save, X, RefreshCw, Info, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AHPAlternativeComparison = () => {
  const [alternatives, setAlternatives] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [comparisonMatrix, setComparisonMatrix] = useState({});
  const [judgmentData, setJudgmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [activeCriteria, setActiveCriteria] = useState(null);
  const [showScaleModal, setShowScaleModal] = useState(false);
    const [AlternatifWeights, setAlternatifWeights] = useState({});


  // Skala perbandingan AHP
  const ahpScale = [
    { value: 1, label: 'Sama penting dengan', color: 'bg-emerald-500' },
    { value: 2, label: 'Mendekati sedikit lebih penting dari', color: 'bg-lime-500' },
    { value: 3, label: 'Sedikit lebih penting dari', color: 'bg-yellow-500' },
    { value: 4, label: 'Mendekati lebih penting dari', color: 'bg-orange-500' },
    { value: 5, label: 'Lebih penting dari', color: 'bg-red-500' },
    { value: 6, label: 'Mendekati sangat penting dari', color: 'bg-red-600' },
    { value: 7, label: 'Sangat penting dari', color: 'bg-red-700' },
    { value: 8, label: 'Mendekati mutlak dari', color: 'bg-red-800' },
    { value: 9, label: 'Mutlak sangat penting dari', color: 'bg-red-900' }
  ];

  // Load data from API
  useEffect(() => {
    fetchAlternativeData();
    fetchCriteriaData();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (activeSession && activeCriteria) {
      fetchJudgmentData();
    }
  }, [activeSession, activeCriteria]);

  // Fetch alternatives data
  const fetchAlternativeData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alternatif');
      const data = await response.json();
      setAlternatives(data.data || []);
    } catch (error) {
      console.error('Error fetching alternatives:', error);
      // Mock data for demonstration
      // setAlternatives([
      //   { id: 1, nama: 'Alternatif 1' },
      //   { id: 2, nama: 'Alternatif 2' },
      //   { id: 3, nama: 'Alternatif 3' },
      //   { id: 4, nama: 'Alternatif 4' }
      // ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch criteria data
  const fetchCriteriaData = async () => {
    try {
      const response = await fetch('/api/criteria');
      const data = await response.json();
      setCriteria(data.data || []);
      
      // Set default active criteria
      if (!activeCriteria && data.data && data.data.length > 0) {
        setActiveCriteria(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching criteria:', error);
      // Mock data for demonstration
      const mockCriteria = [
        { id: 1, nama: 'Kriteria 1' },
        { id: 2, nama: 'Kriteria 2' },
        { id: 3, nama: 'Kriteria 3' },
        { id: 4, nama: 'Kriteria 4' },
        { id: 5, nama: 'Kriteria 5' },
        { id: 6, nama: 'Kriteria 6' },
        { id: 7, nama: 'Kriteria 7' },
        { id: 8, nama: 'Kriteria 8' },
        { id: 9, nama: 'Kriteria 9' },
        { id: 10, nama: 'Kriteria 10' }
      ];
      setCriteria(mockCriteria);
      if (!activeCriteria) {
        setActiveCriteria(mockCriteria[0].id);
      }
    }
  };

  // Fetch judgment data from API
  const fetchJudgmentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alternatif_judgment?session_id=${activeSession}&id_kriteria=${activeCriteria}`
      );
      const result = await response.json();

      if (result.status) {
        const filteredData = result.data.filter(item => item.id_kriteria === activeCriteria);
        setJudgmentData(filteredData);
        buildComparisonMatrix(filteredData);
      } else {
        setJudgmentData([]);
        buildComparisonMatrix([]);
      }
    } catch (error) {
      console.error('Error fetching judgment data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      // // Mock session data
      // const mockSessions = [{ id: 1, nama: 'Session 1' }];
      // setSessions(mockSessions);
      // if (!activeSession) {
      //   setActiveSession(mockSessions[0].id);
      // }
    }
  };

  const calculateColumnTotals = () => {
  const columnTotals = {};
  
  alternatives.forEach(colAlternative => {
    let total = 0;
    alternatives.forEach(rowAlternative => {
      const value = comparisonMatrix[rowAlternative.id]?.[colAlternative.id] || 0;
      total += parseFloat(value) || 0;
    });
    columnTotals[colAlternative.id] = total.toFixed(3);
  });
  
  return columnTotals;
};

  // Build comparison matrix from judgment data
  const buildComparisonMatrix = (data) => {
    const matrix = {};
    
    // Initialize matrix with 1s on diagonal
    alternatives.forEach(alternative => {
      matrix[alternative.id] = {};
      alternatives.forEach(otherAlternative => {
        if (alternative.id === otherAlternative.id) {
          matrix[alternative.id][otherAlternative.id] = 1;
        } else {
          matrix[alternative.id][otherAlternative.id] = 0;
        }
      });
    });

    // Fill matrix with judgment data
    data.forEach(judgment => {
      const { id_alternatif_i, id_alternatif_j, value } = judgment;
      const numValue = parseFloat(value);
      
      if (matrix[id_alternatif_i] && matrix[id_alternatif_j]) {
        matrix[id_alternatif_i][id_alternatif_j] = numValue;
        matrix[id_alternatif_j][id_alternatif_i] = parseFloat((1 / numValue).toFixed(4));
      }
    });

    setComparisonMatrix(matrix);
  
  };

  // Recalculate matrix when alternatives change
  useEffect(() => {
    if (alternatives.length > 0 && judgmentData.length > 0) {
      buildComparisonMatrix(judgmentData);
    }
  }, [alternatives]);

  // Calculate weights using normalized eigenvector method
 

  // Save judgment to API
  const saveJudgment = async (alternativeI, alternativeJ, value) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alternatif_judgment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: activeSession,
          id_kriteria: activeCriteria,
          id_alternatif_i: alternativeI,
          id_alternatif_j: alternativeJ,
          value: value.toString()
        }),
      });
      
      if (response.ok) {
        fetchJudgmentData();
      }
    } catch (error) {
      console.error('Error saving judgment:', error);
    }
  };

  const getColorForValue = (value, alternativeI, alternativeJ) => {
    const numValue = parseFloat(value);
    
    // Diagonal (sama dengan dirinya sendiri) - hijau
    if (alternativeI === alternativeJ) {
      return 'bg-emerald-500 text-white';
    }
    
    // Upper triangle (di atas diagonal) - merah berdasarkan nilai
    if (alternativeI < alternativeJ) {
      return 'bg-red-500 text-white';
    }
    
    // Lower triangle (di bawah diagonal) - abu-abu tanpa warna mencolok
    return 'bg-gray-200 text-gray-800 border border-gray-300';
  };

  const handleCellEdit = (alternativeI, alternativeJ, newValue) => {
    const numValue = parseFloat(newValue);
    if (numValue >= 1 && numValue <= 9) {
      saveJudgment(alternativeI, alternativeJ, numValue);
    }
  };

  const calculateConsistencyRatio = () => {
    const n = alternatives.length;
    const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49][n] || 1.49;
    const CI = 0.08; // Mock CI calculation
    return n > 2 ? (CI / RI).toFixed(3) : '0.000';
  };

  // Navigation functions for criteria
  const getCurrentCriteriaIndex = () => {
    return criteria.findIndex(c => c.id === activeCriteria);
  };

  const goToPreviousCriteria = () => {
    const currentIndex = getCurrentCriteriaIndex();
    if (currentIndex > 0) {
      setActiveCriteria(criteria[currentIndex - 1].id);
    }
  };

  const goToNextCriteria = () => {
    const currentIndex = getCurrentCriteriaIndex();
    if (currentIndex < criteria.length - 1) {
      setActiveCriteria(criteria[currentIndex + 1].id);
    }
  };

  const getCurrentCriteria = () => {
    return criteria.find(c => c.id === activeCriteria);
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-lg transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const ScaleInfoModal = () => (
    <Modal 
      show={showScaleModal} 
      onClose={() => setShowScaleModal(false)}
      title="Skala Perbandingan AHP"
    >
      <div className="space-y-4">
        {ahpScale.map((scale, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <div>
              <span className="font-semibold text-gray-900">{scale.value} : </span>
              <span className="text-gray-600 ml-2">{scale.label}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );

  const EditableCell = ({ alternativeI, alternativeJ, value, disabled }) => {
    const [editValue, setEditValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
      if (editValue !== value && !disabled) {
        handleCellEdit(alternativeI, alternativeJ, editValue);
      }
      setIsEditing(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        setEditValue(value);
        setIsEditing(false);
      }
    };

    if (disabled || alternativeI === alternativeJ) {
      return (
        <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-sm font-semibold min-w-[50px] ${getColorForValue(value, alternativeI, alternativeJ)}`}>
          {value}
        </div>
      );
    }

    if (isEditing) {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="w-16 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        >
          {ahpScale.map((scale, index) => (
            <option key={index} value={scale.value}>
              {`${scale.value} : ${scale.label}`}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div 
        className={`inline-flex items-center justify-center px-2 py-1 rounded text-sm font-semibold min-w-[50px] cursor-pointer hover:opacity-80 transition-opacity ${getColorForValue(value, alternativeI, alternativeJ)}`}
        onClick={() => setIsEditing(true)}
        title="Klik untuk edit"
      >
        {value}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Perbandingan Antar Alternatif
              </h1>
              <p className="text-gray-600">Matriks Perbandingan Berpasangan - Metode AHP</p>
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
                onClick={() => setShowScaleModal(true)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all flex items-center gap-2"
              >
                <Info size={16} />
                Skala AHP
              </Button>

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

        {/* Criteria Navigation */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={goToPreviousCriteria}
                disabled={getCurrentCriteriaIndex() === 0}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {getCurrentCriteria()?.nama || `Kriteria ${activeCriteria}`}
                </h2>
                <p className="text-sm text-gray-600">
                  K{String(activeCriteria).padStart(2, '0')} - ({getCurrentCriteriaIndex() + 1} dari {criteria.length})
                </p>
              </div>

              <Button
                onClick={goToNextCriteria}
                disabled={getCurrentCriteriaIndex() === criteria.length - 1}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            <Select value={activeCriteria?.toString()} onValueChange={(val) => setActiveCriteria(Number(val))}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Pilih Kriteria" />
              </SelectTrigger>
              <SelectContent>
                {criteria.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    K{String(c.id).padStart(2, '0')} - {c.nama_kriteria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Comparison Matrix */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Alternatif</th>
                  {alternatives.map(alternative => (
                    <th key={alternative.id} className="px-3 py-3 text-center font-semibold text-sm min-w-[100px]">
                      {alternative.kode_alternatif}
                    </th>
                  ))}

                
                
                </tr>
              </thead>
              <tbody>
                {alternatives.map((rowAlternative) => (
                  <tr 
                    key={rowAlternative.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-100">
                     {rowAlternative.kode_alternatif}
                    </td>
                    {alternatives.map(colAlternative => {
                      const value = comparisonMatrix[rowAlternative.id]?.[colAlternative.id] || 0;
                      const isReciprocal = rowAlternative.id > colAlternative.id;
                      
                      return (
                        <td key={colAlternative.id} className="px-3 py-3 text-center">
                          <EditableCell
                            alternativeI={rowAlternative.id}
                            alternativeJ={colAlternative.id}
                            value={value}
                            disabled={isReciprocal}
                          />
                        </td>
                      );
                    })}
                   
                  </tr>
                ))}
                 <tr className="bg-gray-100 border-t-2 border-gray-300">
                    <td className="px-4 py-3 font-bold text-gray-900 bg-gray-200">
                        Total
                    </td>
                  {alternatives.map(colAlternative => {
                    const columnTotals = calculateColumnTotals();
                    return (
                      <td key={colAlternative.id} className="px-3 py-3 text-center font-bold text-gray-900 bg-gray-100">
                        {columnTotals[colAlternative.id] || '0.000'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Alternatif</div>
            <div className="text-2xl font-bold text-gray-900">{alternatives.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Perbandingan</div>
            <div className="text-2xl font-bold text-gray-900">{judgmentData.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Consistency Ratio</div>
            <div className={`text-2xl font-bold ${parseFloat(calculateConsistencyRatio()) <= 0.1 ? 'text-green-600' : 'text-red-600'}`}>
              {calculateConsistencyRatio()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Status</div>
            <div className={`text-lg font-bold ${parseFloat(calculateConsistencyRatio()) <= 0.1 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(calculateConsistencyRatio()) <= 0.1 ? 'Konsisten' : 'Tidak Konsisten'}
            </div>
          </div>
        </div>

        <ScaleInfoModal />
      </div>
    </div>
  );
};

export default AHPAlternativeComparison;