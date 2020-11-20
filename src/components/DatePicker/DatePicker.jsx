import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

const StaticDatePicker = ({ onSelect, onCancel }) => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    function onESC(event) {
      if (event.keyCode === 27) {
        onCancel();
      }
    }
    document.addEventListener("keydown", onESC);

    return () => {
      document.removeEventListener("keydown", onESC);
    };
  }, [onCancel]);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    if (start && end) {
      onSelect({ start: start.valueOf(), end: end.valueOf() });
    }
  };
  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      selectsRange
      inline
    />
  );
};

export default StaticDatePicker;
