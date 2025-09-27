"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calculator, Eye, Save, X, RefreshCw, Info, Download } from 'lucide-react';
import AddPerbandinganModal from './modal/modalAddPerbandingan';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModalEditSession from './modal/editSession';
import ModalDeleteSession from './modal/deleteSession';

const AHPCriteriaComparison = () => {

  
  const [criteria, setCriteria] = useState([]);
  const [comparisonMatrix, setComparisonMatrix] = useState({});
  const [judgmentData, setJudgmentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  const [showScaleModal, setShowScaleModal] = useState(false);
  const [weights, setWeights] = useState({});
  
   // --- modal states & session being edited/deleted ---
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
    fetchJudgmentData();
    fetchCriteriaData();
    fetchSessions();
  }, [activeSession]);

  // Fetch criteria data (asumsi ada endpoint untuk kriteria)
  const fetchCriteriaData = async () => {
    try {
      setLoading(true);
      // Simulasi data kriteria - ganti dengan API call yang sebenarnya
      const response = await fetch('/api/criteria');
      const data = await response.json();
     
      setCriteria(data.data);
    } catch (error) {
      console.error('Error fetching criteria:', error);
    }
  };
  

  // Fetch judgment data from API
 const fetchJudgmentData = async () => {
  try {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment?session_id=${activeSession}`
    );
    const result = await response.json();

    if (result.status) {
      setJudgmentData(result.data);
      buildComparisonMatrix(result.data);
    } else {
      setJudgmentData([]);
      buildComparisonMatrix([]); // kosongkan matrix kalau tidak ada data
    }
  } catch (error) {
    console.error('Error fetching judgment data:', error);
  } finally {
    setLoading(false);
  }
};


const fetchSessions = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session`);
  const data = await res.json();
  setSessions(data.data);

  // kalau activeSession belum ada, baru set default
  if (!activeSession && data.data.length > 0) {
    setActiveSession(data.data[0].id);
  }
};





  // Build comparison matrix from judgment data
  const buildComparisonMatrix = (data) => {
    const matrix = {};
    
    // Initialize matrix with 1s on diagonal
    criteria.forEach(criterion => {
      matrix[criterion.id] = {};
      criteria.forEach(otherCriterion => {
        if (criterion.id === otherCriterion.id) {
          matrix[criterion.id][otherCriterion.id] = 1;
        } else {
          matrix[criterion.id][otherCriterion.id] = 0; // Default value
        }
      });
    });

  
    // Fill matrix with judgment data
    data.forEach(judgment => {
      const { id_kriteria_i, id_kriteria_j, value } = judgment;
      const numValue = parseFloat(value);
      
      if (matrix[id_kriteria_i] && matrix[id_kriteria_j]) {
        matrix[id_kriteria_i][id_kriteria_j] = numValue;
        matrix[id_kriteria_j][id_kriteria_i] = parseFloat((1 / numValue).toFixed(6));
      }
    });

    setComparisonMatrix(matrix);
    calculateWeights(matrix);
  };

  // Recalculate matrix when criteria change
  useEffect(() => {
    if (criteria.length > 0 && judgmentData.length > 0) {
      buildComparisonMatrix(judgmentData);
    }
  }, [criteria]);

  // Calculate weights using normalized eigenvector method
  const calculateWeights = (matrix) => {
    const newWeights = {};
    const columnSums = {};
    
    // Calculate column sums
    criteria.forEach(criterion => {
      columnSums[criterion.id] = criteria.reduce((sum, otherCriterion) => {
        return sum + (matrix[otherCriterion.id]?.[criterion.id] || 0);
      }, 0);
    });
    
    // Calculate normalized weights
    criteria.forEach(criterion => {
      let weightSum = 0;
      criteria.forEach(otherCriterion => {
        if (columnSums[otherCriterion.id] > 0) {
          weightSum += (matrix[criterion.id]?.[otherCriterion.id] || 0) / columnSums[otherCriterion.id];
        }
      });
      newWeights[criterion.id] = (weightSum / criteria.length).toFixed(3);
    });
    
    setWeights(newWeights);
  };

  // Save judgment to API
  const saveJudgment = async (criteriaI, criteriaJ, value) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kriteria_judgment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: activeSession,
          id_kriteria_i: criteriaI,
          id_kriteria_j: criteriaJ,
          value: value.toString()
        }),
      });
      
      if (response.ok) {
        fetchJudgmentData(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving judgment:', error);
    }
  };

  const getColorForValue = (value, criteriaI, criteriaJ) => {
    const numValue = parseFloat(value);
    
    // Diagonal (sama dengan dirinya sendiri) - hijau
    if (criteriaI === criteriaJ) {
      return 'bg-emerald-500 text-white';
    }
    
    // Upper triangle (di atas diagonal) - merah berdasarkan nilai
    if (criteriaI < criteriaJ) {
      if (numValue === 2) return 'bg-red-500 text-white';
      if (numValue === 3) return 'bg-red-500 text-white';
      if (numValue === 4) return 'bg-red-500 text-white';
      if (numValue === 5) return 'bg-red-500 text-white';
      if (numValue >= 6) return 'bg-red-500 text-white';
      return 'bg-red-500 text-white'; // default untuk nilai lainnya
    }
    
    // Lower triangle (di bawah diagonal) - abu-abu tanpa warna mencolok
    return 'bg-gray-200 text-gray-800 border border-gray-300';
  };

  const handleCellEdit = (criteriaI, criteriaJ, newValue) => {
    const numValue = parseFloat(newValue);
    if (numValue >= 1 && numValue <= 9) {
      saveJudgment(criteriaI, criteriaJ, numValue);
    }
  };

  const calculateConsistencyRatio = () => {
    // Simplified CR calculation
    const n = criteria.length;
    const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49][n] || 1.49;
    const CI = 0.08; // Mock CI calculation
    return n > 2 ? (CI / RI).toFixed(3) : '0.000';
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
            {/* <div className={`w-8 h-8 ${scale.color} rounded flex items-center justify-center text-white text-sm font-bold`}>
              {scale.value}
            </div> */}
            <div>
              <span className="font-semibold text-gray-900">{scale.value} : </span>
              <span className="text-gray-600 ml-2">{scale.label}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );

  const EditableCell = ({ criteriaI, criteriaJ, value, disabled }) => {
    const [editValue, setEditValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
      if (editValue !== value && !disabled) {
        handleCellEdit(criteriaI, criteriaJ, editValue);
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

    if (disabled || criteriaI === criteriaJ) {
      return (
        <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-sm font-semibold min-w-[50px] ${getColorForValue(value, criteriaI, criteriaJ)}`}>
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
        className={`inline-flex items-center justify-center px-2 py-1 rounded text-sm font-semibold min-w-[50px] cursor-pointer hover:opacity-80 transition-opacity ${getColorForValue(value, criteriaI, criteriaJ)}`}
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
                Perbandingan Kriteria
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
    <div className="border-t my-2" />
    <button
      className="w-full text-left px-2 py-1 text-blue-600 hover:bg-blue-50"
      onClick={(e) => {
        e.preventDefault();
        setEditModalOpen(true);
      }}
    >
      ✏️ Edit Session
    </button>
    <button
      className="w-full text-left px-2 py-1 text-red-600 hover:bg-red-50"
      onClick={(e) => {
        e.preventDefault();
        setDeleteModalOpen(true);
      }}
    >
      🗑️ Delete Session
    </button>
  </SelectContent>
</Select>

{/* Modal edit & delete */}
<ModalEditSession
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  session={sessions.find((s) => s.id === activeSession)}
  onUpdated={fetchSessions}
/>

<ModalDeleteSession
  open={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  session={sessions.find((s) => s.id === activeSession)}
  onDeleted={fetchSessions}
/>



              <Button
              variant={"primary"}
                onClick={() => setShowScaleModal(true)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all flex items-center gap-2"
              >
                <Info size={16} />
                Skala AHP
              </Button>
            
              <AddPerbandinganModal sessions={sessions}   />
              <Button
              variant={"primary"}
                onClick={fetchJudgmentData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </Button>
             

            </div>
          </div>
        </div>

        {/* Main Comparison Matrix */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Kode</th>
                  {criteria.map(criterion => (
                    <th key={criterion.id} className="px-3 py-3 text-center font-semibold text-sm min-w-[100px]">
                      K{String(criterion.id).padStart(2, '0')}
                    </th>
                  ))}
                  {/* <th className="px-4 py-3 text-center font-semibold">Bobot</th> */}
                </tr>
              </thead>
              <tbody>
                {criteria.map((rowCriterion) => (
                  <tr 
                    key={rowCriterion.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-100">
                      K{String(rowCriterion.id).padStart(2, '0')}
                    </td>
                    {criteria.map(colCriterion => {
                      const value = comparisonMatrix[rowCriterion.id]?.[colCriterion.id] || 0;
                      const isReciprocal = rowCriterion.id > colCriterion.id;
                      
                      return (
                        <td key={colCriterion.id} className="px-3 py-3 text-center">
                          <EditableCell
                            criteriaI={rowCriterion.id}
                            criteriaJ={colCriterion.id}
                            value={value}
                            disabled={isReciprocal}
                          />
                        </td>
                      );
                    })}
                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Kriteria</div>
            <div className="text-2xl font-bold text-gray-900">{criteria.length}</div>
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

export default AHPCriteriaComparison;