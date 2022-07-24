import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import GetBackButton from "./GetBackButton";
import { fetchConcertById } from "../api/request";

const Concert = () => {
  const params = useParams();
  const [concert, setConcert] = useState(undefined);

  let concertId = useMemo(() => params.concertid ?? undefined, [params.concertid]);

  useEffect(() => {
    const getConcert = async () => {
      if (concertId) {
        const { result, error } = await fetchConcertById(concertId);
        if (result) {
          setConcert(result);
        }
      }
    };
    getConcert();
  }, [concertId]);

  return (
    <div>
      <GetBackButton />
      {concert && (
        <>
          <div>
            <span>
              {concert.date} {concert.starting_time}
            </span>
          </div>
          <br />
          <div>
            <span>
              {concert.concert_tag?.name}, {concert.footnote}
            </span>
          </div>
          <div>{concert.location?.name}</div>
          <div>{concert.orchestra?.name}</div>
          <br />
          <div>Kapellimestarit</div>
          <div>
            {concert.conductors?.map((x, index) => {
              let textValue = "";
              if (index !== 0) {
                textValue.concat(" / ");
              }
              textValue = textValue.concat(x.name);
              return <span>{textValue}</span>;
            })}
          </div>
          <br />
          <div>
            {concert.performances.map((x) => {
              return (
                <>
                  <div>
                    {x.symphony.composers?.map((x, index) => {
                      let textValue = "";
                      if (index !== 0) {
                        textValue.concat(" / ");
                      }
                      textValue = textValue.concat(x.name);
                      return <span>{textValue}</span>;
                    })}
                  </div>
                  <div>{x.symphony.name}</div>
                  <br />
                </>
              );
            })}
          </div>
          <br />
          <div>
            <div>Lähdetieto:</div>
            <div>{concert.archive_info}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Concert;
