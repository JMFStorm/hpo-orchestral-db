import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchConcertsCombinationSearch } from "../api/request";

const startYear = 1882;
const endYear = 2030;

const setYears = (start, end) => {
  const newYearsArray = [];
  for (let i = start; i <= end; i++) {
    newYearsArray.push(i);
  }
  return newYearsArray;
};
const yearsArray = setYears(startYear, endYear);

const sortConcertsByDate = (a, b, isDescending = false) => {
  const aDate = Date.parse(a.date);
  const bDate = Date.parse(b.date);
  if (aDate === bDate) {
    return 0;
  }
  let mult = isDescending ? -1 : 1;
  return aDate < bDate ? -1 * mult : 1 * mult;
};

const Concerts = () => {
  const navigate = useNavigate();
  const [searchParamsQuery, setSearchParamsQuery] = useSearchParams({});
  const [namesInput, setNamesInput] = useState({ composer: "", soloist: "", conductor: "" });
  const [concerts, setConcerts] = useState([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(startYear);
  const [searchResultsCriteria, setSearchResultsCriteria] = useState({});

  const changeNameHandle = (event) => {
    setNamesInput((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const fetchConcertsRequest = async (conductor, composer, soloist, startYear, chunkIndex = 0) => {
    setSearchResultsCriteria({ conductor, composer, soloist, startYear, endYear });
    const { result, error } = await fetchConcertsCombinationSearch(conductor, composer, soloist, startYear, chunkIndex);
    if (result) {
      setConcerts(result);
      console.log("result", result);
    }
  };

  const userSearchConcerts = async () => {
    const searchParams = {
      conductor: namesInput.conductor.trim(),
      composer: namesInput.composer.trim(),
      soloist: namesInput.soloist.trim(),
      start: selectedYear,
      pageindex: 0,
    };
    setChunkIndex(0);
    setSearchParamsQuery(searchParams);
    await fetchConcertsRequest(searchParams.conductor, searchParams.composer, searchParams.soloist, selectedYear);
  };

  useEffect(() => {
    const searchAtStart = async () => {
      const comp = searchParamsQuery.get("composer") ?? "";
      const cond = searchParamsQuery.get("conductor") ?? "";
      const solo = searchParamsQuery.get("soloist") ?? "";
      const start = searchParamsQuery.get("start") ?? startYear;
      const pageIndex = searchParamsQuery.get("pageindex") ?? "";

      setNamesInput({
        composer: comp,
        conductor: cond,
        soloist: solo,
      });
      setSelectedYear(start);
      setChunkIndex(Number(pageIndex));

      if (comp || cond || solo || start !== startYear) {
        await fetchConcertsRequest(cond, comp, solo, start, pageIndex);
      }
    };
    searchAtStart();
  }, [searchParamsQuery]);

  const changeYearsHandle = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const changeChunkIndex = useCallback(
    async (val) => {
      let next = chunkIndex + val;
      if (next < 0) {
        return;
      }
      setChunkIndex(next);

      searchParamsQuery.set("pageindex", next);
      setSearchParamsQuery(searchParamsQuery);

      await fetchConcertsRequest(namesInput.conductor, namesInput.composer, namesInput.soloist, selectedYear, next);
    },
    [chunkIndex, namesInput, setChunkIndex, setSearchParamsQuery, searchParamsQuery]
  );

  const resetFilters = () => {
    setNamesInput({ composer: "", soloist: "", conductor: "" });
    setChunkIndex(0);
    setConcerts([]);
    setSelectedYear(startYear);
  };

  const resultsPageString = (index) => {
    const chunkSize = 100;
    const start = chunkSize * index;
    const end = chunkSize * index + chunkSize;
    return `${start} ... ${end}`;
  };

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
      <div>
        <label htmlFor="start">Vuodesta lähtien</label>
        <select value={selectedYear} name="start" onChange={changeYearsHandle}>
          {yearsArray.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <button onClick={resetFilters}>Tyhjennä</button>
      <button onClick={userSearchConcerts}>Hae</button>
      {concerts.length > 0 && (
        <>
          <div>
            <div>Tulokset hakukriteereillä:</div>
            <span>
              Kapellimestari: {searchResultsCriteria.conductor.length > 1 ? searchResultsCriteria.conductor : "-"},
              Säveltäjä: {searchResultsCriteria.composer.length > 1 ? searchResultsCriteria.composer : "-"}, Solisti:{" "}
              {searchResultsCriteria.soloist.length > 1 ? searchResultsCriteria.soloist : "-"} Tulokset:{" "}
              {resultsPageString(chunkIndex)}
            </span>
          </div>
          <div>
            <button disabled={chunkIndex === 0} onClick={() => changeChunkIndex(-1)}>
              Edelliset 100
            </button>
            <button disabled={concerts.length !== 0 && concerts.length < 100} onClick={() => changeChunkIndex(1)}>
              Seuraavat 100
            </button>
          </div>
          <ul>
            {concerts.sort(sortConcertsByDate).map((conc) => {
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
        </>
      )}
    </>
  );
};

export default Concerts;
