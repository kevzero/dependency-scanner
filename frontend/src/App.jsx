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
      alert("Please select a file before scanning!");
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
      a.download = 'dependency_report.pdf';
      a.click();
    } catch (err) {
      setStatusMsg('❌ Error generating PDF.');
    }
  };

  return (
    <div className="container">
      <h1>Dependency Analyzer</h1>
      <p className="subtitle">Upload a file, choose the language, and scan its content.</p>

      <div className="button-group">
        <button className={language === 'python' ? 'active' : ''} onClick={() => setLanguage('python')}>Python</button>
        <button className={language === 'node' ? 'active' : ''} onClick={() => setLanguage('node')}>Node.js</button>
      </div>

      <Upload onFileSelect={setFile} />
      <button className="primary" onClick={handleScan}>Scan File</button>

      {loading && <p>Scanning...</p>}
      {statusMsg && <p style={{ textAlign: 'center' }}>{statusMsg}</p>}

      {!loading && results && (
        <>
          <h3>File: {results.analyzed_file}</h3>
          <p>Language: {results.language} | Date: {results.date}</p>
          {results.packages.length > 0 ? (
            <>
              <ResultsTable data={results.packages} />
              <button className="primary" style={{ background: '#636e72' }} onClick={downloadPDF}>
                Download Report PDF
              </button>
            </>
          ) : (
            <p>No packages found in the file.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
