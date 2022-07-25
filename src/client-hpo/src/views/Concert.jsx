import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import Language from "../lang/Language";
import GetBackButton from "./GetBackButton";
import { fetchConcertById } from "../api/request";

const Concert = () => {
  const params = useParams();
  const { lng } = Language();
  const [concert, setConcert] = useState(undefined);

  let concertId = useMemo(() => params.concertid ?? undefined, [params.concertid]);

  useEffect(() => {
    const getConcert = async () => {
      if (concertId) {
        const { result, error } = await fetchConcertById(concertId);
        if (result) {
          console.log("result", result);
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
            {concert.performances.map((perf) => {
              return (
                <>
                  <div>
                    {perf.symphony.composers?.map((comp, index) => {
                      let textValue = "";
                      if (index !== 0) {
                        textValue = textValue.concat(" / ");
                      }
                      textValue = textValue.concat(comp.name);
                      return <span>{textValue}</span>;
                    })}
                  </div>
                  <div>
                    {perf.symphony.name}{" "}
                    {perf.symphony.arrangers && (
                      <span key={perf.symphony.arrangers.id}>({perf.symphony.arrangers.names})</span>
                    )}
                    {perf.premiere_tag && (
                      <span key={perf.premiere_tag.id}>({lng("premiere_tag." + perf.premiere_tag.name)})</span>
                    )}
                  </div>
                  <div>
                    {perf.soloist_performances?.map((soloPerf, index) => {
                      let textValue = index === 0 ? "Solistit: " : "";
                      if (index !== 0) {
                        textValue = textValue.concat(", ");
                      }
                      textValue = textValue.concat(`${soloPerf.soloist.name} (${soloPerf.instrument.name})`);
                      return <span>{textValue}</span>;
                    })}
                  </div>
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
