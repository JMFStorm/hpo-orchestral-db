import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AutocompleteFetch from "./AutocompleteFetch";
import { fetchAllComposersByKeyword } from "../api/request";
import Language from "../lang/Language.jsx";

const alphabeticals = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "å",
  "ä",
  "ö",
];

const Composers = () => {
  const navigate = useNavigate();
  const { lng } = Language();

  const [selectedComposer, setSelectedComposer] = useState(null);

  const navigateByComposerLetter = async (letter) => {
    let lettersStr = [letter];
    if (letter.toLowerCase() === "s") {
      lettersStr.push("š");
    }
    if (letter.toLowerCase() === "z") {
      lettersStr.push("ž");
    }
    navigate(`/composers/startingletter/${lettersStr}`);
  };

  return (
    <>
      <h2>Hae säveltäjää nimellä</h2>
      <div>
        <AutocompleteFetch
          name="composer"
          label={lng("search_composer")}
          value={selectedComposer}
          setValue={setSelectedComposer}
          asyncRequest={fetchAllComposersByKeyword}
          customOnChange={(event, newValue) => {
            navigate(`/composer/${newValue.id}`);
          }}
        />
      </div>
      <h2>Hae säveltäjää alkukirjaimella</h2>
      <ul>
        {alphabeticals.map((x) => (
          <li key={x}>
            <button onClick={() => navigateByComposerLetter(x)}>{x}</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Composers;
