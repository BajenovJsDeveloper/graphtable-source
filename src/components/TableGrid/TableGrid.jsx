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
import "./style.css";

const ALL_PAGES = -1;
const PP_1 = 10;
const PP_2 = 25;
const PP_3 = 50;
const PP_4 = 100;
const sign = {
  left: "",
  right: "mdl",
};

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
    "&:first-child": {
      paddingRight: 30,
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

function getDateToString(date) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
}
function getTimeToString(date) {
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

  const reversDirArrow = (dir) => {
    return dir === "asc" ? "desc" : "asc";
  };

  const toNumberWithPrfix = (str, sign) => {
    if (Number(str) > 0)
      return `${sign.left.toUpperCase()} ${str} ${sign.right.toUpperCase()}`;
    else return "-";
  };

  const dateValueToString = (dateValue) => {
    return new Date(dateValue).toLocaleDateString();
  };

  const toNumberSpacedString = (num) => {
    let numFormated = num.toFixed(2).split(".");
    let fix = numFormated[0].split("").reverse();
    let float = numFormated[1];
    fix = fix.map((digit, idx) =>
      idx % 3 === 0 && idx > 0 ? `${digit} ` : digit
    );
    fix = fix.reverse().join("");
    numFormated[0] = fix;
    numFormated[1] = float;
    return numFormated.join(".");
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
            <TableCell
              colSpan={2}
              className={classes.tableTH}
              align="right"
              title="Filter"
            >
              <Box className="filter">
                <FilterButton onFilterSort={onFilterSort} />
                <Box className="date__container">
                  <div className="date__label">Date range:</div>
                  <div className="date__range">
                    {`${dateValueToString(
                      dateRange.start
                    )} - ${dateValueToString(dateRange.end)}`}
                  </div>
                </Box>
              </Box>
            </TableCell>
            <TableCell
              p={2}
              colSpan={3}
              className={classes.tableTH}
              align="left"
            ></TableCell>
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
                <p>{getDateToString(row.date)}</p>
                <p>{getTimeToString(row.date)}</p>
              </TableCell>
              <TableCell className={classes.tableTD} align="right">
                {toNumberWithPrfix(toNumberSpacedString(row.debitAmount), sign)}
              </TableCell>
              <TableCell className={classes.tableTD} align="right">
                {toNumberWithPrfix(
                  toNumberSpacedString(row.creditAmount),
                  sign
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
