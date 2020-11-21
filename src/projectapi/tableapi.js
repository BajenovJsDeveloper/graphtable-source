import { UNIT } from "./projectapi";

const FIXED = 0;
const FLOAT = 1;

const tableAPI = {
  toNumberSpacedString(num) {
    if (num !== 0) {
      let numFormated = num.toString().split(".");
      let fix = numFormated[FIXED].split("").reverse();
      let float = numFormated[FLOAT];
      fix = fix.map((digit, idx) =>
        idx % 3 === 0 && idx > 0 ? `${digit} ` : digit
      );
      fix = fix.reverse().join("");
      numFormated[FIXED] = fix;
      numFormated[FLOAT] = float;
      return numFormated.join(".");
    }
    return null;
  },

  dateValueToString(dateValue) {
    return new Date(dateValue).toLocaleDateString();
  },

  reversDirArrow(dir) {
    return dir === "asc" ? "desc" : "asc";
  },

  toNumberWithPrefix(str) {
    if (str !== null)
      return `${UNIT.left.toUpperCase()} ${str} ${UNIT.right.toUpperCase()}`;
    else return "-";
  },

  getDateToString(date) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  },

  getTimeToString(date) {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString();
  },
};

export { tableAPI };
