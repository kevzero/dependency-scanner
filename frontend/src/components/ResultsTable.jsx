import React from 'react';

function ResultsTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Package</th>
          <th>Version</th>
        </tr>
      </thead>
      <tbody>
        {data.map((pkg, idx) => (
          <tr key={idx}>
            <td>{pkg.name}</td>
            <td>{pkg.version}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ResultsTable;
