import React, { useState, useEffect, useCallback, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const AutocompleteFetch = ({ name, label, asyncRequest, value, setValue }) => {
  const [inputValue, setInputValue] = useState("");
  const [debounceId, setDebounceId] = useState(undefined);
  const [results, setResults] = useState();

  const fetch = async (id) => {
    clearInterval(id);
    setDebounceId(undefined);
    if (inputValue) {
      const { result } = await asyncRequest(inputValue);
      console.log("result", result);
      setResults(result);
    }
  };

  useEffect(() => {
    if (inputValue) {
      const setTimer = () => {
        const second = 1000;
        const newTimerId = setInterval(() => fetch(newTimerId), second);
        setDebounceId(newTimerId);
      };
      if (!debounceId) {
        setTimer();
      } else if (debounceId) {
        clearInterval(debounceId);
        setTimer();
      }
    }
  }, [inputValue]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const resultsList = useMemo(() => {
    if (!results) {
      return [];
    }
    return results.map((res) => {
      return { label: res.name, id: res.id };
    });
  }, [results]);

  return (
    <>
      <Autocomplete
        sx={{ margin: "0.5rem" }}
        disablePortal
        filterOptions={(x) => x}
        id={"autocomplete-" + name}
        options={resultsList}
        renderInput={(params) => <TextField {...params} label={label} />}
        value={value}
        onChange={(event, newValue) => {
          if (newValue) {
            setInputValue(newValue.label);
            setValue(newValue.label);
          }
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          setValue(newInputValue);
        }}
        isOptionEqualToValue={(option, value) => {
          return true || option?.label === value || option?.label.includes(value);
        }}
      />
    </>
  );
};

export default AutocompleteFetch;
