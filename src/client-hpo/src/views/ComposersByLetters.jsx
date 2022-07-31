import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import LoadingContent from "./LoadingContent";
import Language from "../lang/Language.jsx";
import GetBackButton from "./GetBackButton";
import { fetchComposersByStartingLetters } from "../api/request";

const ComposersByLetters = () => {
  const params = useParams();
  let navigate = useNavigate();
  const { lng } = Language();
  const [composersResponse, setComposersResponse] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [namesLoading, setNamesLoading] = useState(false);

  let lettersArr = useMemo(() => params.letters ?? undefined, [params.letters]);

  useEffect(() => {
    const getComposers = async () => {
      if (lettersArr) {
        setNamesLoading(true);
        const { result, error } = await fetchComposersByStartingLetters(lettersArr);
        setNamesLoading(false);
        if (result) {
          console.log("result", result);
          setComposersResponse(result);
        }
      }
    };
    getComposers();
  }, [lettersArr]);

  const changeNameHandle = (event) => {
    setNameInput(() => event.target.value);
  };

  const symphoniesString = (value) => {
    let txt = `(${value.symphoniesCount}`;
    if (value.symphoniesCount > 1) {
      txt = txt.concat(" teosta");
    } else {
      txt = txt.concat(" teos");
    }
    if (value.premieresCount) {
      if (value.premieresCount > 1) {
        txt = txt.concat(`, ${value.premieresCount} kantaesitystä`);
      } else {
        txt = txt.concat(`, ${value.premieresCount} kantaesitys`);
      }
    }
    txt = txt.concat(")");
    return txt;
  };

  return (
    <>
      <GetBackButton path={"/composers"} />
      <div>
        <div>Säveltäjät alkukirjaimilla: {lettersArr.toUpperCase()}</div>
        <div>
          <TextField
            sx={{ width: "100%", maxWidth: 300 }}
            label={lng("filter_name_search")}
            variant="standard"
            onChange={(event) => changeNameHandle(event)}
          />
        </div>
      </div>
      <LoadingContent loading={namesLoading}>
        <List>
          {composersResponse
            .filter((comp) => comp.name.toLowerCase().includes(nameInput.toLowerCase()))
            .map((value, index) => {
              const textValue = `${value.name}`;
              const textSymphonies = symphoniesString(value);
              return (
                <div key={value.id}>
                  {index !== 0 && <Divider variant="middle" component="li" />}
                  <ListItem>
                    <ListItemText primary={textValue} secondary={textSymphonies} />
                    <Button onClick={() => navigate(`/composer/${value.id}`)} variant="outlined">
                      Avaa
                    </Button>
                  </ListItem>
                </div>
              );
            })}
        </List>
      </LoadingContent>
    </>
  );
};

export default ComposersByLetters;
