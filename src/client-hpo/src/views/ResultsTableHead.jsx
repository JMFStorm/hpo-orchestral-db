import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

const ResultsTableHead = (props) => {
  const { switchDateSort, dateSortDir } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell align="left">
          <TableSortLabel direction={dateSortDir} onClick={switchDateSort}>
            Päivämäärä
          </TableSortLabel>
        </TableCell>
        <TableCell align="left">Teos</TableCell>
        <TableCell align="left">Säveltäjä</TableCell>
        <TableCell align="left">Konsertin kuvaus</TableCell>
        <TableCell align="left">Kapellimestari</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ResultsTableHead;
