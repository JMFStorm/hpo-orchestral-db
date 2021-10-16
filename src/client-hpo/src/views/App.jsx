import { Container } from "@mui/material";

import SearchPage from "./SearchPage";
import "../styles/app.css";

const App = () => {
  return (
    <Container className="App" maxWidth="lg">
      <SearchPage />
    </Container>
  );
};

export default App;
