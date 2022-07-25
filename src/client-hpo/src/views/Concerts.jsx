import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchConcertsCombinationSearch } from "../api/request";

const Concerts = () => {
  const navigate = useNavigate();
  const [searchParamsQuery, setSearchParamsQuery] = useSearchParams();
  const [namesInput, setNamesInput] = useState({ composer: "", soloist: "", conductor: "" });
  const [concerts, setConcerts] = useState([]);

  const changeNameHandle = (event) => {
    setNamesInput((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const fetchConcertsRequest = async (conductor, composer, soloist) => {
    console.log("searchParams", conductor, composer, soloist);
    const { result, error } = await fetchConcertsCombinationSearch(conductor, composer, soloist);
    if (result) {
      setConcerts(result);
      console.log("result", result);
    }
  };

  const searchConcerts = async () => {
    const searchParams = {
      conductor: namesInput.conductor.trim(),
      composer: namesInput.composer.trim(),
      soloist: namesInput.soloist.trim(),
    };
    setSearchParamsQuery(searchParams);
    await fetchConcertsRequest(searchParams.conductor, searchParams.composer, searchParams.soloist);
  };

  useEffect(() => {
    const searchAtStart = async () => {
      const comp = searchParamsQuery.get("composer") ?? "";
      const cond = searchParamsQuery.get("conductor") ?? "";
      const solo = searchParamsQuery.get("soloist") ?? "";

      setNamesInput({
        composer: comp,
        conductor: cond,
        soloist: solo,
      });
      if (comp || cond || solo) {
        await fetchConcertsRequest(cond, comp, solo);
      }
    };
    searchAtStart();
  }, [searchParamsQuery]);

  return (
    <>
      <h2>Hae konsertteja</h2>
      <div>
        <label htmlFor="conductor">Kapellimestari</label>
        <input
          name="conductor"
          type="text"
          value={namesInput.conductor}
          onChange={(event) => changeNameHandle(event)}
        />
      </div>
      <div>
        <label htmlFor="composer">Säveltäjä</label>
        <input name="composer" type="text" value={namesInput.composer} onChange={(event) => changeNameHandle(event)} />
      </div>
      <div>
        <label htmlFor="soloist">Solisti</label>
        <input name="soloist" type="text" value={namesInput.soloist} onChange={(event) => changeNameHandle(event)} />
      </div>
      <button onClick={() => setNamesInput({ composer: "", soloist: "", conductor: "" })}>Tyhjennä</button>
      <button onClick={searchConcerts}>Hae</button>
      {concerts.length == 0 && <div>Rajaa hakua hakukentillä</div>}
      {concerts.length > 0 && (
        <ul>
          {concerts.map((conc) => {
            let conductorsText = " ";
            if (conc.conductors) {
              conc.conductors.forEach((cond, index) => {
                if (index !== 0) {
                  conductorsText = conductorsText.concat(" / ");
                }
                conductorsText = conductorsText.concat(`${cond.name}`);
              });
            }
            return (
              <li key={conc.concert_id}>
                <span>
                  {conc.date} {conc.concert_tag?.name}
                  {conductorsText}
                </span>
                <button onClick={() => navigate(`/concert/concertid/${conc.id}`)}>Avaa</button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Concerts;
