const USER_NAME = "Vladimir";
const USER_PASSWORD = "admin";
const COUNT_OF_RECORDS = 125;
const ALL_PAGES = -1;
const PER_PAGE_DEFAULT = 10;
const DAY_INTERVAL = 1;
const HOURS_PER_DAY = 24;
const MINUTES = 0;
const YEAR = 2020;
const MONTH = 1;
const SUMM_INTERVAL = 3000;
const DEFAULT_PAGE = 0;
const DEFAULT_MUN_OF_RECORDS = 10;
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
  }
  create(numOfRecords = DEFAULT_MUN_OF_RECORDS) {
    const len = this.senders.length;
    for (let i = 1; i <= numOfRecords; i++) {
      this.data.push({
        transactionID: i,
        date: getLocalDateValue(),
        debitAmount: Math.round(Math.random() * SUMM_INTERVAL),
        creditAmount: Math.round(Math.random() * SUMM_INTERVAL),
        sender: this.senders[Math.floor(Math.random() * len)],
      });
    }
  }
  getMockData() {
    return this.data;
  }
}

function getPartial(data, page = DEFAULT_PAGE, pagesOnPage = PER_PAGE_DEFAULT) {
  let partialData = [];
  let len = data.length;
  let start, count;
  let perPage = pagesOnPage;

  if (perPage === DEFAULT_PAGE) {
    perPage = PER_PAGE_DEFAULT;
    page = DEFAULT_PAGE;
  }
  if (perPage >= len) page = DEFAULT_PAGE;
  if (perPage === ALL_PAGES) perPage = len;
  start = page * perPage;
  count = len >= start + perPage ? start + perPage : len;
  for (let i = start; i < count; i++) {
    partialData.push(data[i]);
  }
  perPage = pagesOnPage !== ALL_PAGES ? perPage : pagesOnPage;
  return { data: partialData, page, perPage };
}

const mockdata = new MockData(["MICB", "MAIB", "EXB", "ECB", "VICB", "IMPORT-SRL", "FORDEXPRESS"]);
mockdata.create(COUNT_OF_RECORDS);

const fetchMock = {
  get: (url, payload) => {
    let data = mockdata.getMockData();
    let partialData = getPartial(data, payload.page, payload.perPage);
    if (
      payload.userName === USER_NAME &&
      payload.userPassword === USER_PASSWORD
    ) {
      return Promise.resolve({
        message: "auth is ok",
        status: "ok",
        data: partialData.data,
        page: partialData.page,
        perPage: partialData.perPage,
        count: data.length,
      });
    } else {
      return Promise.resolve({
        data: {},
        message: "User Auth EROR!!",
        status: "error",
      });
    }
  },
};
export default fetchMock;
