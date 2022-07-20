import React, { useEffect } from "react";

import UploadCsv from "./UploadCsv";
import "../styles/app.css";
import { fetchAllComposers } from "../api/request";

const App = () => {
  useEffect(() => {
    async function fetchEffect() {
      console.log("composers", await fetchAllComposers());
    }
    fetchEffect();
  }, []);

  return (
    <div>
      <h1>Hello world</h1>
      <UploadCsv />
    </div>
  );
};

export default App;
