import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import FilterButton from "../FilterButton/FilterButton";
import SortingIcon from "../SortingIcon/SortingIcon";
import Box from "@material-ui/core/Box";
import { tableAPI } from "../../projectapi/tableapi";
import "./style.css";

const ALL_PAGES = -1;
const PP_1 = 10;
const PP_2 = 25;
const PP_3 = 50;
const PP_4 = 100;

const useStyles = makeStyles({
  table: {
    minWidth: "300px",
    width: "100%",
  },
  tableTH: {
    color: "#0d218c",
    whiteSpace: "nowrap",
    fontSize: "0.8rem",
    padding: "3px 10px",
  },
  tableTD: {
    color: "gray",
    padding: "3px",
    "&>p": {
      padding: 0,
      margin: 0,
    },
    "&:first-child": {
      paddingRight: 30,
      width: 100,
    },
    "&:nth-child(2)": {
      width: 100,
    },
    "&>p:last-child": {
      color: "#c1c1c1",
      fontSize: "0.8em",
    },
  },
  tableBG: {
    backgroundColor: "#e0e0e0",
  },
});

export default function TableGrid(props) {
  const {
    rowsPageData,
    handleSorting,
    onChangePage,
    onChangePerPage,
    onFilterSort,
    paginator,
    dateRange,
  } = props;

  const [dirSort, setDirSort] = useState({
    sender: "desc",
    id: "asc",
    date: "desc",
    debit: "desc",
    credit: "desc",
    active: "id",
  });

  const classes = useStyles();

  const handleLastSorting = (fieldName) => {
    let dir = tableAPI.reversDirArrow(dirSort[fieldName]);
    setDirSort((prev) => ({ ...prev, [fieldName]: dir, active: fieldName }));
    handleSorting(dir, fieldName);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableBG}>
          <TableRow>
            <TableCell
              colSpan={5}
              className={classes.tableTH}
              align="left"
              title="Filter"
            >
              <Box className="filter">
                <FilterButton onFilterSort={onFilterSort} />
                <Box className="date__container">
                  <div className="date__label">Date range:</div>
                  <div className="date__range">
                    {`${tableAPI.dateValueToString(
                      dateRange.start
                    )} - ${tableAPI.dateValueToString(dateRange.end)}`}
                  </div>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              className={classes.tableTH}
              align="center"
              title="Sorting by id number"
            >
              <SortingIcon
                active={dirSort.active}
                name="id"
                direction={dirSort.id}
                clickSort={handleLastSorting}
                title="Sorting by id number"
              />
              Transaction ID
            </TableCell>
            <TableCell
              className={classes.tableTH}
              align="center"
              title="Sorting by date"
            >
              <SortingIcon
                active={dirSort.active}
                name="date"
                direction={dirSort.date}
                clickSort={handleLastSorting}
              />
              Date
            </TableCell>
            <TableCell
              className={classes.tableTH}
              align="right"
              title="Sorting debit"
            >
              <SortingIcon
                active={dirSort.active}
                name="debit"
                direction={dirSort.debit}
                clickSort={handleLastSorting}
              />
              Debet Amount
            </TableCell>
            <TableCell
              className={classes.tableTH}
              align="right"
              title="Sorting by credit"
            >
              <SortingIcon
                active={dirSort.active}
                name="credit"
                direction={dirSort.credit}
                clickSort={handleLastSorting}
              />
              Credit Amount
            </TableCell>
            <TableCell
              className={classes.tableTH}
              align="center"
              title="Sorting by sender"
            >
              <SortingIcon
                active={dirSort.active}
                name="sender"
                direction={dirSort.sender}
                clickSort={handleLastSorting}
              />
              Sender
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsPageData.map((row) => (
            <TableRow key={row.transactionID}>
              <TableCell className={classes.tableTD} align="right">
                {row.transactionID}
              </TableCell>
              <TableCell className={classes.tableTD} align="right">
                <p>{tableAPI.getDateToString(row.date)}</p>
                <p>{tableAPI.getTimeToString(row.date)}</p>
              </TableCell>
              <TableCell className={classes.tableTD} align="right">
                {tableAPI.toNumberWithPrefix(
                  tableAPI.toNumberSpacedString(row.debitAmount)
                )}
              </TableCell>
              <TableCell className={classes.tableTD} align="right">
                {tableAPI.toNumberWithPrefix(
                  tableAPI.toNumberSpacedString(row.creditAmount)
                )}
              </TableCell>
              <TableCell className={classes.tableTD} align="center">
                {row.sender}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[
                PP_1,
                PP_2,
                PP_3,
                PP_4,
                { label: "All", value: ALL_PAGES },
              ]}
              colSpan={5}
              count={paginator.count}
              rowsPerPage={paginator.perPage}
              page={paginator.page}
              SelectProps={{
                inputProps: { "aria-label": "Records per page" },
                native: true,
              }}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangePerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
