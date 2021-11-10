import React, { useContext }  from "react";
import { Link } from "react-router-dom";

import { Grid, Paper, Tooltip } from "@mui/material";

import { AuthContext } from "../context/AuthContext";
import "./QuizList.css";

const QuizItem = ({ chapterId }) => {
  const { record } = useContext(AuthContext);
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
        <Paper
          className={
            record &&
            record[chapterId] &&
            record[chapterId].some((each) => each === null)
              ? "item-paper-proceed"
              : record && Object.keys(record).includes(chapterId)
              ? "item-paper-end"
              : "item-paper"
          }
        >
          <Link to={`/quiz/${chapterId}`}>챕터{chapterId.split("_")[1]}</Link>
        </Paper>
      </Tooltip>
    </Grid>
  );
};

export default QuizItem;
