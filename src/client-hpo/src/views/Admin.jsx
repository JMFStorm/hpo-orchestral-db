import React, { useState } from "react";

import { parseCsv } from "../utils.js/csvParse";
import { uploadCsvData } from "../api/request";

import UploadErrors from "./UploadErrors";

const Admin = () => {
  const [fileData, setFileData] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

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
  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    parseCsv(inputFile, parseCallback);
  };
  const onFileUpload = async () => {
    setUploadErrors([]);
    const { error } = await uploadCsvData(fileData);
    if (error) {
      setUploadErrors(error.errors);
    }
  };
  return (
    <>
      <div>
        <input type="file" onChange={(e) => onFileChange(e)} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      <UploadErrors uploadErrors={uploadErrors} />
    </>
  );
};

export default Admin;
