import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import LoadingContent from "./LoadingContent";
import { sortConcertsByDate } from "../utils/functions";
import AutocompleteFetch from "./AutocompleteFetch";
import Language from "../lang/Language.jsx";
import {
  fetchConcertsCombinationSearch,
  fetchAllComposersByKeyword,
  fetchAllConductorsByKeyword,
  fetchAllSoloistsByKeyword,
} from "../api/request";

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

const Concerts = () => {
  const { lng } = Language();
  const navigate = useNavigate();
  const [searchParamsQuery, setSearchParamsQuery] = useSearchParams({});
  const [concerts, setConcerts] = useState([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(startYear);
  const [searchResultsCriteria, setSearchResultsCriteria] = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  const [selectedConductor, setSelectedConductor] = useState("");
  const [selectedComposer, setSelectedComposer] = useState("");
  const [selectedSoloist, setSelectedSoloist] = useState("");

  const fetchConcertsRequest = async (conductor, composer, soloist, startYear, chunkIndex = 0) => {
    setSearchResultsCriteria({ conductor, composer, soloist, startYear, endYear });
    setPageLoading(true);
    const { result, error } = await fetchConcertsCombinationSearch(conductor, composer, soloist, startYear, chunkIndex);
    setPageLoading(false);
    if (result) {
      setConcerts(result);
      console.log("result", result);
    }
  };

  const userSearchConcerts = useCallback(async () => {
    const searchParams = {
      conductor: selectedConductor?.trim() ?? "",
      composer: selectedComposer?.trim() ?? "",
      soloist: selectedSoloist?.trim() ?? "",
      start: selectedYear,
      pageindex: 0,
    };
    setChunkIndex(0);
    setSearchParamsQuery(searchParams);
    await fetchConcertsRequest(searchParams.conductor, searchParams.composer, searchParams.soloist, selectedYear);
  }, [setChunkIndex, setSearchParamsQuery, selectedComposer, selectedSoloist, selectedYear, selectedConductor]);

  useEffect(() => {
    const searchAtStart = async () => {
      const comp = searchParamsQuery.get("composer") ?? "";
      const cond = searchParamsQuery.get("conductor") ?? "";
      const solo = searchParamsQuery.get("soloist") ?? "";
      const start = searchParamsQuery.get("start") ?? startYear;
      const pageIndex = searchParamsQuery.get("pageindex") ?? "";
      setSelectedConductor(cond);
      setSelectedComposer(comp);
      setSelectedYear(start);
      setSelectedSoloist(solo);
      setChunkIndex(Number(pageIndex));
      if (comp || cond || solo || start !== startYear) {
        await fetchConcertsRequest(cond, comp, solo, start, pageIndex);
      }
    };
    searchAtStart();
  }, []);

  const changeYearsHandle = useCallback(
    (event) => {
      setSelectedYear(Number(event.target.value));
    },
    [setSelectedYear]
  );

  const changeChunkIndex = useCallback(
    async (val) => {
      let next = chunkIndex + val;
      if (next < 0) {
        return;
      }
      setChunkIndex(next);
      searchParamsQuery.set("pageindex", next);
      setSearchParamsQuery(searchParamsQuery);
      await fetchConcertsRequest(selectedConductor, selectedComposer, selectedSoloist, selectedYear, next);
    },
    [
      selectedConductor,
      selectedComposer,
      selectedSoloist,
      chunkIndex,
      setChunkIndex,
      setSearchParamsQuery,
      searchParamsQuery,
    ]
  );

  const resetFilters = () => {
    setChunkIndex(0);
    setConcerts([]);
    setSelectedYear(startYear);
    setSelectedConductor("");
    setSelectedComposer("");
    setSelectedSoloist("");
  };

  const resultsPageString = useCallback(
    (index) => {
      const chunkSize = 100;
      const start = chunkSize * index + 1;
      const results = concerts.length;
      const tail = results < 100 ? results : chunkSize;
      const end = chunkSize * index + tail;
      if (start > end) {
        return "0";
      }
      return `${start} ... ${end}`;
    },
    [concerts]
  );

  const prviousButtonDisabled = chunkIndex === 0 || pageLoading;
  const nextButtonDisabled = (concerts.length !== 0 && concerts.length < 100) || pageLoading;

  return (
    <>
      <h2>Hae konsertteja</h2>
      <AutocompleteFetch
        name="conductor"
        label={lng("search_conductor")}
        value={selectedConductor}
        setValue={setSelectedConductor}
        asyncRequest={fetchAllConductorsByKeyword}
      />
      <AutocompleteFetch
        name="composer"
        label={lng("search_composer")}
        value={selectedComposer}
        setValue={setSelectedComposer}
        asyncRequest={fetchAllComposersByKeyword}
      />
      <AutocompleteFetch
        name="soloist"
        label={lng("search_soloist")}
        value={selectedSoloist}
        setValue={setSelectedSoloist}
        asyncRequest={fetchAllSoloistsByKeyword}
      />
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
      <>
        {searchResultsCriteria && (
          <div>
            <div>Tulokset hakukriteereillä:</div>
            <span>
              Kapellimestari: {searchResultsCriteria.conductor?.length > 0 ? searchResultsCriteria.conductor : "-"},
              Säveltäjä: {searchResultsCriteria.composer?.length > 0 ? searchResultsCriteria.composer : "-"}, Solisti:{" "}
              {searchResultsCriteria.soloist?.length > 0 ? searchResultsCriteria.soloist : "-"} Tulokset:{" "}
              {resultsPageString(chunkIndex)}
            </span>
          </div>
        )}
        <div>
          <button disabled={prviousButtonDisabled} onClick={() => changeChunkIndex(-1)}>
            Edelliset 100
          </button>
          <button disabled={nextButtonDisabled} onClick={() => changeChunkIndex(1)}>
            Seuraavat 100
          </button>
        </div>
        <LoadingContent loading={pageLoading}>
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
        </LoadingContent>
      </>
    </>
  );
};

export default Concerts;
