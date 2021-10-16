import { useState } from "react";
import { Table, TableContainer, Paper } from "@mui/material";

import ResultsTableHead from "./ResultsTableHead";
import ResultsTableBody from "./ResultsTableBody";

const ASC = "asc";
const DESC = "desc";

const ResultsTable = (props) => {
  const { tableData } = props;

  const [resultsSorted, setResultsSorted] = useState(tableData);
  const [dateSortDir, setDateSortDir] = useState(ASC);
  const [symphonySortDir, setSymphonySortDir] = useState(ASC);

  // Sort by date
  const switchDateSort = () => {
    setDateSortDir(dateSortDir === ASC ? DESC : ASC);

    const newList = tableData.sort((a, b) => {
      const dateA = Date.parse(a.concert.date);
      const dateB = Date.parse(b.concert.date);

      if (dateSortDir === ASC) {
        return dateB - dateA;
      }
      return dateA - dateB;
    });

    setResultsSorted(newList);
  };

  // Sort by symphony
  const switchSymphonySort = () => {
    setSymphonySortDir(symphonySortDir === ASC ? DESC : ASC);

    const newList = tableData.sort((a, b) => {
      const symphonyA = a.symphony.name.toUpperCase();
      const symphonyB = b.symphony.name.toUpperCase();

      if (symphonyA < symphonyB) {
        return symphonySortDir === ASC ? -1 : 1;
      }
      if (symphonyA > symphonyB) {
        return symphonySortDir === ASC ? 1 : -1;
      }
      return 0;
    });

    setResultsSorted(newList);
  };

  return (
    <div className="ResultsTable">
      <TableContainer component={Paper}>
        <Table size="small" aria-label="Concert performances table">
          <ResultsTableHead
            switchDateSort={switchDateSort}
            switchSymphonySort={switchSymphonySort}
            dateSortDir={dateSortDir}
            symphonySortDir={symphonySortDir}
          />
          <ResultsTableBody resultsSorted={resultsSorted} />
        </Table>
      </TableContainer>
    </div>
  );
};

export default ResultsTable;
