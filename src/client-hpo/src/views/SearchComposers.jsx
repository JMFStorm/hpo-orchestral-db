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
          <li key={x.id}>
            {x.name}
            <button onClick={() => searchComposerSymphonies(x.id)}>Hae teokset</button>
          </li>
        ))}
      </ul>
      <ul>
        {symphonies.map((x) => (
          <li key={x.id}>
            {x.name}, {x.concertsCount} konserttia
            <button onClick={() => searchSymphonyConcerts(x.id)}>Hae konsertit</button>
          </li>
        ))}
      </ul>
      <ul>
        {concerts.map((x) => (
          <li key={x.id}>
            {x.date}
            {". "}
            {x.conductors.map((x) => (
              <span key={x.id}>{x.name}. </span>
            ))}{" "}
            {x.concert_tag?.name}
            <button onClick={() => searchConcertById(x.id)}>Tutki konserttia</button>
          </li>
        ))}
      </ul>
      {selectedConcert && (
        <div>
          <span>
            {selectedConcert.date}, {selectedConcert.starting_time}
          </span>
          <div>{selectedConcert.concert_tag.name}</div>
          {selectedConcert.conductors.map((x) => (
            <span key={x.id}>{selectedConcert.name} </span>
          ))}
          <span>
            {selectedConcert.location?.name}, {selectedConcert.orchestra?.name}
          </span>
          <ul>
            {selectedConcert.performances
              .sort((a, b) => a.order - b.order)
              .map((x) => (
                <li key={x.id}>
                  <span>
                    Symphony: {x.order}. {x.symphony.name}. {x.premiere_tag}{" "}
                  </span>
                  {x.symphony.composers?.map((x) => (
                    <span key={x.id}>Composer: {x.name}. </span>
                  ))}
                  {x.soloist_performances?.map((x) => (
                    <span key={x.id}>
                      Soloist: {x.soloist.name} ({x.instrument.name}){" "}
                    </span>
                  ))}
                </li>
              ))}
          </ul>
          <div>{selectedConcert.footnote}</div>
          <div>{selectedConcert.archive_info}</div>
        </div>
      )}
    </>
  );
};

export default SearchComposers;
