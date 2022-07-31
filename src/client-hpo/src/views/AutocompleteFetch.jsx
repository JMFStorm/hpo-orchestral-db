import React, { useState, useEffect, useMemo, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import LoadingIcon from "./LoadingIcon";

const AutocompleteFetch = ({ name, label, asyncRequest, value, setValue, customOnChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [debounceId, setDebounceId] = useState(undefined);
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(
    async (id) => {
      clearInterval(id);
      setDebounceId(undefined);
      if (inputValue) {
        const { result } = await asyncRequest(inputValue);
        setLoading(false);
        console.log("result", result);
        setResults(result);
      }
    },
    [asyncRequest, inputValue, setLoading]
  );

  useEffect(() => {
    if (inputValue && value !== inputValue) {
      setLoading(true);
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

  const resultsList = useMemo(() => {
    if (!results) {
      return [];
    }
    return results.map((res) => {
      return { label: res.name, id: res.id };
    });
  }, [results]);

  const onChangeEventDefault = (event, newValue) => {
    if (newValue) {
      setValue(newValue.label);
    }
  };

  const onChangeEvent = customOnChange ?? onChangeEventDefault;

  return (
    <>
      <Autocomplete
        sx={{ margin: "0.5rem" }}
        disablePortal
        filterOptions={(x) => x}
        id={"autocomplete-" + name}
        options={resultsList}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <LoadingIcon sizePixels={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        value={value}
        onChange={onChangeEvent}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          if (newInputValue === "") {
            setValue(newInputValue);
          }
        }}
        isOptionEqualToValue={(option, value) => {
          return true || option?.label === value || option?.label.includes(value);
        }}
      />
    </>
  );
};

export default AutocompleteFetch;
