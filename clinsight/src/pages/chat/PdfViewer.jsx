import React from 'react';

const PdfViewer = ({ pdfUrl }) => {
  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;