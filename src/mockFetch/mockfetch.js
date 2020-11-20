const USER_NAME = "Vladimir";
const USER_PASSWORD = "admin";
const COUNT_OF_RECORDS = 500;
const DAY_INTERVAL = 1;
const HOURS_PER_DAY = 24;
const MINUTES = 0;
const YEAR = 2020;
const MONTH = 8;
const SUMM_INTERVAL = 3000;
const DEFAULT_NUM_OF_RECORDS = 10;
const MAX_RANGE = 15984000000;
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

  create(numOfRecords = DEFAULT_NUM_OF_RECORDS) {
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
  filterByDate(dateRange){
    const start = dateRange.start;
    const end = dateRange.end;
    const data = this.data.filter(item => {
        if(item.date >= start && item.date <= end){
          return true;
        }
        else{
          const d1 = new Date(item.date);
          const d2 = new Date(start);
          const d3 = new Date(end);
          if((d1.getDate() === d2.getDate() && 
             d1.getMonth() === d2.getMonth() &&
             d1.getFullYear() === d2.getFullYear()) ||

             (d3.getDate() === d1.getDate() &&
              d3.getMonth() === d1.getMonth() &&
              d3.getFullYear() === d1.getFullYear())
            ) return true;
        } 
        return false;
      });
    return data.reverse();
  }
  filterByDefault(){
    const newDate = new Date();
    const dateMothAgo = new Date();
    dateMothAgo.setMonth(newDate.getMonth() - 1);
    dateMothAgo.setDate(newDate.getDate() - 1);
    const dateMothAgoValue = dateMothAgo.valueOf();
    const dateNowValue = newDate.valueOf();
    const data = this.data.filter(item => {
        if(item.date >= dateMothAgoValue && item.date<= dateNowValue) return true;
        return false;
      });
    return data.reverse();
  }
}

function checkValid(range){
  if(Math.abs(range.start - range.end) > MAX_RANGE) return false;
  return true;
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
      if(payload.dateRange && checkValid(payload.dateRange)){
        filtredData = mockdata.filterByDate(payload.dateRange);
      }
      else{
        filtredData = mockdata.filterByDefault();
      }
      return Promise.resolve({
        data: filtredData,
        message: "auth is ok",
        status: "ok",
      });
    } else {
      return Promise.resolve({
        data: [],
        message: "User Auth EROR!!",
        status: "error",
      });
    }
  },
};
export default fetchMock;
