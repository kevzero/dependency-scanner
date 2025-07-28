import React, { useState } from 'react';
import Upload from './components/Upload';
import ResultsTable from './components/ResultsTable';
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

      if (data.packages && data.packages.length > 0) {
        setResults(data);
        setStatusMsg('✅ Scan completed successfully.');
      } else {
        setResults(data);
        setStatusMsg('✅ Scan completed, no packages found.');
      }
    } catch (err) {
      setStatusMsg('❌ Error during scanning.');
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!results) {
      alert("⚠ Please scan a file first!");
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
      a.download = 'dependency_report.pdf';
      a.click();
      setStatusMsg('✅ PDF ready for download.');
    } catch (err) {
      setStatusMsg('❌ Error generating PDF.');
    }
  };

  return (
    <div className="container">
      <h1>Dependency Analyzer</h1>
      <p className="subtitle">Upload a file, select the language, and start scanning.</p>

      {/* Language Switch */}
      <div className="button-group">
        <button className={language === 'python' ? 'active' : ''} onClick={() => setLanguage('python')}>Python</button>
        <button className={language === 'node' ? 'active' : ''} onClick={() => setLanguage('node')}>Node.js</button>
      </div>

      {/* File Upload */}
      <Upload onFileSelect={setFile} />

      {/* Scan Button */}
      <button className="primary" onClick={handleScan}>Scan Dependencies</button>

      {/* Loader */}
      {loading && (
        <div className="loader">
          <div></div><div></div><div></div>
        </div>
      )}

      {/* Status Message */}
      {statusMsg && <p style={{ textAlign: 'center', marginTop: '15px', color: '#2d3436' }}>{statusMsg}</p>}

      {/* Scan Results */}
      {!loading && results && (
        <>
          <h3 style={{ textAlign: 'center', marginTop: '20px' }}>
            File: {results.analyzed_file} | Language: {results.language} | Date: {results.date}
          </h3>
          {results.packages && results.packages.length > 0 ? (
            <>
              <ResultsTable data={results.packages} />
              <button className="primary" style={{ background: '#636e72' }} onClick={downloadPDF}>
                Download Report PDF
              </button>
            </>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No packages found in the file.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
