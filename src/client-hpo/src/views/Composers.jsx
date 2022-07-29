import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

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

  const [autocompleteInput, setAutocompleteInput] = useState("");
  const [debounceId, setDebounceId] = useState(undefined);
  const [composersResult, setComposersResult] = useState([]);

  const fetchRequest = async (id) => {
    clearInterval(id);
    setDebounceId(undefined);
    if (autocompleteInput) {
      const { result } = await fetchAllComposersByKeyword(autocompleteInput);
      console.log("result", result);
      setComposersResult(result);
    }
  };

  useEffect(() => {
    if (autocompleteInput) {
      const setTimer = () => {
        const second = 1000;
        const newTimerId = setInterval(() => fetchRequest(newTimerId), second);
        setDebounceId(newTimerId);
      };
      if (!debounceId) {
        setTimer();
      } else if (debounceId) {
        clearInterval(debounceId);
        setTimer();
      }
    }
  }, [autocompleteInput]);

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

  const composersList = useMemo(() => {
    if (!composersResult) {
      return [];
    }
    return composersResult.map((comp) => {
      return { label: comp.name, id: comp.id };
    });
  }, [composersResult]);

  return (
    <>
      <h2>Hae säveltäjää nimellä</h2>
      <div>
        <Autocomplete
          disablePortal
          filterOptions={(x) => x}
          id="composers-autocomplete"
          options={composersList}
          renderInput={(params) => <TextField {...params} label={lng("search_name")} />}
          onChange={(event, newValue) => {}}
          onInputChange={(event, newInputValue) => {
            setAutocompleteInput(newInputValue);
          }}
        />
      </div>
      <h2>Hae säveltäjää aakkosten mukaan</h2>
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
