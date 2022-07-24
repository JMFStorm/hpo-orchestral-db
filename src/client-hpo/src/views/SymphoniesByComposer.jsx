import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import GetBackButton from "./GetBackButton";
import { fetchSymphoniesByComposerId } from "../api/request";

const SymphoniesByComposer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [symphonies, setSymphonies] = useState([]);

  let composerId = useMemo(() => params.composerid ?? undefined, [params.composerid]);

  useEffect(() => {
    const getSymphonies = async () => {
      if (composerId) {
        const { result, error } = await fetchSymphoniesByComposerId(composerId);
        if (result) {
          setSymphonies(result);
        }
      }
    };
    getSymphonies();
  }, [composerId]);

  return (
    <>
      <GetBackButton />
      <ul>
        {symphonies.map((x) => (
          <li key={x.id}>
            <span>{x.name} </span>
            <span>{x.concertsCount} konsertti</span>
            <button onClick={() => navigate(`/concerts/symphonyid/${x.id}`)}>Hae konsertit</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SymphoniesByComposer;
