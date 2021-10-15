import { useEffect } from "react";
import { getPerformancesByCompositorId } from "../api/performanceApi";

const SearchPage = () => {
  const getData = async () => {
    await getPerformancesByCompositorId();
  };

  useEffect(() => {
    getData();
  }, []);

  return <div>SearchPage</div>;
};

export default SearchPage;
