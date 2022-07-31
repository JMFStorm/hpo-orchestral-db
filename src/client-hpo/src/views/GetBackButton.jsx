import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Language from "../lang/Language.jsx";

const GetBackButton = (params) => {
  const { path } = params;
  const { lng } = Language();
  let navigate = useNavigate();

  const getBack = (pathName) => {
    if (pathName) {
      navigate(pathName);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button onClick={() => getBack(path)} variant="outlined" startIcon={<ArrowBackIcon />}>
      {lng("get_back")}
    </Button>
  );
};

export default GetBackButton;
