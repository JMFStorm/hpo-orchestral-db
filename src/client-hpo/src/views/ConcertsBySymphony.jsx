import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import GetBackButton from "./GetBackButton";
import { fetchConcertsBySymphonyId } from "../api/request";

const ConcertsBySymphony = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [concerts, setConcerts] = useState([]);
  let symphonyId = useMemo(() => params.symphonyid ?? undefined, [params.symphonyid]);

  useEffect(() => {
    const getConcerts = async () => {
      if (symphonyId) {
        const { result, error } = await fetchConcertsBySymphonyId(symphonyId);
        if (result) {
          console.log("result", result);
          setConcerts(result);
        }
      }
    };
    getConcerts();
  }, [symphonyId]);

  return (
    <>
      <GetBackButton />
      <ul>
        {concerts.map((x) => {
          let conductorsText = "";
          if (x.conductors) {
            x.conductors.forEach((x, index) => {
              if (index !== 0) {
                conductorsText = conductorsText.concat(" / ");
              }
              conductorsText = conductorsText.concat(`${x.name}`);
            });
          }
          return (
            <li key={x.id}>
              <span>{x.date} </span>
              <span>{x.concert_tag?.name} </span>
              <span>{conductorsText} </span>
              <button onClick={() => navigate(`/concert/concertid/${x.id}`)}>Avaa</button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ConcertsBySymphony;
