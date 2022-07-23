import React from "react";
import { useNavigate } from "react-router-dom";

const GetBackButton = (params) => {
  const { path } = params;
  let navigate = useNavigate();

  const getBack = (pathName) => {
    if (pathName) {
      navigate(pathName);
    } else {
      navigate(-1);
    }
  };

  return <button onClick={() => getBack(path)}>Takaisin</button>;
};

export default GetBackButton;
