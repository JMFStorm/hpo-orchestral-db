import React, { useEffect } from "react";

import "../styles/app.css";
import {
  fetchAllComposers,
  fetchConcertsCombinationSearch,
  fetchPerformancesByComposerIdAndPremiereTag,
} from "../api/request";

const App = () => {
  useEffect(() => {
    async function fetchEffect() {
      console.log("composers", await fetchAllComposers());
      console.log(
        "concerts combination",
        await fetchConcertsCombinationSearch(null, null, null, "Anton", "Robert")
      );
      console.log(
        "Composer performances premieretag search",
        await fetchPerformancesByComposerIdAndPremiereTag("3ae3684e-fffb-45b3-99fe-b065d03dd69c", [
          "3ed86cdb-aec1-4669-89f7-86476c0717be",
        ])
      );
    }
    fetchEffect();
  }, []);

  console.log();

  return <div>Hello world</div>;
};

export default App;
