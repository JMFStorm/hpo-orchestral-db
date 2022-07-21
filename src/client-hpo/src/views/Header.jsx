import React from "react";

import Language from "../lang/Language.jsx";

const Header = ({ setLanguage }) => {
  const { lng } = Language();

  const switchLanguageHandle = (language) => {
    setLanguage(language);
  };

  const text1 = lng("hello_world");

  return (
    <header>
      <h1>{text1}</h1>
      <div>
        <button onClick={() => switchLanguageHandle("en")}>English</button>
        <button onClick={() => switchLanguageHandle("fi")}>Suomi</button>
      </div>
    </header>
  );
};

export default Header;
