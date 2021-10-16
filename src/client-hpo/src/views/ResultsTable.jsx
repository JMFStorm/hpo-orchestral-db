import { useEffect, useState } from "react";
import { Table, TableContainer, Paper } from "@mui/material";

import ResultsTableHead from "./ResultsTableHead";
import ResultsTableBody from "./ResultsTableBody";

const ASC = "asc";
const DESC = "desc";

const DATE = "date";
const SYMPHONY = "symphony";

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

const sortBySymphony = (arr, sortDir) => {
  return arr.sort((a, b) => {
    const symphonyA = a.symphony.name.toUpperCase();
    const symphonyB = b.symphony.name.toUpperCase();

    if (symphonyA < symphonyB) {
      return sortDir === ASC ? -1 : 1;
    }
    if (symphonyA > symphonyB) {
      return sortDir === ASC ? 1 : -1;
    }
    return 0;
  });
};

const ResultsTable = (props) => {
  const { tableData } = props;

  const [resultsSorted, setResultsSorted] = useState(tableData);

  const [sortType, setSortType] = useState(DATE);
  const [dateSortDir, setDateSortDir] = useState(ASC);
  const [symphonySortDir, setSymphonySortDir] = useState(ASC);

  useEffect(() => {
    console.log("update");

    let newList = [];

    if (sortType === DATE) {
      newList = sortByDate(tableData, sortType);
    } else if (sortType === SYMPHONY) {
      newList = sortBySymphony(tableData, sortType);
    }

    setResultsSorted(newList);
  }, [sortType, tableData]);

  // Sort by date
  const switchDateSort = () => {
    setDateSortDir(dateSortDir === ASC ? DESC : ASC);
    setSortType(DATE);
  };

  // Sort by symphony
  const switchSymphonySort = () => {
    setSymphonySortDir(symphonySortDir === ASC ? DESC : ASC);
    setSortType(SYMPHONY);
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
