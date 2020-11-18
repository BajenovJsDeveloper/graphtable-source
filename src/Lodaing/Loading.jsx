import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import Box from "@material-ui/core/Box";
import "./loading.css";

const setStyle = makeStyles({
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 200,
  },
  icon: {
    fontSize: "3rem",
  },
});

export default function Loading({ isLoading }) {
  const classes = setStyle();
  if (!isLoading) return null;
  return (
    <Box className={classes.loading}>
      <HourglassEmptyIcon id="load" />
    </Box>
  );
}
