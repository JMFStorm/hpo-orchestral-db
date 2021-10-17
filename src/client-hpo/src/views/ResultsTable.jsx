import { useEffect, useState } from "react";
import { Table, TableContainer, Paper } from "@mui/material";

import ResultsTableHead from "./ResultsTableHead";
import ResultsTableBody from "./ResultsTableBody";

const ASC = "asc";
const DESC = "desc";

const DATE = "date";
const SYMPHONY = "symphony";
const COMPOSITOR = "compositor";
const CONDUCTOR = "conductor";
const TAG = "tag";

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
    const symphonyA = a.symphony.name.toUpperCase().replace('"', "");
    const symphonyB = b.symphony.name.toUpperCase().replace('"', "");

    if (symphonyA < symphonyB) {
      return sortDir === ASC ? -1 : 1;
    }
    if (symphonyA > symphonyB) {
      return sortDir === ASC ? 1 : -1;
    }
    return 0;
  });
};

const sortByConductor = (arr, sortDir) => {
  return arr.sort((a, b) => {
    const conductorA = a.conductor.name.toUpperCase();
    const conductorB = b.conductor.name.toUpperCase();

    if (conductorA < conductorB) {
      return sortDir === ASC ? -1 : 1;
    }
    if (conductorA > conductorB) {
      return sortDir === ASC ? 1 : -1;
    }
    return 0;
  });
};

const sortByCompositor = (arr, sortDir) => {
  return arr.sort((a, b) => {
    const compositorA = a.compositor.name.toUpperCase();
    const compositorB = b.compositor.name.toUpperCase();

    if (compositorA < compositorB) {
      return sortDir === ASC ? -1 : 1;
    }
    if (compositorA > compositorB) {
      return sortDir === ASC ? 1 : -1;
    }
    return 0;
  });
};

const sortByTag = (arr, sortDir) => {
  return arr.sort((a, b) => {
    const tagA = a.concert.concert_tag.name.toUpperCase();
    const tagB = b.concert.concert_tag.name.toUpperCase();

    if (tagA < tagB) {
      return sortDir === ASC ? -1 : 1;
    }
    if (tagA > tagB) {
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
  const [compositorSortDir, setCompositorSortDir] = useState(ASC);
  const [conductorSortDir, setConductorSortDir] = useState(ASC);
  const [tagSortDir, setTagSortDir] = useState(ASC);

  // Init sort functions
  useEffect(() => {
    let newList = [];

    if (sortType === DATE) {
      newList = sortByDate(tableData, dateSortDir);
    } else if (sortType === SYMPHONY) {
      newList = sortBySymphony(tableData, symphonySortDir);
    } else if (sortType === CONDUCTOR) {
      newList = sortByConductor(tableData, conductorSortDir);
    } else if (sortType === COMPOSITOR) {
      newList = sortByCompositor(tableData, compositorSortDir);
    } else if (sortType === TAG) {
      newList = sortByTag(tableData, tagSortDir);
    }

    setResultsSorted(newList);
  }, [
    sortType,
    tableData,
    dateSortDir,
    symphonySortDir,
    conductorSortDir,
    compositorSortDir,
    tagSortDir,
  ]);

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

  // Sort by compositor
  const switchCompositorSort = () => {
    setCompositorSortDir(compositorSortDir === ASC ? DESC : ASC);
    setSortType(COMPOSITOR);
  };

  // Sort by conductor
  const switchConductorSort = () => {
    setConductorSortDir(conductorSortDir === ASC ? DESC : ASC);
    setSortType(CONDUCTOR);
  };

  // Sort by tag
  const switchTagSort = () => {
    setTagSortDir(tagSortDir === ASC ? DESC : ASC);
    setSortType(TAG);
  };

  return (
    <div className="ResultsTable">
      <TableContainer component={Paper}>
        <Table size="small" aria-label="Concert performances table">
          <ResultsTableHead
            switchDateSort={switchDateSort}
            switchSymphonySort={switchSymphonySort}
            switchCompositorSort={switchCompositorSort}
            switchConductorSort={switchConductorSort}
            switchTagSort={switchTagSort}
            dateSortDir={dateSortDir}
            symphonySortDir={symphonySortDir}
            compositorSortDir={compositorSortDir}
            conductorSortDir={conductorSortDir}
            tagSortDir={tagSortDir}
          />
          <ResultsTableBody resultsSorted={resultsSorted} />
        </Table>
      </TableContainer>
    </div>
  );
};

export default ResultsTable;
