import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

const ResultsTableHead = (props) => {
  const {
    switchDateSort,
    switchSymphonySort,
    switchCompositorSort,
    switchConductorSort,
    switchTagSort,
    dateSortDir,
    symphonySortDir,
    compositorSortDir,
    conductorSortDir,
    tagSortDir,
  } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell align="left">
          <TableSortLabel direction={dateSortDir} onClick={switchDateSort}>
            Päivämäärä
          </TableSortLabel>
        </TableCell>
        <TableCell align="left">
          <TableSortLabel direction={symphonySortDir} onClick={switchSymphonySort}>
            Teos
          </TableSortLabel>
        </TableCell>
        <TableCell align="left">
          <TableSortLabel direction={compositorSortDir} onClick={switchCompositorSort}>
            Säveltäjä
          </TableSortLabel>
        </TableCell>
        <TableCell align="left">
          <TableSortLabel direction={tagSortDir} onClick={switchTagSort}>
            Konsertin kuvaus
          </TableSortLabel>
        </TableCell>
        <TableCell align="left">
          <TableSortLabel direction={conductorSortDir} onClick={switchConductorSort}>
            Kapellimestari
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ResultsTableHead;
