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
const sign = {
  left: '',
  right: 'mdl'
}

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
    color: "gray",
    padding: "3px",
    "&>p": {
      padding: 0,
      margin: 0,

    },
    "&>p:last-child":{
      color: "#c1c1c1",
      fontSize: '0.8em'
    }
  },
  tableBG: {
    backgroundColor: "#e0e0e0",
  },
});

function getDateToString(date){
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
}
function getTimeToString(date){
  const newDate = new Date(date);
  return newDate.toLocaleTimeString();
}


export default function TableGrid(props) {
  const {
    rowsPageData,
    handleSorting,
    onChangePage,
    onChangePerPage,
    onFilterSort,
    paginator,
    onFilterReset,
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
            <TableCell className={classes.tableTH} align="center" title="Sorting by id number">
              <SortingIcon
                active={dirSort.active}
                name="id"
                direction={dirSort.id}
                clickSort={handleLastSorting}
                title="Sorting by id number"
              />
              Transaction ID
            </TableCell>
            <TableCell className={classes.tableTH} align="left" title="Sorting by date">
              <SortingIcon
                active={dirSort.active}
                name="date"
                direction={dirSort.date}
                clickSort={handleLastSorting}
              />
              Date
            </TableCell>
            <TableCell className={classes.tableTH} align="right" title="Sorting debit">
              <SortingIcon
                active={dirSort.active}
                name="debit"
                direction={dirSort.debit}
                clickSort={handleLastSorting}
              />
              Debet Amount
            </TableCell>
            <TableCell className={classes.tableTH} align="right" title="Sorting by credit">
              <SortingIcon
                active={dirSort.active}
                name="credit"
                direction={dirSort.credit}
                clickSort={handleLastSorting}
              />
              Credit Amount
            </TableCell>
            <TableCell className={classes.tableTH} align="center" title="Sorting by sender">
              <SortingIcon
                active={dirSort.active}
                name="sender"
                direction={dirSort.sender}
                clickSort={handleLastSorting}
              />
              Sender
              <FilterButton
                onFilterSort={onFilterSort}
                onFilterReset={onFilterReset}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsPageData.map((row) => (
            <TableRow key={row.transactionID}>
              <TableCell className={classes.tableTD} align="center">
                {row.transactionID}
              </TableCell>
              <TableCell className={classes.tableTD} align="left">
                <p>{getDateToString(row.date)}</p>
                <p>{getTimeToString(row.date)}</p>
              </TableCell>
              <TableCell className={classes.tableTD} align="right">
                {`${sign.left} ${row.debitAmount} ${sign.right}`}
              </TableCell>
              <TableCell className={classes.tableTD} align="right">
                {`${sign.left} ${row.creditAmount} ${sign.right}`}
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
              rowsPerPage={
                paginator.perPage 
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
