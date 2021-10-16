import { useState } from "react";
import { Button, FormGroup, MenuItem, InputLabel, Select } from "@mui/material";

const SearchForm = (props) => {
  const submitForm = props.submitForm;

  const [compositorId, setCompositorId] = useState("");
  const [conductorId, setConductorId] = useState("");

  const compositors = [{ id: "c5e48d18-c114-410a-bc9f-7a3485af926d", name: "Sibelius Jean" }];

  const conductors = [{ name: "Segerstam Leif", id: "7439f066-20ad-4935-be4d-3a2092c3ad67" }];

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
        <InputLabel>Säveltäjä</InputLabel>
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
        <InputLabel>Kapellimestari</InputLabel>
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
        Hae
      </Button>
    </div>
  );
};

export default SearchForm;
