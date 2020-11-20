import Chart from "chart.js";
import { useEffect, useState } from "react";
import mockFetch from "../mockFetch/mockfetch.js";
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
const ZERO = 0;
const SENDER = 0;
const FIELD_VALUE = 1;
const ALL_PAGES = -1;

function creatGraph(itemId, values) {
  const ctx = document.getElementById(itemId).getContext("2d");
  const labels = values.map((i, index) => i[SENDER]);
  const chunks = values.map((i, index) => i[FIELD_VALUE]);
  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: chunks,
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
  const NUMBER = 1;
  const points = [];
  const name = fieldName === DEBIT ? DEBIT_AMOUNT_FIELD : CREDIT_AMOUNT_FIELD;
  const map = new Map();
  data.forEach((item) => {
    let sum = 0.0;
    if (map.has(item.sender)) {
      sum = map.get(item.sender) + Number.parseFloat(item[name]);
      map.set(item.sender, sum);
    } else {
      map.set(item.sender, item[name]);
    }
  });
  for (let entry of map) {
    entry[NUMBER] = entry[NUMBER].toFixed(2);
    points.push(entry);
  }
  points.sort((a, b) => {
    if (a[SENDER] > b[SENDER]) return 1;
    if (a[SENDER] < b[SENDER]) return -1;
    return 0;
  });
  console.log(points);
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

function defaultPagination() {
  return {
    page: DEFAULT_PAGE,
    perPage: DEFAULT_PER_PAGE,
    count: ZERO,
  };
}

function createPage(dataList, paginator) {
  let partialData = [];
  let len = dataList.length;
  let start, count;
  let perPage = paginator.perPage;
  let page = paginator.page;

  if (perPage === DEFAULT_PAGE) {
    perPage = DEFAULT_PER_PAGE;
    page = DEFAULT_PAGE;
  }
  if (perPage >= len) page = DEFAULT_PAGE;
  if (perPage === ALL_PAGES) perPage = len;
  start = page * perPage;
  count = len >= start + perPage ? start + perPage : len;
  for (let i = start; i < count; i++) {
    partialData.push(dataList[i]);
  }
  perPage = paginator.perPage !== ALL_PAGES ? perPage : paginator.perPage;
  return partialData;
}

function Graph() {
  const [dataList, setData] = useState([]);
  const [rowsPageData, setRowsPageData] = useState([]);
  const [paginator, setPaginator] = useState(() => defaultPagination());
  const [isLoading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date().toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  });
  const showGpaphs = dataList.length > 0 ? true : false;

  const onFilterSort = (range) => {
    getDataFromServer(URL, range);
  };

  const handleSorting = (dir, fieldName, rows) => {
    const sortedData = sortingByFieldName(dir, fieldName, dataList);
    setData(sortedData);
    const newPaginator = { ...paginator, page: 0 };
    setRowsPageData(createPage(sortedData, newPaginator));
  };

  const onChangePage = (e, page) => {
    const newPginator = { ...paginator, page };
    setRowsPageData(createPage(dataList, newPginator));
    setPaginator(newPginator);
  };

  const onChangePerPage = (perPage) => {
    const pagesOnPage = Number(perPage.target.value);
    const newPginator = { ...paginator, page: 0, perPage: pagesOnPage };
    setRowsPageData(createPage(dataList, newPginator));
    setPaginator(newPginator);
  };

  const getDataFromServer = (url, range) => {
    const payload = {
      userName: USER_NAME,
      userPassword: USER_PASSWORD,
    };
    if (range) payload.dateRange = range;
    setLoading(true);
    mockFetch.get(url, payload).then((response) => {
      if (response.status === "ok") {
        setTimeout(() => {
          setData(response.data);
          setPaginator((prev) => ({
            ...prev,
            page: 0,
            count: response.data.length,
            perPage: prev.perPage,
          }));
          setLoading(false);
          console.log("from server: ", response, range);
          if (range) setDateRange(range);
          else if (response.range) setDateRange(response.range);
        }, SERVER_DELAY_TIME);
      } else {
        throw new Error("Something is wrong!!! " + response.message);
      }
    });
  };

  useEffect(() => {
    if (dataList.length > 0) {
      setRowsPageData(createPage(dataList, paginator));
    }
  }, [dataList]);

  useEffect(() => {
    getDataFromServer(URL);
  }, []);

  useEffect(() => {
    if (dataList.length > ZERO) {
      const valuesCredit = getPicesOfChart(dataList, DEBIT);
      const valuesDebit = getPicesOfChart(dataList, CREDIT);
      const destroyCredit = creatGraph("chart-credit", valuesCredit);
      const destroyDebit = creatGraph("chart-debit", valuesDebit);
      return () => {
        destroyDebit();
        destroyCredit();
      };
    }
  }, [dateRange]);

  return (
    <div className="App">
      <Loading isLoading={isLoading} />
      {showGpaphs && (
        <Box
          className="App__graph-container"
          fontFamily="Roboto"
          fontSize={20}
          p={1}
        >
          <Box className="App__graphic">
            Debit Amount
            <canvas id="chart-credit"></canvas>
          </Box>
          <Box className="App__graphic">
            Credit Amount
            <canvas id="chart-debit"></canvas>
          </Box>
        </Box>
      )}
      <Box className="App__table">
        <TableGrid
          rowsPageData={rowsPageData}
          onFilterSort={onFilterSort}
          paginator={paginator}
          handleSorting={handleSorting}
          onChangePage={onChangePage}
          onChangePerPage={onChangePerPage}
          dateRange={dateRange}
        />
      </Box>
    </div>
  );
}

export default Graph;
