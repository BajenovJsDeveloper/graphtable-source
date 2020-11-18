import Chart from "chart.js";
import { useEffect, useState } from "react";
import mockFetch from "./mockFetch/mockfetch";
import TableGrid from "./TableGrid/TableGrid";
import Box from "@material-ui/core/Box";
import Loading from "./Lodaing/Loading";
import "./graph.css";

const URL = "https://graphs.com";
const USER_NAME = "Vladimir";
const USER_PASSWORD = "admin";
const DEBIT = 0;
const CREDIT = 1;
const DEBIT_AMOUNT_FIELD = "debitAmount";
const CREDIT_AMOUNT_FIELD = "creditAmount";
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;
const SERVER_DELAY_TIME = 1000;
const PICES_ON_PIE = 5;
const ZERO = 0;

function creatGraph(itemId, values) {
  const ctx = document.getElementById(itemId).getContext("2d");
  const labels = values.map((i, index) => index + 1);
  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
          ],
          borderColor: "gray",
          borderWidth: 1,
        },
      ],
    },
  });
  return chart.destroy.bind(chart);
}

function getPicesOfChart(data, fieldName) {
  const points = [];
  const len = data.length;
  const step = len > PICES_ON_PIE ? Math.ceil(len / PICES_ON_PIE) : 1;
  const name = fieldName === DEBIT ? DEBIT_AMOUNT_FIELD : CREDIT_AMOUNT_FIELD;
  let sum = ZERO;
  if (data) {
    for (let i = ZERO; i < len; i++) {
      sum += data[i][name];
      if ((i + 1) % step === ZERO) {
        points.push(sum);
        sum = ZERO;
      }
    }
    return points;
  } else points.push(ZERO);
  return points;
}

function sorting(dir, field, dataList) {
  const NEGATIVE_SENSE = -1;
  const POZITIVE_SENSE = 1;
  const sign = dir === "desc" ? POZITIVE_SENSE : NEGATIVE_SENSE;
  return dataList.sort((a, b) => {
    if (a[field] > b[field]) return 1 * sign;
    if (a[field] < b[field]) return -1 * sign;
    else return ZERO;
  });
}

function sortingByFieldName(dir, fieldName, rowsPageData) {
  const newDataList = [...rowsPageData];
  switch (fieldName) {
    case "id": {
      sorting(dir, "transactionID", newDataList);
      break;
    }
    case "sender": {
      sorting(dir, "sender", newDataList);
      break;
    }
    case "date": {
      sorting(dir, "date", newDataList);
      break;
    }
    case "credit": {
      sorting(dir, "creditAmount", newDataList);
      break;
    }
    case "debit": {
      sorting(dir, "debitAmount", newDataList);
      break;
    }
    default: {
      sorting(dir, "transactionID", newDataList);
    }
  }
  return newDataList;
}
function getDateValue(date) {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  return new Date(year, month, day).valueOf();
}

function filtrDataByDate(dataList, date) {
  const dateValue = getDateValue(date);
  const filteredData = dataList.filter(function (item) {
    const itemDateValue = getDateValue(item.date.valueOf());
    if (itemDateValue === dateValue) return true;
    return false;
  });
  return filteredData;
}
function defaultPagination(count = ZERO) {
  return { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE, count };
}

function Graph() {
  const [rowsPageData, setRowsPageData] = useState([]);
  const [paginator, setPaginator] = useState(() => defaultPagination());
  const [isFilterActive, setFilter] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onFilterSort = (newDate) => {
    const filteredData = filtrDataByDate(rowsPageData, newDate);

    setFilter(true);
    setRowsPageData(filteredData);
    setPaginator({
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE,
      count: filteredData.length,
    });
  };
  const onFilterReset = () => {
    getDataFromServer(URL);
    setFilter(false);
  };

  const handleSorting = (dir, fieldName, rows) => {
    setRowsPageData(sortingByFieldName(dir, fieldName, rowsPageData));
  };

  const onChangePage = (e, page) => {
    getDataFromServer(URL, paginator, page);
  };

  const onChangePerPage = (perPage) => {
    const pagesOnPage = Number(perPage.target.value);
    getDataFromServer(URL, paginator, 0, pagesOnPage);
  };

  const getDataFromServer = (url, paging, page, perPage) => {
    const payload = {
      userName: USER_NAME,
      userPassword: USER_PASSWORD,
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE,
    };
    if (paging) {
      payload.page = page !== undefined ? page : paging.page;
      payload.perPage = perPage ? perPage : paging.perPage;
    }

    mockFetch.get(url, payload).then((data) => {
      if (data.status === "ok") {
        setTimeout(() => {
          setRowsPageData(data.data);
          setPaginator((prev) => ({
            ...prev,
            page: data.page,
            count: data.count,
            perPage: data.perPage,
          }));
          setLoading(false);
          console.log("from server: ", data);
        }, SERVER_DELAY_TIME);
      } else {
        throw new Error("Something is wrong!!! " + data.message);
      }
    });
    setLoading(true);
  };

  useEffect(() => {
    getDataFromServer(URL);
  }, []);

  useEffect(() => {
    if (rowsPageData.length > ZERO) {
      const valuesCredit = getPicesOfChart(rowsPageData, DEBIT);
      const valuesDebit = getPicesOfChart(rowsPageData, CREDIT);
      const destroyCredit = creatGraph("chart-credit", valuesCredit);
      const destroyDebit = creatGraph("chart-debit", valuesDebit);
      return () => {
        destroyDebit();
        destroyCredit();
      };
    }
  }, [rowsPageData]);

  return (
    <div className="App">
      <Loading isLoading={isLoading} />
      <Box
        className="App__graph-container"
        fontFamily="Roboto"
        fontSize={20}
        p={1}
      >
        <Box className="App__graphic">
          Debit Amount:
          <canvas id="chart-credit"></canvas>
        </Box>
        <Box className="App__graphic">
          Credit Amount:
          <canvas id="chart-debit"></canvas>
        </Box>
      </Box>
      <Box className="App__table">
        <TableGrid
          rowsPageData={rowsPageData}
          onFilterSort={onFilterSort}
          paginator={paginator}
          handleSorting={handleSorting}
          onChangePage={onChangePage}
          onChangePerPage={onChangePerPage}
          isFilterActive={isFilterActive}
          onFilterReset={onFilterReset}
        />
      </Box>
    </div>
  );
}

export default Graph;
