import React, { useEffect, useReducer, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import "../styles/app.css";
import { languageReducer } from "../lang/languageReducer";
import LanguageContext from "../lang/languageContext";

import Header from "./Header";
import HomePage from "./HomePage";
import Admin from "./Admin";
import Composers from "./Composers";
import ComposersByLetters from "./ComposersByLetters";
import SymphoniesByComposer from "./SymphoniesByComposer";
import ConcertsBySymphony from "./ConcertsBySymphony";

const App = () => {
  const [language, setLanguage] = useState("fi");
  const [appLanguage, dispatchLanguage] = useReducer(languageReducer, null);

  useEffect(() => {
    dispatchLanguage({ type: "SET_LANGUAGE", payload: { language: language } });
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main>
      {appLanguage && (
        <LanguageContext.Provider value={appLanguage}>
          <HashRouter>
            <Header />
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/composers" element={<Composers />} />
              <Route path="/composers/startingletter/:letters" element={<ComposersByLetters />} />
              <Route path="/symphonies/composerid/:composerid" element={<SymphoniesByComposer />} />
              <Route path="/concerts/symphonyid/:symphonyid" element={<ConcertsBySymphony />} />
            </Routes>
          </HashRouter>
        </LanguageContext.Provider>
      )}
    </main>
  );
};

export default App;
