import React, { useState } from 'react';
import Upload from './components/Upload';
import './styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [language, setLanguage] = useState('python');

  const handleScan = async () => {
    if (!file) {
      alert("⚠ Please select a file before scanning!");
      return;
    }

    setStatusMsg('');
    setLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const endpoint = language === 'python' ? '/scan/python' : '/scan/node';

      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setStatusMsg(`❌ ${data.error}`);
        setResults(null);
        setLoading(false);
        return;
      }

      setResults(data);
      setStatusMsg('✅ Scan completed.');
    } catch (err) {
      setStatusMsg('❌ Error during scanning.');
    }

    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!results) {
      alert("Please scan a file first!");
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analysis_report.pdf';
      a.click();
    } catch (err) {
      setStatusMsg('❌ Error generating PDF.');
    }
  };

  const resetAll = () => {
    setFile(null);
    setResults(null);
    setStatusMsg('');
    setLanguage('python');

    // Reset input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="container">
      <h1>Dependency Analyzer</h1>
      <p className="subtitle">Upload a file, choose the language, and scan its content.</p>

      {/* Language Switch */}
      <div className="button-group">
        <button className={`switch-btn ${language === 'python' ? 'active' : ''}`} onClick={() => setLanguage('python')}>Python</button>
        <button className={`switch-btn ${language === 'node' ? 'active' : ''}`} onClick={() => setLanguage('node')}>Node.js</button>
      </div>

      {/* File Upload */}
      <Upload onFileSelect={setFile} />

      {/* Scan Button */}
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button className="primary" onClick={handleScan}>Scan File</button>
      </div>

      {/* Reset Button */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button className="secondary full-width" onClick={resetAll}>Reset</button>
      </div>

      {/* Loading & Status */}
      {loading && <p style={{ textAlign: 'center', marginTop: '15px' }}>Scanning...</p>}
      {statusMsg && <p style={{ textAlign: 'center', marginTop: '15px' }}>{statusMsg}</p>}

      {/* Results */}
      {!loading && results && (
        <>
          <h3>File: {results.analyzed_file}</h3>
          <p><strong>Language:</strong> {results.language} | <strong>Date:</strong> {results.date}</p>
          <p><strong>Total Lines:</strong> {results.total_lines} | <strong>Comments:</strong> {results.comments}</p>
          <p><strong>Functions:</strong> {results.functions.length > 0 ? results.functions.join(', ') : 'None'}</p>
          <p><strong>Classes:</strong> {results.classes.length > 0 ? results.classes.join(', ') : 'None'}</p>
          <p><strong>Imports:</strong> {results.imports.length > 0 ? results.imports.join(', ') : 'None'}</p>
          <p><strong>Data Types:</strong> {results.data_types.length > 0 ? results.data_types.join(', ') : 'None'}</p>
          <p><strong>Keyword Count:</strong> {results.keyword_count}</p>

          {/* PDF Download */}
          <button className="primary" style={{ background: '#636e72', marginTop: '20px' }} onClick={downloadPDF}>
            Download Detailed PDF Report
          </button>
        </>
      )}
    </div>
  );
}

export default App;
