import api from './api';

const generateReport = async (reportOptions) => {
  try {
    // The response should be a blob or file for download
    const response = await api.post('/reports/generate', reportOptions, {
      responseType: 'blob', // Important for file downloads
    });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Suggest a filename based on report type and date
    const extension = reportOptions.reportType === 'pdf' ? 'pdf' : 'xlsx';
    const fileName = `report_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    link.setAttribute('download', fileName);
    
    // Append to html link element page
    document.body.appendChild(link);
    
    // Start download
    link.click();
    
    // Clean up and remove the link
    link.parentNode.removeChild(link);
    
    return { success: true };
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const reportService = {
  generateReport,
};
