import { Container } from "@mui/material";

import SearchPage from "./SearchPage";
import "../styles/app.css";

const App = () => {
  return (
    <Container className="App" maxWidth="md">
      <SearchPage />
    </Container>
  );
};

export default App;
