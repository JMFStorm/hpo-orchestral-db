import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchConcertsCombinationSearch } from "../api/request";

const startYear = 1880;
const endYear = 2030;

const setYears = (start, end) => {
  const newYearsArray = [];
  for (let i = start; i <= end; i++) {
    newYearsArray.push(i);
  }
  return newYearsArray;
};
const yearsArray = setYears(startYear, endYear);

const sortConcertsByDate = (a, b, isDescending = true) => {
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
  const [searchParamsQuery, setSearchParamsQuery] = useSearchParams();
  const [namesInput, setNamesInput] = useState({ composer: "", soloist: "", conductor: "" });
  const [concerts, setConcerts] = useState([]);
  const [currentYearRange, setCurrentYearRange] = useState({ start: startYear, end: endYear });

  const changeNameHandle = (event) => {
    setNamesInput((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const fetchConcertsRequest = async (conductor, composer, soloist, startYear, endYear) => {
    const start = `${startYear}-01-01`;
    const endDatetime = new Date(endYear, 11, 31);
    const end = `${endDatetime.getFullYear()}-${endDatetime.getMonth() + 1}-${endDatetime.getDate()}`;

    const { result, error } = await fetchConcertsCombinationSearch(conductor, composer, soloist, start, end);
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
    await fetchConcertsRequest(
      searchParams.conductor,
      searchParams.composer,
      searchParams.soloist,
      currentYearRange.start,
      currentYearRange.end
    );
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
        await fetchConcertsRequest(cond, comp, solo, currentYearRange.start, currentYearRange.end);
      }
    };
    searchAtStart();
  }, [searchParamsQuery]);

  const changeYearsHandle = (event) => {
    const name = event.target.name;
    const value = Number(event.target.value);
    if (currentYearRange) {
      const newRange = {
        ...currentYearRange,
        [name]: value,
      };
      console.log("newRange", newRange);
      setCurrentYearRange(newRange);
    }
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
        <label htmlFor="start">Alku</label>
        <select name="start" onChange={changeYearsHandle}>
          {yearsArray.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <label htmlFor="end">Loppu</label>
        <select defaultValue={yearsArray[yearsArray.length - 1]} name="end" onChange={changeYearsHandle}>
          {yearsArray.map((year) => (
            <option className="option" key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => setNamesInput({ composer: "", soloist: "", conductor: "" })}>Tyhjennä</button>
      <button onClick={searchConcerts}>Hae</button>
      {concerts.length === 0 && <div>Rajaa hakua hakukentillä</div>}
      {concerts.length > 0 && (
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
      )}
    </>
  );
};

export default Concerts;
