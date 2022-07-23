import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import GetBackButton from "./GetBackButton";
import { fetchConcertsBySymphonyId } from "../api/request";

const ConcertsBySymphony = () => {
  const params = useParams();
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
          let textContent = x.date;
          if (x.concert_tag) {
            textContent = textContent.concat(` ${x.concert_tag.name}`);
          }
          if (x.conductors) {
            textContent = textContent.concat(", ");
            x.conductors.forEach((x, index) => {
              if (index !== 0) {
                textContent = textContent.concat(" / ");
              }
              textContent = textContent.concat(`${x.name}`);
            });
          }
          return (
            <li key={x.id}>
              <Link to={`/concert/concertid/${x.id}`}>{textContent}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ConcertsBySymphony;
