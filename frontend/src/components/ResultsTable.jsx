import React from 'react';

function ResultsTable({ data }) {
  const getClass = (severity) => {
    if (!severity) return '';
    const s = severity.toLowerCase();
    if (s.includes('critical')) return 'severity-critical';
    if (s.includes('high')) return 'severity-high';
    if (s.includes('medium')) return 'severity-medium';
    if (s.includes('low')) return 'severity-low';
    return '';
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Package</th><th>Version</th><th>CVE</th><th>Severity</th><th>Fix</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            <td>{item.name}</td>
            <td>{item.version}</td>
            <td>{item.id}</td>
            <td className={getClass(item.severity)}>{item.severity}</td>
            <td>{item.fix_versions?.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ResultsTable;
