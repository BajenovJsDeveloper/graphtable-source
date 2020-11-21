const USER_NAME = "Vladimir";
const USER_PASSWORD = "admin";
const COUNT_OF_RECORDS = 1000;
const DAY_INTERVAL = 1;
const HOURS_PER_DAY = 24;
const MINUTES = 0;
const YEAR = 2020;
const MONTH = 8;
const SUMM_INTERVAL = 10000.0;
const DEFAULT_NUM_OF_RECORDS = 10;
const MAX_DATE_RANGE = 15984000000;
const START = 0;
const FLOAT_LENGTH = 2;
let dTcount = 1;

function getLocalDateValue() {
  const day = Math.round(Math.random() * DAY_INTERVAL);
  const time = Math.ceil(Math.random() * HOURS_PER_DAY);
  dTcount += day;
  const newDate = new Date(YEAR, MONTH, dTcount, time, MINUTES).valueOf();
  return newDate;
}

class MockData {
  constructor(senders) {
    this.data = [];
    this.senders = senders;
    this.message = "";
  }

  create(numOfRecords = DEFAULT_NUM_OF_RECORDS) {
    const len = this.senders.length;
    for (let i = 1; i <= numOfRecords; i++) {
      let debitAmount = (Math.random() * SUMM_INTERVAL).toFixed(FLOAT_LENGTH);
      let creditAmount = (Math.random() * SUMM_INTERVAL).toFixed(FLOAT_LENGTH);
      debitAmount = Number(debitAmount);
      creditAmount = Number(creditAmount);
      const tranzaction = Math.round(Math.random() * 1);
      this.data.push({
        transactionID: i,
        date: getLocalDateValue(),
        debitAmount: tranzaction === 0 ? debitAmount : 0,
        creditAmount: tranzaction === 1 ? creditAmount : 0,
        sender: this.senders[Math.floor(Math.random() * len)],
      });
    }
  }
  getMockData() {
    return this.data;
  }
  setMessage(msg) {
    this.message = msg;
  }
  resetMessage() {
    this.message = "";
  }
  getMessage() {
    return this.message;
  }
  filterByDate(dateRange) {
    this.resetMessage();
    const start = dateRange.start;
    const end = dateRange.end;
    const data = this.data.filter((item) => {
      if (item.date >= start && item.date <= end) {
        return true;
      } else {
        const d1 = new Date(item.date);
        const d2 = new Date(start);
        const d3 = new Date(end);
        if (
          (d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()) ||
          (d3.getDate() === d1.getDate() &&
            d3.getMonth() === d1.getMonth() &&
            d3.getFullYear() === d1.getFullYear())
        )
          return true;
      }
      return false;
    });
    return data.reverse();
  }
  filterByDefault() {
    this.resetMessage();
    const newDate = new Date();
    const dateMothAgo = new Date();
    dateMothAgo.setMonth(newDate.getMonth() - 1);
    dateMothAgo.setDate(newDate.getDate() - 1);
    const dateMothAgoValue = dateMothAgo.valueOf();
    const dateNowValue = newDate.valueOf();
    const data = this.data.filter((item) => {
      if (item.date >= dateMothAgoValue && item.date <= dateNowValue)
        return true;
      return false;
    });
    return data.reverse();
  }
  determinateSize(data) {
    const chunkData = [...data];
    if (data.length > 200) {
      chunkData.splice(200);
      this.setMessage("Too more data.");
    }
    return chunkData;
  }
  checkValid(range) {
    if (Math.abs(range.start - range.end) > MAX_DATE_RANGE) return false;
    return true;
  }
}

const mockdata = new MockData([
  "MICB",
  "MAIB",
  "EXB",
  "ECB",
  "VICB",
  "IMPORT-SRL",
  "FORDEXPRESS",
]);

mockdata.create(COUNT_OF_RECORDS);

const fetchMock = {
  get: (url, payload) => {
    if (
      payload.userName === USER_NAME &&
      payload.userPassword === USER_PASSWORD
    ) {
      let filtredData = [];
      let start = "";
      let end = "";
      if (payload.dateRange && mockdata.checkValid(payload.dateRange)) {
        filtredData = mockdata.determinateSize(
          mockdata.filterByDate(payload.dateRange)
        );
      } else {
        filtredData = mockdata.determinateSize(mockdata.filterByDefault());
        end = filtredData[START].date;
        start = filtredData[filtredData.length - 1].date;
      }

      return Promise.resolve({
        data: filtredData,
        message: "auth is ok",
        status: "ok",
        range: { start, end },
        dataMsg: mockdata.getMessage(),
      });
    } else {
      return Promise.resolve({
        data: [],
        message: "User Auth EROR!!",
        status: "error",
        dataMsg: mockdata.getMessage(),
      });
    }
  },
};
export default fetchMock;
