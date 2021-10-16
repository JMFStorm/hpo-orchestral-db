import { getPerformancesByCompositorId } from "../api/performanceApi";
import SearchForm from "./SearchForm";

const SearchPage = () => {
  const getByCompositor = async (compositorId, conductorId) => {
    console.log(compositorId, conductorId);
    await getPerformancesByCompositorId(compositorId);
  };

  return (
    <div className="SearchPage">
      <SearchForm submitForm={getByCompositor} />
    </div>
  );
};

export default SearchPage;
