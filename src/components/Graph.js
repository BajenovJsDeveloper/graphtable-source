import { useEffect, useState } from "react";
import mockFetch from "../mockFetch/mockfetch.js";
import TableGrid from "./TableGrid/TableGrid";
import Box from "@material-ui/core/Box";
import Loading from "./Lodaing/Loading";
import Chart from "react-google-charts";
import { projectAPI } from "../projectapi/projectapi";
import "./graph.css";

const URL = "https://graphs.com";
const SERVER_DELAY_TIME = 1000;
const USER_PASSWORD = "admin";
const USER_NAME = "Vladimir";
const CREDIT = 1;
const DEBIT = 0;
const ZERO = 0;

function Graph() {
  const [dataList, setData] = useState([]);
  const [rowsPageData, setRowsPageData] = useState([]);
  const [paginator, setPaginator] = useState(() =>
    projectAPI.defaultPagination()
  );
  const [isLoading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date().toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  });
  const [chartData, setChartData] = useState(projectAPI.chartInit());
  const showGpaphs = dataList.length > 0 ? true : false;

  const chartOption = {
    title: chartData.title,
    legend: { position: "left" },
  };

  const onFilterSort = (range) => {
    getDataFromServer(URL, range);
  };

  const handleSorting = (dir, fieldName) => {
    const sortedData = projectAPI.sortingByFieldName(dir, fieldName, dataList);
    setData(sortedData);
    const newPaginator = { ...paginator, page: 0 };
    setPaginator(newPaginator);
  };

  const onChangePage = (e, page) => {
    const newPginator = { ...paginator, page };
    setRowsPageData(projectAPI.createPage(dataList, newPginator));
    setPaginator(newPginator);
  };

  const onChangePerPage = (perPage) => {
    const pagesOnPage = Number(perPage.target.value);
    const newPginator = { ...paginator, page: 0, perPage: pagesOnPage };
    setRowsPageData(projectAPI.createPage(dataList, newPginator));
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
          console.log(
            "This line for developing! Data From Server: ",
            response,
            range
          );
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
      setRowsPageData(projectAPI.createPage(dataList, paginator));
    }
  }, [dataList, paginator]);

  useEffect(() => {
    getDataFromServer(URL);
  }, []);

  useEffect(() => {
    if (dataList.length > ZERO) {
      const valuesDebit = projectAPI.getPicesOfChart(dataList, DEBIT);
      const valuesCredit = projectAPI.getPicesOfChart(dataList, CREDIT);
      setChartData(
        projectAPI.chartInit([valuesDebit, valuesCredit], ["Debit", "Credit"])
      );
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
            {
              <Chart
                width={"400px"}
                height={"250px"}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={chartData.debit}
                options={chartOption}
                rootProps={{ "data-testid": "1" }}
              />
            }
          </Box>
          <Box className="App__graphic">
            Credit Amount
            <Chart
              width={"400px"}
              height={"250px"}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={chartData.credit}
              options={chartOption}
              rootProps={{ "data-testid": "1" }}
            />
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
