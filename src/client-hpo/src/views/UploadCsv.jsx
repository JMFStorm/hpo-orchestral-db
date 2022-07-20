import React, { useState } from "react";
import Papa from "papaparse";

import {} from "../api/request";

const App = () => {
  const [file, setFile] = useState([]);
  const [data, setData] = useState([]);

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    setFile(inputFile);
  };

  const onFileUpload = () => {
    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setData(columns);
      console.log("data", data);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div>
        <input type="file" onChange={(e) => onFileChange(e)} />
        <button onClick={onFileUpload}>Upload!</button>
        {data.length > 0 && <div>CSV LOADED!</div>}
      </div>
    </div>
  );
};

export default App;
