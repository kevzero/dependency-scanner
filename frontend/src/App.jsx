import React, { useState } from 'react';
import Upload from './components/Upload';
import ResultsTable from './components/ResultsTable';
import './styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [language, setLanguage] = useState('python');

  const handleScan = async () => {
    if (!file) {
      alert("⚠ Seleziona un file prima di avviare la scansione!");
      return;
    }
    setStatusMsg('');
    setLoading(true);
    setResults([]);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const endpoint = language === 'python' ? '/scan/python' : '/scan/node';
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.vulnerabilities && data.vulnerabilities.length > 0) {
        setResults(data.vulnerabilities);
        setStatusMsg('✅ Analisi completata: vulnerabilità trovate.');
      } else {
        setResults([]);
        setStatusMsg('✅ Nessuna vulnerabilità trovata.');
      }
    } catch (err) {
      setStatusMsg('❌ Errore durante la scansione.');
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    try {
      const res = await fetch('http://localhost:8000/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vulnerabilities: results }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'security_report.pdf';
      a.click();
      setStatusMsg('✅ PDF pronto per il download (scegli dove salvare).');
    } catch (err) {
      setStatusMsg('❌ Errore durante la generazione del PDF.');
    }
  };

  return (
    <div className="container">
      <h1>Dependency Scanner PRO</h1>
      <p className="subtitle">Carica un file, seleziona il linguaggio e avvia la scansione.</p>

      {/* Switch linguaggio */}
      <div className="button-group">
        <button className={language === 'python' ? 'active' : ''} onClick={() => setLanguage('python')}>Python</button>
        <button className={language === 'node' ? 'active' : ''} onClick={() => setLanguage('node')}>Node.js</button>
      </div>

      {/* Upload file */}
      <Upload onFileSelect={setFile} />

      {/* Bottone Scan */}
      <button className="primary" onClick={handleScan}>Scan Dependencies</button>

      {/* Loader */}
      {loading && (
        <div className="loader">
          <div></div><div></div><div></div>
        </div>
      )}

      {/* Stato */}
      {statusMsg && <p style={{ textAlign: 'center', marginTop: '15px', color: '#2d3436' }}>{statusMsg}</p>}

      {/* Risultati */}
      {!loading && results.length > 0 && (
        <>
          <ResultsTable data={results} />
          <button className="primary" style={{ background: '#636e72' }} onClick={downloadPDF}>
            Scarica Report PDF
          </button>
        </>
      )}

      {/* Nessuna vulnerabilità */}
      {!loading && results.length === 0 && statusMsg.includes('Nessuna') && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="primary" style={{ background: '#636e72' }} onClick={downloadPDF}>
            Scarica Report PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
