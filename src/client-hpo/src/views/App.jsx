import React, { useEffect, useReducer, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import "../styles/app.css";
import { languageReducer } from "../lang/languageReducer";
import LanguageContext from "../lang/languageContext";

import Header from "./Header";
import HomePage from "./HomePage";
import Admin from "./Admin";
import Concerts from "./Concerts";
import Composers from "./Composers";
import Composer from "./Composer";
import ComposersByLetters from "./ComposersByLetters";
import SymphoniesByComposer from "./SymphoniesByComposer";
import PremieresByComposer from "./PremieresByComposer";
import ConcertsBySymphony from "./ConcertsBySymphony";
import Concert from "./Concert";

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
            <Header setLanguage={setLanguage} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/composers" element={<Composers />} />
              <Route path="/composers/startingletter/:letters" element={<ComposersByLetters />} />
              <Route path="/composer/:composerid" element={<Composer />} />
              <Route path="/symphonies/composerid/:composerid" element={<SymphoniesByComposer />} />
              <Route path="/premieres/composerid/:composerid" element={<PremieresByComposer />} />
              <Route path="/concerts/symphonyid/:symphonyid" element={<ConcertsBySymphony />} />
              <Route path="/concert/concertid/:concertid" element={<Concert />} />
              <Route path="/concerts" element={<Concerts />} />
            </Routes>
          </HashRouter>
        </LanguageContext.Provider>
      )}
    </main>
  );
};

export default App;
