import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { CalculationResult } from '../../types';
import { PDFReport } from './PDFReport';

interface DownloadButtonProps {
  results: CalculationResult;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ results }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const blob = await pdf(<PDFReport results={results} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Create filename from project name
      const filename = `${results.project.name.replace(/[^a-z0-9]/gi, '_')}_EV_PIR_Estimate.pdf`;

      // Create download link and click it
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="btn-secondary flex items-center gap-2"
    >
      {isGenerating ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF Report
        </>
      )}
    </button>
  );
};

export default DownloadButton;
