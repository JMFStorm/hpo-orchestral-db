import { useEffect, useState } from "react";
import { Table, TableContainer, Paper } from "@mui/material";

import ResultsTableHead from "./ResultsTableHead";
import ResultsTableBody from "./ResultsTableBody";

const ASC = "asc";
const DESC = "desc";
const DATE = "date";

const sortByDate = (arr, sortDir) => {
  return arr.sort((a, b) => {
    const dateA = Date.parse(a.concert.date);
    const dateB = Date.parse(b.concert.date);

    if (sortDir === ASC) {
      return dateB - dateA;
    }
    return dateA - dateB;
  });
};

const ResultsTable = (props) => {
  const { tableData } = props;

  const [resultsSorted, setResultsSorted] = useState(tableData);

  const [sortType, setSortType] = useState(DATE);
  const [dateSortDir, setDateSortDir] = useState(ASC);

  // Init sort functions
  useEffect(() => {
    let newList = [];

    if (sortType === DATE) {
      newList = sortByDate(tableData, dateSortDir);
    }

    setResultsSorted(newList);
  }, [sortType, tableData, dateSortDir]);

  // Sort by date
  const switchDateSort = () => {
    setDateSortDir(dateSortDir === ASC ? DESC : ASC);
    setSortType(DATE);
  };

  return (
    <div className="ResultsTable">
      <TableContainer component={Paper}>
        <Table size="small" aria-label="Concert performances table">
          <ResultsTableHead switchDateSort={switchDateSort} dateSortDir={dateSortDir} />
          <ResultsTableBody resultsSorted={resultsSorted} />
        </Table>
      </TableContainer>
    </div>
  );
};

export default ResultsTable;
