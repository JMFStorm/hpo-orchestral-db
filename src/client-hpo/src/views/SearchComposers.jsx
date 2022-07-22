import React, { useCallback, useState } from "react";

import {
  fetchAllComposers,
  fetchConcertById,
  fetchConcertsBySymphonyId,
  fetchSymphoniesByComposerId,
} from "../api/request";

const SearchComposers = () => {
  const [composers, setComposers] = useState([]);
  const [symphonies, setSymphonies] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState(undefined);

  const searchAllComposers = useCallback(async () => {
    const { result } = await fetchAllComposers();
    setComposers(result);
  }, [setComposers]);

  const searchComposerSymphonies = useCallback(
    async (composerId) => {
      const { result } = await fetchSymphoniesByComposerId(composerId);
      setSymphonies(result);
    },
    [setSymphonies]
  );

  const searchSymphonyConcerts = useCallback(
    async (symphonyId) => {
      const { result } = await fetchConcertsBySymphonyId(symphonyId);
      setConcerts(result);
    },
    [setConcerts]
  );

  const searchConcertById = useCallback(
    async (concertId) => {
      const { result } = await fetchConcertById(concertId);
      console.log("result", result);
      setSelectedConcert(result);
    },
    [setSelectedConcert]
  );

  return (
    <>
      <>
        <h2>Search all composers</h2>
        <button onClick={searchAllComposers}>Search</button>
      </>
      <ul>
        {composers.map((x) => (
          <li>
            {x.name}
            <button onClick={() => searchComposerSymphonies(x.id)}>Hae teokset</button>
          </li>
        ))}
      </ul>
      <ul>
        {symphonies.map((x) => (
          <li>
            {x.name}, {x.concertsCount} konserttia
            <button onClick={() => searchSymphonyConcerts(x.id)}>Hae konsertit</button>
          </li>
        ))}
      </ul>
      <ul>
        {concerts.map((x) => (
          <li>
            {x.date}{" "}
            {x.conductors.map((x) => (
              <span>{x.name} </span>
            ))}{" "}
            {x.concert_tag?.name}
            <button onClick={() => searchConcertById(x.id)}>Tutki konserttia</button>
          </li>
        ))}
      </ul>
      {selectedConcert && (
        <div>
          <div>
            {selectedConcert.date} {selectedConcert.starting_time}
          </div>
          <div>{selectedConcert.concert_tag.name}</div>
          {selectedConcert.conductors.map((x) => (
            <span>{selectedConcert.name} </span>
          ))}
          <div>{selectedConcert.location?.name}</div>
          <div>{selectedConcert.orchestra?.name}</div>
          {selectedConcert.performances.map((x) => (
            <div>
              <span>
                {x.symphony.name} {x.premiere_tag}
              </span>
              {x.composers?.map((x) => (
                <span>{x.name} </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchComposers;
