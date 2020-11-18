import React, { useState } from "react";
import FilterListIcon from "@material-ui/icons/FilterList";
import DatePicker from "../DatePicker/DatePicker";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  filterIcon: {
    marginLeft: 30,
    position: "relative",
  },
});

function FilterButton({ isFilterActive, onFilterSort, onFilterReset }) {
  const classes = useStyles();
  const [isShow, setIsShow] = useState(false);
  const [date, setNewDate] = useState(new Date());

  const handleClick = () => {
    if (isFilterActive) {
      onFilterReset();
    } else {
      setIsShow((prev) => !prev);
    }
  };
  const onSelect = (dateChanged) => {
    setIsShow(false);
    setNewDate(dateChanged);
    onFilterSort(dateChanged);
  };
  const onCancel = () => {
    setIsShow(false);
  }
  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        disabled={false}
        aria-label="Filter"
        className={classes.filterIcon}
      >
        <FilterListIcon color={!isFilterActive ? "disabled" : "secondary"} />
      </IconButton>
      {isShow && !isFilterActive && (
        <div className="date-picker">
          <DatePicker date={date} onSelect={onSelect} onCancel={onCancel}/>
        </div>
      )}
    </React.Fragment>
  );
}

export default FilterButton;
