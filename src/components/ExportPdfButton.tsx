import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DictionaryItem } from '../types';

// Import Roboto font
import '@fontsource/roboto';

interface ExportPdfButtonProps {
  data: DictionaryItem[];
  title?: string;
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ 
  data, 
  title = "Oxford Dictionary 3000" 
}) => {
  
  // PDF creation and download function
  const exportPdf = (): void => {
    
    // Ask for confirmation
    const confirmMessage = `Would you like to download all the words edited as a PDF?`;
    if (!window.confirm(confirmMessage)) {
      return; // Stop the process if the user canceled
    }
    
    // Create PDF using special fonts for Turkish character support
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16 // or 'smart'
    });
    
    // Use Unicode supported font instead of default Helvetica
    doc.addFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Add description
    doc.setFontSize(10);
    doc.text("The Oxford 3000 is the list of the 3000 most important words to learn in English, from A1 to B2 level.", 14, 28, { maxWidth: 180 });
    
    // Create table
    const tableColumn = ["No", "CEFR", "Type", "English", "Türkçe"];
    const tableRows: (string | number)[][] = [];
    
    // Add data to table
    data.forEach(item => {
      const rowData = [
        item.number,
        item.cefr || "",       // CEFR level, otherwise empty string
        item.wordType || "",   // Word type, empty string if not
        item.english,
        item.turkish
      ];
      tableRows.push(rowData);
    });
    
    // Current date for filename only
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    
    // Insert table into PDF with header only on first page
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: {
        font: 'Roboto',
        fontSize: 9
      },
      headStyles: {
        fillColor: [0, 255, 157],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        font: 'Roboto',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 10 },
      // Show header only on first page
      showHead: 'firstPage',
      // Fix spacing between pages
      didDrawPage: (data) => {
        // Reset top margin for pages after the first page
        if (data.pageNumber > 1) {
          // @ts-ignore - pageMargins exists but TypeScript doesn't recognize it
          data.settings.margin.top = 10;
        }
      },
      willDrawCell: (data) => {
        doc.setFont('Roboto');
      }
    });
    
    // Download PDF
    doc.save(`${title.replace(/\s+/g, '_')}_${date}.pdf`);
  };
  
  return (
    <button 
      onClick={exportPdf}
      className="export-pdf-button"
      title="Export as PDF"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
      PDF
    </button>
  );
};

export default ExportPdfButton;