import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import arabic from '@arabic-tools/arabic-utils';

export const pdfService = {
  async generateTransactionPDF(transaction, signatures, comments) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add Arabic font
    doc.addFont('path/to/arabic-font.ttf', 'Arabic', 'normal');
    doc.setFont('Arabic');
    
    // Add header
    doc.setFontSize(24);
    doc.text(arabic.reshape('نظام المعاملات الإلكترونية'), 105, 20, { align: 'center' });
    
    // Add transaction details
    doc.setFontSize(14);
    doc.text(arabic.reshape('تفاصيل المعاملة'), 190, 40, { align: 'right' });
    doc.setFontSize(12);
    
    const details = [
      ['العنوان', transaction.title],
      ['الوصف', transaction.description],
      ['مستوى الأهمية', transaction.importance],
      ['الحالة', transaction.status],
      ['تاريخ الإنشاء', new Date(transaction.createdAt).toLocaleDateString('ar-SY')]
    ];

    doc.autoTable({
      startY: 50,
      head: [],
      body: details,
      theme: 'plain',
      styles: {
        font: 'Arabic',
        halign: 'right'
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 100 }
      }
    });

    // Add signatures section
    if (signatures?.length) {
      doc.text(arabic.reshape('التوقيعات'), 190, doc.lastAutoTable.finalY + 20, { align: 'right' });
      
      const signatureData = signatures.map(sig => [
        sig.name,
        sig.role,
        new Date(sig.timestamp).toLocaleDateString('ar-SY')
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 30,
        head: [['الاسم', 'المنصب', 'التاريخ']],
        body: signatureData,
        theme: 'grid',
        styles: {
          font: 'Arabic',
          halign: 'right'
        }
      });
    }

    // Add comments section
    if (comments?.length) {
      doc.text(arabic.reshape('التعليقات'), 190, doc.lastAutoTable.finalY + 20, { align: 'right' });
      
      const commentData = comments.map(comment => [
        comment.author,
        comment.text,
        new Date(comment.timestamp).toLocaleDateString('ar-SY')
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 30,
        head: [['الكاتب', 'التعليق', 'التاريخ']],
        body: commentData,
        theme: 'grid',
        styles: {
          font: 'Arabic',
          halign: 'right'
        }
      });
    }

    // Add footer with timestamp and document ID
    const footer = `Document ID: ${transaction.id} | Generated: ${new Date().toLocaleString('ar-SY')}`;
    doc.setFontSize(8);
    doc.text(footer, 105, 285, { align: 'center' });

    return doc;
  },

  async encryptPDF(pdfDoc, password) {
    return pdfDoc.output('datauristring', {
      encryption: {
        userPassword: password,
        ownerPassword: password,
        userPermissions: ['print', 'modify', 'copy']
      }
    });
  },

  preventScreenCapture() {
    // Add screen capture prevention
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && 
         (e.key === 'p' || 
          e.key === 's' || 
          e.key === 'c' || 
          e.key === 'x' || 
          e.key === 'i')) {
        e.preventDefault();
      }
    });

    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable drag and select
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
  }
};