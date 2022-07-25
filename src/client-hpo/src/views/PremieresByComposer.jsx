import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Language from "../lang/Language.jsx";
import GetBackButton from "./GetBackButton";
import { fetchPremieresByComposer } from "../api/request";

const PremieresByComposer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { lng } = Language();
  const [performances, setPerformances] = useState([]);

  let composerId = useMemo(() => params.composerid ?? undefined, [params.composerid]);

  useEffect(() => {
    const getPremieres = async () => {
      if (composerId) {
        const { result, error } = await fetchPremieresByComposer(composerId);
        if (result) {
          console.log("fetchPremieresByComposer", result);
          setPerformances(result);
        }
      }
    };
    getPremieres();
  }, [composerId]);

  return (
    <>
      <GetBackButton />
      <ul>
        {performances.map((x) => (
          <li key={x.id}>
            <span>{x.concert.date} </span>
            <span>{x.concert.concert_tag?.name}, </span>
            <span>{x.symphony.name} </span>
            <span>{"(" + lng("premiere_tag." + x.premiere_tag.name) + ")"} </span>
            <button onClick={() => navigate(`/concert/concertid/${x.concert.id}`)}>Avaa</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PremieresByComposer;
