import React, { useState } from "react";
import Papa from "papaparse";

import { uploadCsvData } from "../api/request";

const App = () => {
  const [fileData, setFileData] = useState([]);

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];

    const parseCallback = (results) => {
      if (results.errors) {
        results.errors.forEach((err) => {
          if (results.data && err.row === results.data.length - 1) {
            // Slice last row off
            results.data = results.data.slice(0, results.data.length - 1);
          } else if (results.data && err.row !== results.data.length - 1) {
            console.error("Csv reader error:", err);
          }
        });
      }
      if (results.data) {
        setFileData(results.data);
      }
    };

    Papa.parse(inputFile, {
      header: true,
      complete: parseCallback,
    });
  };

  const onFileUpload = async () => {
    await uploadCsvData(fileData);
  };

  return (
    <div>
      <div>
        <input type="file" onChange={(e) => onFileChange(e)} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
    </div>
  );
};

export default App;
