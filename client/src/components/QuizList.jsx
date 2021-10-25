import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { yellow, blue } from "@material-ui/core/colors";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import { AuthContext } from "../context/AuthContext";

const DIVID_NUM = 10;
const SUBJECT_CODE = {
  "소프트웨어 설계": "sd_0",
  "소프트웨어 개발": "sw_0",
  "데이터베이스 활용": "db_0",
  "정보시스템 구축관리": "im_0",
};

const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const useStyles = makeStyles((theme) => ({
  root: {},
  item: {
    overflowX: "hidden",
  },
  grid: {
    width: 100,
    margin: "0px 20px 10px 0px",
  },
  child: {
    padding: theme.spacing(3),
  },
  endPaper: {
    padding: theme.spacing(3),
    backgroundColor: yellow[300],
  },
  proceedPaper: {
    padding: theme.spacing(3),
    backgroundColor: blue[300],
  },
}));

const QuizList = ({ quizInfo }) => {
  const classes = useStyles();
  const { record } = useContext(AuthContext);
  const lastChapterId = Math.floor(quizInfo.doc_count / DIVID_NUM + 1);

  const QuizItem = ({ chapterId }) => {
    const CHAPTER_CODE = SUBJECT_CODE[quizInfo.key] + chapterId;
    return (
      <Grid className={classes.grid}>
        <Paper
          className={
            record &&
            record[CHAPTER_CODE] &&
            record[CHAPTER_CODE].some((each) => each === null)
              ? classes.proceedPaper
              : record && Object.keys(record).includes(CHAPTER_CODE)
              ? classes.endPaper
              : classes.child
          }
        >
          <Link to={`/quiz/${CHAPTER_CODE}`}>챕터{chapterId}</Link>
        </Paper>
      </Grid>
    );
  };

  return (
    <>
      <h3>{quizInfo.key}</h3>
      <ScrollMenu className={classes.root}>
        {range(1, Math.floor(quizInfo.doc_count / DIVID_NUM), 1).map(
          (quizChapterId) => (
            <QuizItem
              key={quizChapterId}
              chapterId={quizChapterId}
              className={classes.item}
            />
          )
        )}
        {lastChapterId && (
          <QuizItem
            key={lastChapterId}
            chapterId={lastChapterId}
            className={classes.item}
          />
        )}
      </ScrollMenu>
    </>
  );
};

export default QuizList;
