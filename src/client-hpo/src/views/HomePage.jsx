import React from "react";

import Language from "../lang/Language.jsx";

const HomePage = () => {
  const { lng } = Language();

  return (
    <header>
      <h1>Kotisivu_text</h1>
    </header>
  );
};

export default HomePage;
