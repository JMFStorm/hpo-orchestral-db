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

  useEffect(() => {
    asyncUseEffect();
  }, []);

  // Submit search form
  const getSearchResults = async (compositorId, conductorId) => {
    const params = {
      compositorId,
      conductorId,
    };
    const response = await getPerformancesBySearchParams(params);
    setSearchResults(response);
  };

  return (
    <div className="SearchPage">
      <SearchForm compositors={compositors} conductors={conductors} submitForm={getSearchResults} />
      {searchResults.length > 0 && <ResultsTable tableData={searchResults} />}
    </div>
  );
};

export default SearchPage;
