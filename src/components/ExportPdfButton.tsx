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
  title = "Oxford Dictionary" 
}) => {
  
  // PDF creation and download function
  const exportPdf = (): void => {
    
    // Ask for confirmation
    const confirmMessage = `${data.length} do you want to download words as PDF??`;
    if (!window.confirm(confirmMessage)) {
      return; // Stop the process if the user canceled
    }
    
    // Create PDF using special fonts for Turkish character support
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16 // veya 'smart'
    });
    
    // Use Unicode supported font instead of default Helvetica
    doc.addFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(11);
    doc.text(`Export Date: ${date}`, 14, 30);
    
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
    
    // Insert table into PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [44, 62, 80],
        lineWidth: 0.25,
        font: 'Roboto',
        fontStyle: 'normal'
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
      margin: { top: 40 },
      didDrawCell: (data) => {
      },
      willDrawCell: (data) => {
        doc.setFont('Roboto');
      }
    });
    
    // Download PDF
    doc.save(`${title.replace(/\s+/g, '_')}_${date.replace(/\//g, '-')}.pdf`);
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