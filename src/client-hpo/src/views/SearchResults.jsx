import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const SearchResults = (props) => {
  const { searchResults } = props;

  return (
    <div className="SearchResults">
      <TableContainer component={Paper}>
        <Table size="small" aria-label="Concert performances table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Päivämäärä</TableCell>
              <TableCell align="left">Teos</TableCell>
              <TableCell align="left">Säveltäjä</TableCell>
              <TableCell align="left">Konsertin kuvaus</TableCell>
              <TableCell align="left">Kapellimestari</TableCell>
              <TableCell align="left">Sovittaja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((row) => (
              <TableRow key={row.id + row.order}>
                <TableCell align="left">{row.concert.date}</TableCell>
                <TableCell align="left">{row.symphony.name}</TableCell>
                <TableCell align="left">{row.compositor?.name}</TableCell>
                <TableCell align="left">{row.concert.concert_tag.name}</TableCell>
                <TableCell align="left">{row.conductor?.name}</TableCell>
                <TableCell align="left">{row.arranger?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SearchResults;
