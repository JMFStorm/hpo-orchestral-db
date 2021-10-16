import { getPerformancesBySearchParams } from "../api/performanceApi";
import SearchForm from "./SearchForm";

const SearchPage = () => {
  const getByCompositor = async (compositorId, conductorId) => {
    console.log(compositorId, conductorId);

    const params = {
      compositorId,
      conductorId,
    };

    const response = await getPerformancesBySearchParams(params);
    console.log("response:", response);
  };

  return (
    <div className="SearchPage">
      <SearchForm submitForm={getByCompositor} />
    </div>
  );
};

export default SearchPage;
