import { useState } from "react";
import { Button, FormGroup, MenuItem, InputLabel, Select } from "@mui/material";

const SearchForm = (props) => {
  const { composers, conductors, submitForm } = props;

  const [composerId, setComposerId] = useState("");
  const [conductorId, setConductorId] = useState("");

  const handleComposer = (event) => {
    setComposerId(event.target.value);
  };

  const handleConductor = (event) => {
    setConductorId(event.target.value);
  };

  const handleSubmit = () => {
    submitForm(composerId, conductorId);
  };

  return (
    <div className="SearchForm">
      <FormGroup fullwidth={"true"}>
        {/* Select composers */}
        <InputLabel>Säveltäjä</InputLabel>
        <Select
          defaultValue=""
          value={composerId}
          labelId="select-composer"
          label="Composer"
          onChange={handleComposer}
        >
          <MenuItem value="">
            <em>Tyhjä</em>
          </MenuItem>
          {composers.length > 0 &&
            composers
              .sort((a, b) => {
                if (a.name < b.name) {
                  return -1;
                } else if (a.name > b.name) {
                  return 1;
                }
                return 0;
              })
              .map((x) => {
                return (
                  <MenuItem key={x.id} value={x.id}>
                    {x.name}
                  </MenuItem>
                );
              })}
        </Select>

        {/* Select conductors */}
        <InputLabel>Kapellimestari</InputLabel>
        <Select
          defaultValue=""
          value={conductorId}
          labelId="select-conductor"
          label="Conductor"
          onChange={handleConductor}
        >
          <MenuItem value="">
            <em>Tyhjä</em>
          </MenuItem>
          {conductors.length > 0 &&
            conductors
              .sort((a, b) => {
                if (a.name < b.name) {
                  return -1;
                } else if (a.name > b.name) {
                  return 1;
                }
                return 0;
              })
              .map((x) => {
                return (
                  <MenuItem key={x.id} value={x.id}>
                    {x.name}
                  </MenuItem>
                );
              })}
        </Select>
      </FormGroup>

      {/* Submit form */}
      <Button sx={{ margin: "1rem 0" }} onClick={handleSubmit} variant="contained">
        Hae
      </Button>
    </div>
  );
};

export default SearchForm;
