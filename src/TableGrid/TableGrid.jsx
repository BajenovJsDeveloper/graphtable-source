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
    padding: "8px 0",
  },
  tableTD: {
    color: "#c1c1c1",
    padding: "3px",
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
    isFilterActive,
    onFilterReset,
  } = props;

  const [dirSort, setDirSort] = useState({
    sender: "desc",
    id: "desc",
    date: "desc",
    debit: "desc",
    credit: "desc",
    active: "id",
  });

  const classes = useStyles();

  const reversDirArrow = (dir) => {
    return dir === "asc" ? "desc" : "asc";
  };

  const handleLastSorting = (fieldName) => {
    let dir = reversDirArrow(dirSort[fieldName]);
    setDirSort((prev) => ({ ...prev, [fieldName]: dir, active: fieldName }));
    handleSorting(dir, fieldName, rowsPageData);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableBG}>
          <TableRow>
            <TableCell className={classes.tableTH} align="left">
              <SortingIcon
                active={dirSort.active}
                name="sender"
                direction={dirSort.sender}
                clickSort={handleLastSorting}
              />
              Sender
            </TableCell>
            <TableCell className={classes.tableTH} align="left">
              <SortingIcon
                active={dirSort.active}
                name="id"
                direction={dirSort.id}
                clickSort={handleLastSorting}
              />
              Transaction ID
            </TableCell>
            <TableCell className={classes.tableTH} align="left">
              <SortingIcon
                active={dirSort.active}
                name="date"
                direction={dirSort.date}
                clickSort={handleLastSorting}
              />
              Date
            </TableCell>
            <TableCell className={classes.tableTH} align="left">
              <SortingIcon
                active={dirSort.active}
                name="debit"
                direction={dirSort.debit}
                clickSort={handleLastSorting}
              />
              Debet Amount
            </TableCell>
            <TableCell className={classes.tableTH} align="left">
              <SortingIcon
                active={dirSort.active}
                name="credit"
                direction={dirSort.credit}
                clickSort={handleLastSorting}
              />
              Credit Amount
              <FilterButton
                onFilterSort={onFilterSort}
                onFilterReset={onFilterReset}
                isFilterActive={isFilterActive}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsPageData.map((row) => (
            <TableRow key={row.transactionID}>
              <TableCell className={classes.tableTD}>{row.sender}</TableCell>
              <TableCell className={classes.tableTD} align="left">
                {row.transactionID}
              </TableCell>
              <TableCell className={classes.tableTD} align="left">
                {new Date(row.date).toLocaleString()}
              </TableCell>
              <TableCell className={classes.tableTD} align="left">
                {row.debitAmount}
              </TableCell>
              <TableCell className={classes.tableTD} align="left">
                {row.creditAmount}
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
              rowsPerPage={
                paginator.perPage === ALL_PAGES
                  ? paginator.count
                  : paginator.perPage
              }
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
