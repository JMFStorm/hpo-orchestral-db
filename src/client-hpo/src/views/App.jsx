import React, { useEffect, useReducer, useState } from "react";

import "../styles/app.css";
import { fetchAllComposers } from "../api/request";
import { languageReducer } from "../lang/languageReducer";
import LanguageContext from "../lang/languageContext";

import Header from "./Header";
import UploadCsv from "./UploadCsv";

const App = () => {
  const [language, setLanguage] = useState("en");
  const [appLanguage, dispatchLanguage] = useReducer(languageReducer, null);

  useEffect(() => {
    dispatchLanguage({ type: "SET_LANGUAGE", payload: { language: language } });
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    async function fetchEffect() {
      console.log("composers", await fetchAllComposers());
    }
    fetchEffect();
  }, []);

  return (
    <main>
      {appLanguage && (
        <LanguageContext.Provider value={appLanguage}>
          <Header language={language} setLanguage={setLanguage} />
          <UploadCsv />
        </LanguageContext.Provider>
      )}
    </main>
  );
};

export default App;
