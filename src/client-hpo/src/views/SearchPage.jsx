import { useState, useEffect } from "react";

import { getAllConductors, getAllCompositors } from "../api/musicianApi";
import { getPerformancesBySearchParams } from "../api/performanceApi";
import SearchForm from "./SearchForm";
import ResultsTable from "./ResultsTable";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const [compositors, setCompositors] = useState([]);
  const [conductors, setConductors] = useState([]);

  const asyncUseEffect = async () => {
    Promise.all([
      await getAllCompositors().then((res) => setCompositors(res)),
      await getAllConductors().then((res) => setConductors(res)),
    ]);
  };

  // Load compositors & conductors on component load
  useEffect(() => {
    asyncUseEffect();
  }, []);

  // Submit search form
  const getSearchResults = async (compositorId, conductorId) => {
    const response = await getPerformancesBySearchParams({
      compositorId,
      conductorId,
    });
    // Sort response by date
    setSearchResults(
      response.sort((a, b) => {
        const dateA = Date.parse(a.concert.date);
        const dateB = Date.parse(b.concert.date);
        return dateA - dateB;
      })
    );
  };

  return (
    <div className="SearchPage">
      <h1>Teoksen esityshaku DEMO</h1>
      <SearchForm compositors={compositors} conductors={conductors} submitForm={getSearchResults} />
      {searchResults.length > 0 ? (
        <ResultsTable tableData={searchResults} />
      ) : (
        <div>Ei hakutuloksia</div>
      )}
    </div>
  );
};

export default SearchPage;