import React from "react";
import { useNavigate } from "react-router-dom";

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
      <h2>Hae säveltäjän mukaan</h2>
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
