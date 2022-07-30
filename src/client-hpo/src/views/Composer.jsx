import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import GetBackButton from "./GetBackButton";
import { fetchPremieresByComposer, fetchSymphoniesByComposerId, fetchComposerById } from "../api/request";
import Language from "../lang/Language.jsx";

const Composer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { lng } = Language();

  const [premieres, setPremieres] = useState([]);
  const [symphonies, setSymphonies] = useState([]);
  const [composer, setComposer] = useState(null);

  const composerId = useMemo(() => params.composerid ?? undefined, [params.composerid]);

  useEffect(() => {
    const fetchByComposer = async () => {
      let symphs = [];
      let prems = [];
      let comp = null;

      console.log("composerId", composerId);

      await Promise.all([
        await fetchSymphoniesByComposerId(composerId).then((res) => (symphs = res.result)),
        await fetchPremieresByComposer(composerId).then((res) => (prems = res.result)),
        await fetchComposerById(composerId).then((res) => (comp = res.result)),
      ]);

      console.log("symphonies", symphs);
      console.log("premieres", prems);
      console.log("composer", comp);

      setSymphonies(symphs ?? []);
      setPremieres(prems ?? []);
      setComposer(comp);
    };
    fetchByComposer();
  }, [composerId]);

  console.log("composerId", composerId);

  return (
    <>
      <div>
        <GetBackButton />
      </div>
      {composer && (
        <div>
          <div>Säveltäjä: {composer?.name}</div>
        </div>
      )}
      <div>
        <div>Teokset:</div>
        <ul>
          {symphonies.map((symph) => (
            <li>
              <span>{symph.name}</span>
              <button onClick={() => navigate(`/concerts/symphonyid/${symph.id}`)}>
                Hae konsertit ({symph.concertsCount})
              </button>
            </li>
          ))}
        </ul>
      </div>
      {premieres.length > 0 && (
        <div>
          <div>Kantaesitykset:</div>
          <ul>
            {premieres.map((prem) => (
              <li>
                <span>
                  {prem.concert?.date}: {prem.symphony?.name} ({lng("premiere_tag." + prem.premiere_tag?.name)})
                </span>
                <button onClick={() => navigate(`/concert/concertid/${prem.concert?.id}`)}>Avaa konsertti</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Composer;
