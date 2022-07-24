import React from "react";
import { Link } from "react-router-dom";

import Language from "../lang/Language.jsx";

const Header = () => {
  const { lng } = Language();

  return (
    <header>
      <h1>{lng("header_1")}</h1>
      <Link to="/home">Etusivu</Link> <Link to="/composers">{lng("search_by_composer")}</Link>{" "}
      <Link to="/admin">Admin</Link>
    </header>
  );
};

export default Header;
