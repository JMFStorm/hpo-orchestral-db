import { useState } from "react";
import { Button, FormGroup, MenuItem, InputLabel, Select } from "@mui/material";

const SearchForm = (props) => {
  const { compositors, conductors, submitForm } = props;

  const [compositorId, setCompositorId] = useState("");
  const [conductorId, setConductorId] = useState("");

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
          {compositors.length > 0 &&
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
          {conductors.length > 0 &&
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
