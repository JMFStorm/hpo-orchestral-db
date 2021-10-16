import { useState } from "react";

import { getPerformancesBySearchParams } from "../api/performanceApi";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const getByCompositor = async (compositorId, conductorId) => {
    const params = {
      compositorId,
      conductorId,
    };

    const response = await getPerformancesBySearchParams(params);
    setSearchResults(response);
    console.log("response", response);
  };

  return (
    <div className="SearchPage">
      <SearchForm submitForm={getByCompositor} />
      <SearchResults searchResults={searchResults} />
    </div>
  );
};

export default SearchPage;
