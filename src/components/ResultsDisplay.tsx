import React, { useMemo } from 'react';
import type { ExtractedData, StudentInfo, StudentAnswer } from '../types';
import { DownloadIcon, InfoIcon } from './icons';

interface ResultsDisplayProps {
    data: ExtractedData;
}

const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-base font-semibold text-slate-800">{value || 'N/A'}</p>
    </div>
);

const StudentInfoCard: React.FC<{ info: StudentInfo; onDownload: () => void; }> = ({ info, onDownload }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Student Information</h3>
              <p className="text-sm text-slate-600">Extracted student details</p>
            </div>
          </div>
          <button
              onClick={onDownload}
              className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/40 text-blue-600 font-medium rounded-xl hover:bg-white hover:shadow-card transition-all duration-200 focus-ring"
              title="Download results as JSON"
          >
              <DownloadIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Download</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 hover:shadow-card transition-all duration-200">
              <InfoField label="Nom" value={info.nom} />
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 hover:shadow-card transition-all duration-200">
              <InfoField label="Matricule" value={info.matricule} />
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 hover:shadow-card transition-all duration-200">
              <InfoField label="Session" value={info.session} />
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 hover:shadow-card transition-all duration-200">
              <InfoField label="Epreuve" value={info.epreuve} />
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 hover:shadow-card transition-all duration-200">
              <InfoField label="Type" value={info.type} />
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 hover:shadow-card transition-all duration-200">
              <InfoField label="Classe" value={info.classe} />
            </div>
            <div className="md:col-span-2 lg:col-span-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/40 hover:shadow-card transition-all duration-200">
              <InfoField label="Code Examen" value={info.codeExamen} />
            </div>
        </div>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  const { studentInfo, answers } = data;

  const sortedAnswers = useMemo(() => {
    return [...answers].sort((a, b) => a.questionNumber - b.questionNumber);
  }, [answers]);

  // Function to calculate marked option from unmarked options
  const getMarkedOption = (unmarkedOptions: string) => {
    if (!unmarkedOptions) return 'All';
    
    const allOptions = ['A', 'B', 'C', 'D'];
    const unmarked = unmarkedOptions.split(' ').filter(opt => opt.trim() !== '');
    const marked = allOptions.filter(opt => !unmarked.includes(opt));
    
    return marked.length > 0 ? marked.join(' ') : 'None';
  };

  const handleDownload = () => {
    if (!data) return;

    const dataToDownload = {
        student: data.studentInfo.nom || 'Unknown Student',
        studentInfo: data.studentInfo,
        answers: sortedAnswers,
    };

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    const studentName = (data.studentInfo.nom || 'student').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const studentId = (data.studentInfo.matricule || 'no_id').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `results_${studentName}_${studentId}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };



  return (
    <div className="space-y-6">
        <StudentInfoCard info={studentInfo} onDownload={handleDownload} />

        <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Answer Breakdown</h3>
                  <p className="text-sm text-slate-600">Review extracted answers and make corrections</p>
                </div>
              </div>
              
              <div className="group relative flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-help">
                    <InfoIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="absolute bottom-full right-0 mb-3 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-elegant">
                      <div className="font-medium mb-1">How to read this table:</div>
                      <div>Each row shows which answer options (A, B, C, D) the student did NOT mark for that question. Click the edit icon to make corrections.</div>
                      <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                  </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
              <div className="overflow-y-auto max-h-[32rem] custom-scrollbar">
                <table className="min-w-full text-sm">
                    <thead className="bg-gradient-to-r from-slate-50 to-gray-50 sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                            <th scope="col" className="w-1/3 py-4 px-6 text-center font-bold text-slate-700">Question</th>
                            <th scope="col" className="w-1/3 py-4 px-6 text-center font-bold text-slate-700">Unmarked</th>
                            <th scope="col" className="w-1/3 py-4 px-6 text-center font-bold text-slate-700">Marked</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedAnswers.map((answer, index) => (
                            <tr key={answer.questionNumber} className="group hover:bg-blue-50/50 transition-colors duration-200">
                                <td className="py-3 px-6 whitespace-nowrap text-center">
                                  <span className="text-slate-700 font-semibold">Question {answer.questionNumber}</span>
                                </td>
                                <td className="py-3 px-6 whitespace-nowrap text-center">
                                  <span className="font-mono text-lg font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border">
                                    {answer.unmarkedOptions || 'None'}
                                  </span>
                                </td>
                                <td className="py-3 px-6 whitespace-nowrap text-center">
                                  <span className="font-mono text-lg font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                                    {getMarkedOption(answer.unmarkedOptions)}
                                  </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>

        </div>
    </div>
  );
};

export default ResultsDisplay;