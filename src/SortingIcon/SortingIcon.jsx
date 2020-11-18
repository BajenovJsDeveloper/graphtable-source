import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

function SortingIcon({ direction, clickSort, name, active }) {
  let color = active === name ? "secondary" : "disabled";
  return (
    <IconButton
      onClick={() => clickSort(name)}
      disabled={false}
      aria-label="Sorting"
      size="small"
    >
      {direction === "asc" ? (
        <ExpandMoreIcon color={color} />
      ) : (
        <ExpandLessIcon color={color} />
      )}
    </IconButton>
  );
}

export default SortingIcon;
