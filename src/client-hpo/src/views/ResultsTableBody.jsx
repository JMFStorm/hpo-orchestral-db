import { TableBody, TableCell, TableRow } from "@mui/material";

const ResultsTableBody = (props) => {
  const { resultsSorted } = props;

  return (
    <TableBody>
      {resultsSorted.map((row) => (
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
  );
};

export default ResultsTableBody;
