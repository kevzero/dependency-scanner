import React from 'react';

function Upload({ onFileSelect }) {
  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) onFileSelect(file);
  };

  return <input type="file" onChange={handleChange} />;
}

export default Upload;
