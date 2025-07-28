function ResultsTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Pacchetto</th>
          <th>Versione</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            <td>{item.name}</td>
            <td>{item.version}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
