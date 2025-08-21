import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';
import { extractSheetData } from './services/geminiService';
import type { ExtractedData } from './types';
import { UploadIcon } from './components/icons';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  const handleProcessSheet = useCallback(async () => {
    if (!uploadedImage) {
      setError('Please upload an image of the answer sheet.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await extractSheetData(uploadedImage, {});
      setExtractedData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  const canProcess = !isLoading && !!uploadedImage;

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
        <Header />
        
        <main className="mt-12 grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in-up">
          {/* Control Panel */}
          <div className="xl:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-elegant border border-white/20 h-fit transition-all duration-300 hover:shadow-xl">
              <div className="space-y-8">
                <div className="text-center pb-6 border-b border-slate-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl text-white mb-4">
                    <UploadIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Upload & Process</h3>
                  <p className="text-slate-600 text-sm">Get started by uploading your answer sheet</p>
                </div>
                
                <ImageUploader onImageUpload={setUploadedImage} disabled={isLoading} />
                
                <button
                  onClick={handleProcessSheet}
                  disabled={!canProcess}
                  className={`w-full group relative overflow-hidden flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-xl transition-all duration-300 focus-ring ${
                    canProcess
                      ? 'bg-gradient-primary text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  {isLoading ? (
                    <>
                      <Spinner className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">Processing...</span>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">Process Answer Sheet</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats Card */}
            {extractedData && (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-card border border-white/20 animate-fade-in-up">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Processing Complete
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{extractedData.answers.length}</div>
                    <div className="text-xs text-slate-600">Questions Detected</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-xs text-slate-600">Data Extracted</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-7 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-elegant border border-white/20 min-h-[600px] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
                <p className="text-slate-600 text-sm">Review and correct the extracted data</p>
              </div>
            </div>
            
            {isLoading && (
               <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-fade-in-up">
                  <div className="relative">
                    <Spinner size="lg" className="text-blue-600 animate-pulse-soft" />
                    <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-ping"></div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-lg font-medium text-slate-700">AI is analyzing the sheet...</p>
                    <p className="text-sm text-slate-500 mt-2">This usually takes 10-30 seconds</p>
                  </div>
                  <div className="mt-4 w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full shimmer"></div>
                  </div>
               </div>
            )}
            
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 text-red-800 p-6 rounded-xl shadow-card animate-fade-in-up" role="alert">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-semibold">Processing Error</p>
                </div>
                <p className="text-sm ml-11">{error}</p>
              </div>
            )}
            
            {!isLoading && !error && !extractedData && (
               <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-fade-in-up">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Ready to Process</h3>
                  <p className="text-slate-500 max-w-md">Upload an answer sheet image and click "Process" to extract student information and answers using AI.</p>
               </div>
            )}
            
            {extractedData && (
              <div className="animate-fade-in-up">
                <ResultsDisplay data={extractedData} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;