import React from "react";
import { Link } from "react-router-dom";

import Language from "../lang/Language.jsx";

const Header = ({ setLanguage }) => {
  const { lng } = Language();

  return (
    <header>
      <h1>{lng("header_1")}</h1>
      <div>
        <button onClick={() => setLanguage("fi")}>FI</button>
        <button onClick={() => setLanguage("en")}>EN</button>
      </div>
      <Link to="/home">Etusivu</Link> <Link to="/composers">{lng("search_by_composer")}</Link>{" "}
      <Link to="/concerts">{lng("search_concerts")}</Link>
    </header>
  );
};

export default Header;
