import React, { useEffect } from "react";

import "../styles/app.css";
import {
  fetchAllComposers,
  fetchConcertsCombinationSearch,
  fetchPerformancesByComposerIdAndPremiereTag,
  fetchComposersByStartingLetters,
  fetchSymphoniesByComposerId,
  fetchConcertsBySymphonyId,
  fetchConcertById,
} from "../api/request";

const App = () => {
  useEffect(() => {
    async function fetchEffect() {
      console.log("composers", await fetchAllComposers());
      console.log("concerts combination", await fetchConcertsCombinationSearch(null, null, null, "Anton", "Robert"));
      console.log(
        "Composer performances premieretag search",
        await fetchPerformancesByComposerIdAndPremiereTag("3ae3684e-fffb-45b3-99fe-b065d03dd69c", [
          "3ed86cdb-aec1-4669-89f7-86476c0717be",
        ])
      );
      console.log("Composers from starting letters: ", await fetchComposersByStartingLetters(["o"]));
      console.log(
        "Symphonies by composerId",
        await fetchSymphoniesByComposerId("6fc6bd2d-749c-4d70-b215-8f7757ccc101")
      );
      console.log("Concerts by symphony id", await fetchConcertsBySymphonyId("52ef5eeb-f2f9-4d88-8c15-54ad1a7d5057"));
      console.log("Concert by id", await fetchConcertById("af25ba51-ec96-4f1b-b681-44045c67db53"));
    }
    fetchEffect();
  }, []);

  return <div>Hello world</div>;
};

export default App;
