const CREDIT_AMOUNT_FIELD = "creditAmount";
const DEBIT_AMOUNT_FIELD = "debitAmount";
const DEFAULT_PER_PAGE = 10;
const DEFAULT_PAGE = 0;
const ALL_PAGES = -1;
const SENDER = 0;
const DEBIT = 0;
const ZERO = 0;
const UNIT = {
  left: "",
  right: "mdl",
};

const projectAPI = {
  getPicesOfChart(data, fieldName) {
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
      points.push(entry);
    }
    points.sort((a, b) => {
      if (a[SENDER] > b[SENDER]) return 1;
      if (a[SENDER] < b[SENDER]) return -1;
      return 0;
    });
    return points;
  },

  sorting(dir, field, dataList) {
    const NEGATIVE_SENSE = -1;
    const POZITIVE_SENSE = 1;
    const sign = dir === "desc" ? POZITIVE_SENSE : NEGATIVE_SENSE;
    return dataList.sort((a, b) => {
      if (a[field] > b[field]) return POZITIVE_SENSE * sign;
      if (a[field] < b[field]) return NEGATIVE_SENSE * sign;
      else return ZERO;
    });
  },

  sortingByFieldName(dir, fieldName, rowsPageData) {
    const newDataList = [...rowsPageData];
    switch (fieldName) {
      case "id": {
        this.sorting(dir, "transactionID", newDataList);
        break;
      }
      case "sender": {
        this.sorting(dir, "sender", newDataList);
        break;
      }
      case "date": {
        this.sorting(dir, "date", newDataList);
        break;
      }
      case "credit": {
        this.sorting(dir, "creditAmount", newDataList);
        break;
      }
      case "debit": {
        this.sorting(dir, "debitAmount", newDataList);
        break;
      }
      default: {
        this.sorting(dir, "transactionID", newDataList);
      }
    }
    return newDataList;
  },

  defaultPagination() {
    return {
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE,
      count: ZERO,
    };
  },

  createPage(dataList, paginator) {
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
  },

  chartInit(chartData = [[], []], title = "Graph") {
    const optionData = {
      titleDebit: title,
      titleCredit: title,
      credit: [["Credit", "Credit Graph"], ...chartData[1]],
      debit: [["Debit", "Debit Graph"], ...chartData[0]],
    };
    return optionData;
  },
};

export { projectAPI, UNIT };
