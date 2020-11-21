import React, { useState } from "react";
import FilterListIcon from "@material-ui/icons/FilterList";
import DatePicker from "../DatePicker/DatePicker";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  filterIcon: {
    marginRight: 20,
    padding: 7,
  },
});

function FilterButton({ onFilterSort }) {
  const classes = useStyles();
  const [isShow, setIsShow] = useState(false);
  const date = new Date();
  const handleClick = () => {
    setIsShow(true);
  };
  const onSelect = (dateRange) => {
    setIsShow(false);
    onFilterSort(dateRange);
  };
  const onCancel = () => {
    setIsShow(false);
  };
  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        disabled={false}
        aria-label="Filter"
        className={classes.filterIcon}
        title="Filter by date"
      >
        <FilterListIcon color="secondary" />
      </IconButton>
      {isShow && (
        <div className="date-picker">
          <DatePicker date={date} onSelect={onSelect} onCancel={onCancel} />
        </div>
      )}
    </React.Fragment>
  );
}

export default FilterButton;
