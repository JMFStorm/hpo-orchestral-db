import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import Language from "../lang/Language.jsx";
import { parsePgDateToString } from "../utils/functions";
import LoadingContent from "./LoadingContent";
import { sortConcertsByDate } from "../utils/functions";
import GetBackButton from "./GetBackButton";
import { fetchConcertsBySymphonyId } from "../api/request";

const ConcertsBySymphony = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { lng } = Language();

  const [concerts, setConcerts] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  let symphonyId = useMemo(() => params.symphonyid ?? undefined, [params.symphonyid]);

  useEffect(() => {
    const getConcerts = async () => {
      if (symphonyId) {
        setPageLoading(true);
        const { result, error } = await fetchConcertsBySymphonyId(symphonyId);
        setPageLoading(false);
        if (result) {
          console.log("result", result);
          setConcerts(result);
        }
      }
    };
    getConcerts();
  }, [symphonyId]);

  const setConductorsString = (concert) => {
    let txt = "";
    if (concert.conductors.length > 0) {
      txt = txt.concat("(");
      concert.conductors.forEach((cond, index) => {
        if (index === concert.conductors.length - 1 && index !== 0) {
          txt = txt.concat(" & ");
        } else if (index !== 0) {
          txt = txt.concat(", ");
        }
        txt = txt.concat(`${cond.name}`);
      });
      txt = txt.concat(")");
    }
    return txt === "" ? `(${lng("conductor_unknown")})` : txt;
  };

  return (
    <>
      <GetBackButton />
      <LoadingContent loading={pageLoading}>
        <List>
          {concerts.sort(sortConcertsByDate).map((concert, index) => {
            const textValue = `${parsePgDateToString(concert.date)}: ${concert.concert_tag?.name}`;
            const conductorsText = setConductorsString(concert);
            return (
              <div key={concert.id}>
                {index !== 0 && <Divider variant="middle" component="li" />}
                <ListItem>
                  <ListItemText primary={textValue} secondary={conductorsText} />
                  <Button onClick={() => navigate(`/concert/concertid/${concert.id}`)} variant="outlined">
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

export default ConcertsBySymphony;
