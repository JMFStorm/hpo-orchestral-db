import React from "react";
import { Link } from "react-router-dom";

import Language from "../lang/Language.jsx";

const Header = () => {
  const { lng } = Language();

  const text1 = lng("header1");

  return (
    <header>
      <h1>{text1}</h1>
      <Link to="/home">Etusivu</Link>
      <Link to="/composers">Säveltäjät</Link>
      <Link to="/admin">Admin</Link>
    </header>
  );
};

export default Header;
