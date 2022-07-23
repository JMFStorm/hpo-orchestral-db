import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import GetBackButton from "./GetBackButton";
import { fetchComposersByStartingLetters } from "../api/request";

const ComposersByLetters = () => {
  const params = useParams();
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
            <Link to={`/symphonies/composerid/${x.id}`}>{x.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ComposersByLetters;
