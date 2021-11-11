import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { Grid, Paper, Tooltip } from "@mui/material";

import { AuthContext } from "../context/AuthContext";
import "./QuizList.css";
import "../styles/style.css";

const checkProgress = (record, chapterId) =>
  record && record[chapterId] && record[chapterId].some((each) => each === null)
    ? "bg-blue"
    : record && Object.keys(record).includes(chapterId)
    ? "bg-yellow"
    : "";

const QuizItem = ({ chapterId }) => {
  const { record } = useContext(AuthContext);

  useEffect((_) => {
    if (!record) return;
  }, [record]);
  
  return (
    <Grid className="item-grid">
      <Tooltip
        title={
          record &&
          record[chapterId] &&
          record[chapterId].some((each) => each === null)
            ? "진행중"
            : record && Object.keys(record).includes(chapterId)
            ? "완료"
            : ""
        }
        followCursor
      >
        <Paper className={`item-paper ${checkProgress(record, chapterId)}`}>
          <Link to={`/quiz/${chapterId}`}>챕터{chapterId.split("_")[1]}</Link>
        </Paper>
      </Tooltip>
    </Grid>
  );
};

export default QuizItem;
