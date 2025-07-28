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
    alert("Please select a file before scanning!");
    return;
  }

  // Reset UI state
  setStatusMsg('');
  setLoading(true);
  setResults(null);

  try {
    // Prepara i dati da inviare
    const formData = new FormData();
    formData.append('file', file);

    // Endpoint in base al linguaggio selezionato
    const endpoint = language === 'python' ? '/scan/python' : '/scan/node';

    // Richiesta al backend
    const res = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    // ✅ Gestione errore dal backend (es. file sbagliato o vuoto)
    if (data.error) {
      setStatusMsg(`❌ ${data.error}`);
      setResults(null); // Non mostra nulla
      setLoading(false);
      return;
    }

    // ✅ Se tutto ok, mostra i risultati
    setResults(data);
    setStatusMsg('✅ Scan completed.');
  } catch (err) {
    // Errore di rete o server
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
      {statusMsg && <p style={{ textAlign: 'center', marginTop: '15px' }}>{statusMsg}</p>}

      {!loading && results && (
        <>
          <h3>File: {results.analyzed_file}</h3>
          <p><strong>Language:</strong> {results.language} | <strong>Date:</strong> {results.date}</p>
          <p><strong>Total Lines:</strong> {results.total_lines} | <strong>Comments:</strong> {results.comments}</p>
          <p><strong>Functions:</strong> {results.functions.length > 0 ? results.functions.join(', ') : 'None'}</p>
          <p><strong>Classes:</strong> {results.classes.length > 0 ? results.classes.join(', ') : 'None'}</p>
          <p><strong>Imports:</strong> {results.imports.length > 0 ? results.imports.join(', ') : 'None'}</p>
          <p><strong>Data Types:</strong> {results.data_types.length > 0 ? results.data_types.join(', ') : 'None'}</p>

          <button className="primary" style={{ background: '#636e72', marginTop: '20px' }} onClick={downloadPDF}>
            Download Detailed PDF Report
          </button>
        </>
      )}
    </div>
  );
}

export default App;
