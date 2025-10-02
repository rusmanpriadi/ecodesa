"use client"

import React, { useState, useMemo } from 'react';
import { Leaf, Calculator, TrendingUp, Home, Plus, FileText, ChevronRight, Eye, BarChart3, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import AHPCalculation from '../prioritas/prioritas-kriteria/page';
import PrioritasAlternatif from '../prioritas/prioritas-alternatif/page';
import SkorAkhir from '../prioritas/skor-akhir/page';

const ComprehensiveResultsPage = ({ 
  kriteriaData = [], 
  kriteriaJudgment = [], 
  alternatifData = [], 
  alternatifJudgmentData = [],
  inputKriteriaData = [], // Data input kriteria dari user
  kodeInput = null,
  inputKrteria = [],
  userInput 
  
}) => {
  const [expandedSections, setExpandedSections] = useState({
    inputData: true, // Section baru untuk data input user
    criteriaComparison: false,
    alternativeComparison: false,
    calculations: false,
    alternatifs: false,
    skorAkhir: false,
    finalResults: false
  });



 
  // Toggle section visibility
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Hitung comparisonMatrix hanya ketika dependencies berubah
  const comparisonMatrix = useMemo(() => {
    if (!kriteriaData.length || !kriteriaJudgment.length) return {};

    const matrix = {};
    
    // Initialize matrix
    kriteriaData.forEach(criterion => {
      matrix[criterion.id] = {};
      kriteriaData.forEach(otherCriterion => {
        matrix[criterion.id][otherCriterion.id] = 
          criterion.id === otherCriterion.id ? 1 : null;
      });
    });

    // Fill matrix
    kriteriaJudgment.forEach(judgment => {
      const { id_kriteria_i, id_kriteria_j, value } = judgment;
      const numValue = parseFloat(value);
      
      if (matrix[id_kriteria_i] && matrix[id_kriteria_j]) {
        matrix[id_kriteria_i][id_kriteria_j] = numValue;
        matrix[id_kriteria_j][id_kriteria_i] = parseFloat((1 / numValue).toFixed(3));
      }
    });

    return matrix;
  }, [kriteriaData, kriteriaJudgment]);

  // Hitung alternativeMatrices hanya ketika dependencies berubah
  const alternativeMatrices = useMemo(() => {
    if (!alternatifData.length || !alternatifJudgmentData.length || !kriteriaData.length) return {};

    const matrices = {};
    
    const judgmentsByKriteria = alternatifJudgmentData.reduce((acc, judgment) => {
      const kriteriaId = judgment.id_kriteria || 'default';
      if (!acc[kriteriaId]) acc[kriteriaId] = [];
      acc[kriteriaId].push(judgment);
      return acc;
    }, {});

    kriteriaData.forEach(kriteria => {
      const matrix = {};
      
      alternatifData.forEach(alt => {
        matrix[alt.id] = {};
        alternatifData.forEach(otherAlt => {
          matrix[alt.id][otherAlt.id] = alt.id === otherAlt.id ? 1 : null;
        });
      });

      const judgments = judgmentsByKriteria[kriteria.id] || [];
      judgments.forEach(judgment => {
        const { id_alternatif_i, id_alternatif_j, value } = judgment;
        const numValue = parseFloat(value);
        
        if (matrix[id_alternatif_i] && matrix[id_alternatif_j]) {
          matrix[id_alternatif_i][id_alternatif_j] = numValue;
          matrix[id_alternatif_j][id_alternatif_i] = parseFloat((1 / numValue).toFixed(3));
        }
      });

      matrices[kriteria.id] = matrix;
    });

    return matrices;
  }, [alternatifData, alternatifJudgmentData, kriteriaData]);

  // Fungsi helper
  const calculateColumnTotals = (matrix) => {
    const columnTotals = {};
    
    alternatifData.forEach(colAlternative => {
      let total = 0;
      alternatifData.forEach(rowAlternative => {
        const value = matrix[rowAlternative.id]?.[colAlternative.id] || 0;
        total += parseFloat(value) || 0;
      });
      columnTotals[colAlternative.id] = total.toFixed(3);
    });
    
    return columnTotals;
  };

  // Section header component
  const SectionHeader = ({ title, icon: Icon, section, color = "blue" }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center justify-between p-4 bg-gradient-to-r from-${color}-50 to-${color}-100 rounded-lg border border-${color}-200 hover:from-${color}-100 hover:to-${color}-150 transition-all duration-200`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-6 w-6 text-${color}-600`} />
        <h2 className={`text-xl font-semibold text-${color}-800`}>{title}</h2>
      </div>
      {expandedSections[section] ? 
        <ChevronUp className={`h-5 w-5 text-${color}-600`} /> : 
        <ChevronDown className={`h-5 w-5 text-${color}-600`} />
      }
    </button>
  );

 

  // Criteria comparison matrix component
  const CriteriaMatrix = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-sm font-semibold">Kode</th>
            {kriteriaData.map((k) => (
              <th key={k.id} className="border border-gray-300 p-2 text-sm font-semibold">
                {k.kode_kriteria}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kriteriaData.map((row) => (
            <tr key={row.id} className={row.id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border border-gray-300 p-2 font-semibold text-center bg-gray-100">
                {row.kode_kriteria}
              </td>
              {kriteriaData.map((col) => {
                const value = comparisonMatrix[row.id]?.[col.id];
                return (
                  <td 
                    key={col.id} 
                    className={`border border-gray-300 p-2 text-center text-sm ${
                      row.id === col.id 
                        ? 'bg-green-200 font-bold' 
                        : 'bg-white'
                    }`}
                  >
                    {value !== null ? value : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Alternative matrix component for a specific criteria
  const AlternativeMatrix = ({ kriteriaId, kriteriaInfo }) => {
    const matrix = alternativeMatrices[kriteriaId] || {};
    const columnTotals = calculateColumnTotals(matrix);

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">
          {kriteriaInfo.kode_kriteria} - {kriteriaInfo.nama_kriteria}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1">Alt</th>
                {alternatifData.map((alt) => (
                  <th key={alt.id} className="border border-gray-300 p-1">
                    {alt.kode_alternatif}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alternatifData.map((row) => (
                <tr key={row.id}>
                  <td className="border border-gray-300 p-1 bg-gray-100 font-semibold">
                    {row.kode_alternatif}
                  </td>
                  {alternatifData.map((col) => {
                    const value = matrix[row.id]?.[col.id];
                    return (
                      <td 
                        key={col.id} 
                        className={`border border-gray-300 p-2 text-center text-sm ${
                          row.id === col.id 
                            ? 'bg-green-200 font-bold' 
                            : 'bg-white'
                        }`}
                      >
                        {value !== null ? value : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-gray-100 border-t-2 border-gray-300">
                <td className="px-4 py-3 font-bold text-gray-900 bg-gray-200">
                  Total
                </td>
                {alternatifData.map(colAlternative => (
                  <td key={colAlternative.id} className="px-3 py-3 text-center font-bold text-gray-900 bg-gray-100">
                    {columnTotals[colAlternative.id] || '0.000'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
 
  console.log(inputKrteria);
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
  }

  return (
    <div className=" mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Hasil Perhitungan AHP - Sistem Rekomendasi Pupuk</h1>
        <p className="text-green-100">Analisis Hierarki Proses untuk Pemilihan Pupuk Kompos Terbaik</p>
        <div>
        {userInput.map((item) => (
            <div key={item.id_user} className='flex items-center gap-3'>

          <p  className="text-green-200 text-sm mt-2">Nama Petani: {item.nama_user}</p>/
          {/* <p className='text-green-200 text-sm mt-2'>Kode Input: {item.kode_input}</p>/ */}
          <p className='text-green-200 text-sm mt-2'>Tanggal Input: {formatDate(item.tanggal)}</p>
            </div>
        ))}
        </div>
      </div>

{/* data input kriteria */}
<div>
    {inputKrteria && (
      <div className=" rounded-lg shadow-lg p-3">
        <h2 className="text-2xl font-bold mb-4">Data Input Kriteria</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-sm font-semibold">Kode</th>
                <th className="border border-gray-300 p-2 text-sm font-semibold">Nama Kriteria</th>
                <th className="border border-gray-300 p-2 text-sm font-semibold">SubKriteria</th>
                <th className="border border-gray-300 p-2 text-sm font-semibold">Bobot</th>
              </tr>
            </thead>
            <tbody>
              {inputKrteria.map((item) => (
                <tr key={item.id} className={item.id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-gray-300 p-2 text-center">{item.kode_kriteria}</td>
                  <td className="border border-gray-300 p-2 text-center">{item.nama_kriteria}</td>
                  <td className="border border-gray-300 p-2 text-center">{item.nama_subkriteria}</td>
                  <td className="border border-gray-300 p-2 text-center">{item.bobot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
</div>
    

      {/* Section 1: Matriks Perbandingan Kriteria */}
      <div className="space-y-4">
        <SectionHeader 
          title="1. Matriks Perbandingan Berpasangan Kriteria" 
          icon={Calculator}
          section="criteriaComparison"
          color="blue"
        />
        
        {expandedSections.criteriaComparison && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Matriks perbandingan berpasangan antar kriteria berdasarkan skala kepentingan Saaty (1-9)
              </p>
            </div>
            <CriteriaMatrix />
          </div>
        )}
      </div>

      {/* Section 2: Matriks Perbandingan Alternatif */}
      <div className="space-y-4">
        <SectionHeader 
          title="2. Matriks Perbandingan Alternatif untuk Setiap Kriteria" 
          icon={TrendingUp}
          section="alternativeComparison"
          color="green"
        />
        
        {expandedSections.alternativeComparison && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 mb-6">
              Perbandingan alternatif pupuk untuk setiap kriteria. Setiap kriteria memiliki matriks perbandingan tersendiri.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {kriteriaData.map((kriteria) => (
                <AlternativeMatrix 
                  key={kriteria.id}
                  kriteriaId={kriteria.id}
                  kriteriaInfo={kriteria}
                />
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                📝 <strong>Catatan:</strong> Matriks di atas menampilkan perbandingan alternatif untuk setiap kriteria. 
                Data diambil langsung dari database judgment alternatif.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Perhitungan dan Konsistensi kriteria */}
      <div className="space-y-4">
        <SectionHeader 
          title="3. Perhitungan Bobot Prioritas Kriteria" 
          icon={FileText}
          section="calculations"
          color="purple"
        />
        
        {expandedSections.calculations && (
          <div className="bg-white rounded-lg shadow-lg p-6">
           <AHPCalculation 
             kriteriaData={kriteriaData}   
             kriteriaJudgment={kriteriaJudgment} 
             alternatifData={alternatifData}
             alternatifJudgmentData={alternatifJudgmentData}   
           />
          </div>
        )}
      </div>

      {/* Section 4: Perhitungan dan Konsistensi alternatif */}
      <div className="space-y-4">
        <SectionHeader 
          title="4. Perhitungan Bobot Prioritas Alternatif" 
          icon={FileText}
          section="alternatifs"
          color="yellow"
        />
        
        {expandedSections.alternatifs && (
          <div className="bg-white rounded-lg shadow-lg p-6">
           <PrioritasAlternatif />
          </div>
        )}
      </div>

      {/* Section 5: Skor Akhir */}
      <div className="space-y-4">
        <SectionHeader 
          title="5. Perhitungan Skor Akhir dan Ranking" 
          icon={FileText}
          section="skorAkhir"
          color="red"
        />
        
        {expandedSections.skorAkhir && (
          <div className="bg-white rounded-lg shadow-lg p-6">
           <SkorAkhir 
             kriteriaData={kriteriaData}   
             kriteriaJudgment={kriteriaJudgment} 
             alternatifData={alternatifData}
             alternatifJudgmentData={alternatifJudgmentData}
            
           />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 text-sm">
          Sistem Pendukung Keputusan menggunakan metode AHP (Analytical Hierarchy Process) 
          untuk memberikan rekomendasi pupuk kompos terbaik berdasarkan kondisi lahan Anda.
        </p>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 rounded-lg p-4 text-xs">
          <details>
            <summary className="font-semibold cursor-pointer">Debug Data</summary>
            <pre className="mt-2 whitespace-pre-wrap">
              Input Kriteria: {JSON.stringify(inputKriteriaData, null, 2)}
              {'\n\n'}
              Kriteria: {JSON.stringify(kriteriaData, null, 2)}
              {'\n\n'}
              Alternatif: {JSON.stringify(alternatifData, null, 2)}
              {'\n\n'}
              Kriteria Judgment: {JSON.stringify(kriteriaJudgment, null, 2)}
              {'\n\n'}
              Alternatif Judgment: {JSON.stringify(alternatifJudgmentData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveResultsPage;