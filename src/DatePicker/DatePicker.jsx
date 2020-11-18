import React, { useEffect } from "react";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const StaticDatePicker = ({ onSelect, onCancel, date }) => {
  const onSelectDate = (newDate) => {
    onSelect(newDate);
  };
  useEffect(()=>{
    function onESC(event) {
      if(event.keyCode === 27){
        onCancel();
      }
    }
    document.addEventListener('keydown',onESC);

    return () => {document.removeEventListener('keydown',onESC)}
  },[onCancel]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        autoOk
        variant="static"
        openTo="date"
        value={date}
        onChange={onSelectDate}
      />
    </MuiPickersUtilsProvider>
  );
};

export default StaticDatePicker;
