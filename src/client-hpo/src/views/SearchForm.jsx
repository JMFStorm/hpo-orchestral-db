import { useState } from "react";
import { Button, FormGroup, MenuItem, InputLabel, Select } from "@mui/material";

const SearchForm = (props) => {
  const submitForm = props.submitForm;

  const [compositorId, setCompositorId] = useState("");
  const [conductorId, setConductorId] = useState("");

  const compositors = [
    { id: "0ec1698d-5ffc-4646-b66f-e21860d887ad", name: "Sibelius Jean" },
    { id: "35740395-6038-4c4e-8742-1da0e0d1d113", name: "Brahms Johannes" },
  ];

  const conductors = [{ name: "Segerstam Leif", id: "54d56613-d423-4153-8f68-a6430afcfcfd" }];

  const handleCompositor = (event) => {
    setCompositorId(event.target.value);
  };

  const handleConductor = (event) => {
    setConductorId(event.target.value);
  };

  const handleSubmit = () => {
    submitForm(compositorId, conductorId);
  };

  return (
    <div className="SearchForm">
      <FormGroup fullWidth>
        {/* Select compositors */}
        <InputLabel>Compositor</InputLabel>
        <Select
          defaultValue=""
          value={compositorId}
          labelId="select-compositor"
          label="Compositor"
          onChange={handleCompositor}
        >
          {compositors &&
            compositors.map((x) => {
              return <MenuItem value={x.id}>{x.name}</MenuItem>;
            })}
        </Select>

        {/* Select conductors */}
        <InputLabel>Conductor</InputLabel>
        <Select
          defaultValue=""
          value={conductorId}
          labelId="select-conductor"
          label="Conductor"
          onChange={handleConductor}
        >
          {conductors &&
            conductors.map((x) => {
              return <MenuItem value={x.id}>{x.name}</MenuItem>;
            })}
        </Select>
      </FormGroup>

      {/* Submit form */}
      <Button onClick={handleSubmit} variant="contained">
        Sumbit
      </Button>
    </div>
  );
};

export default SearchForm;
