import React from "react";
import { Link, useNavigate } from "react-router-dom";

const GetBackButton = ({ path }) => {
  let navigate = useNavigate();

  const getBack = (pathName) => {
    navigate(pathName);
  };

  return <button onClick={() => getBack(path)}>Takaisin</button>;
};

export default GetBackButton;
