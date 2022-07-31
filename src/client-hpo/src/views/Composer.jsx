import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { parsePgDateToString } from "../utils/functions";
import LoadingContent from "./LoadingContent";
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
  const [pageLoading, setPageLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const composerId = useMemo(() => params.composerid ?? undefined, [params.composerid]);

  useEffect(() => {
    const fetchByComposer = async () => {
      let symphs = [];
      let prems = [];
      let comp = null;

      setPageLoading(true);
      await Promise.all([
        await fetchSymphoniesByComposerId(composerId).then((res) => (symphs = res.result)),
        await fetchPremieresByComposer(composerId).then((res) => (prems = res.result)),
        await fetchComposerById(composerId).then((res) => (comp = res.result)),
      ]);
      setPageLoading(false);

      console.log("symphs", symphs);
      console.log("prems", prems);

      setSymphonies(symphs ?? []);
      setPremieres(prems ?? []);
      setComposer(comp);
    };
    fetchByComposer();
  }, [composerId]);

  const concertsString = (value) => {
    let txt = `(${value.concertsCount}`;
    if (value.concertsCount > 1) {
      txt = txt.concat(" konserttia");
    } else {
      txt = txt.concat(" konsertti");
    }
    txt = txt.concat(")");
    return txt;
  };

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const premieresTabDisabled = premieres.length === 0;
  const symphoniesLabel = lng("symhponies_tab", { value: symphonies.length });
  const premieresLabel = lng("premieres_tab", { value: premieres.length });

  return (
    <>
      <div>
        <GetBackButton />
      </div>
      <LoadingContent loading={pageLoading}>
        <div>
          <div>Säveltäjä: {composer?.name}</div>
        </div>
        <Tabs value={tabValue} onChange={changeTab}>
          <Tab label={symphoniesLabel} />
          <Tab label={premieresLabel} disabled={premieresTabDisabled} />
        </Tabs>
        {tabValue === 0 && (
          <>
            <List>
              {symphonies.map((symph, index) => {
                let textValue = `${symph.name}`;
                if (symph.arrangers) {
                  textValue = textValue.concat(` (${symph.arrangers.names})`);
                }
                const concertsText = concertsString(symph);
                return (
                  <div key={symph.id}>
                    {index !== 0 && <Divider variant="middle" component="li" />}
                    <ListItem>
                      <ListItemText primary={textValue} secondary={concertsText} />
                      <Button onClick={() => navigate(`/concerts/symphonyid/${symph.id}`)} variant="outlined">
                        Hae
                      </Button>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </>
        )}
        {tabValue === 1 && (
          <>
            <List>
              {premieres.map((prem, index) => {
                const textValue = `${parsePgDateToString(prem.concert?.date)}: ${prem.symphony?.name}`;
                const premiereText = `(${lng("premiere_tag." + prem.premiere_tag?.name)})`;
                return (
                  <div key={prem.id}>
                    {index !== 0 && <Divider variant="middle" component="li" />}
                    <ListItem>
                      <ListItemText primary={textValue} secondary={premiereText} />
                      <Button onClick={() => navigate(`/concert/concertid/${prem.concert?.id}`)} variant="outlined">
                        Avaa
                      </Button>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </>
        )}
      </LoadingContent>
    </>
  );
};

export default Composer;
