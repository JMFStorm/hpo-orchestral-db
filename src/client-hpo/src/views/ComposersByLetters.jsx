import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

import Language from "../lang/Language.jsx";
import GetBackButton from "./GetBackButton";
import { fetchComposersByStartingLetters } from "../api/request";

const ComposersByLetters = () => {
  const params = useParams();
  let navigate = useNavigate();
  const { lng } = Language();
  const [composersResponse, setComposersResponse] = useState([]);
  const [nameInput, setNameInput] = useState("");

  let lettersArr = useMemo(() => params.letters ?? undefined, [params.letters]);

  useEffect(() => {
    const getComposers = async () => {
      if (lettersArr) {
        const { result, error } = await fetchComposersByStartingLetters(lettersArr);
        if (result) {
          console.log("result", result);
          setComposersResponse(result);
        }
      }
    };
    getComposers();
  }, [lettersArr]);

  const changeNameHandle = (event) => {
    setNameInput(() => event.target.value);
  };

  return (
    <>
      <GetBackButton path={"/composers"} />
      <div>
        <div>
          <TextField label={lng("search_name")} variant="standard" onChange={(event) => changeNameHandle(event)} />
        </div>
      </div>
      <ul>
        {composersResponse
          .filter((comp) => comp.name.toLowerCase().includes(nameInput.toLowerCase()))
          .map((x) => (
            <li key={x.id}>
              <span to={`/symphonies/composerid/${x.id}`}>{x.name} </span>
              <button onClick={() => navigate(`/symphonies/composerid/${x.id}`)}>
                Hae teokset ({x.symphoniesCount})
              </button>
              {x.premieresCount > 0 && (
                <button onClick={() => navigate(`/premieres/composerid/${x.id}`)}>
                  Hae kantaesitykset ({x.premieresCount})
                </button>
              )}
            </li>
          ))}
      </ul>
    </>
  );
};

export default ComposersByLetters;
