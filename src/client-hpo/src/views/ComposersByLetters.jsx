import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import GetBackButton from "./GetBackButton";
import { fetchComposersByStartingLetters } from "../api/request";

const ComposersByLetters = () => {
  const params = useParams();
  let navigate = useNavigate();
  const [composers, setComposers] = useState([]);

  let lettersArr = useMemo(() => params.letters ?? undefined, [params.letters]);

  useEffect(() => {
    const getComposers = async () => {
      if (lettersArr) {
        const { result, error } = await fetchComposersByStartingLetters(lettersArr);
        if (result) {
          setComposers(result);
        }
      }
    };
    getComposers();
  }, [lettersArr]);

  return (
    <>
      <GetBackButton path={"/composers"} />
      <ul>
        {composers.map((x) => (
          <li key={x.id}>
            <span to={`/symphonies/composerid/${x.id}`}>{x.name}</span>
            <button onClick={() => navigate(`/symphonies/composerid/${x.id}`)}>Teokset</button>
            <button onClick={() => navigate(`/premieres/composerid/${x.id}`)}>Ensiesitykset</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ComposersByLetters;
