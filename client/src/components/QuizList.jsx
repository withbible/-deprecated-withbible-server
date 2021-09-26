import React from "react";
import { Link } from "react-router-dom";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

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
}));

const QuizList = ({ quizInfo }) => {
  const classes = useStyles();
  const lastChapterId = Math.floor(quizInfo.doc_count / DIVID_NUM + 1);

  const QuizItem = ({ chapterId }) => {
    return (
      <Grid className={classes.grid}>
        <Paper className={classes.child}>
          <Link
            to={`/quiz/v2/content/${SUBJECT_CODE[quizInfo.key] + chapterId}`}
          >
            챕터{chapterId}
          </Link>
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
        { quizInfo.doc_count % DIVID_NUM && <QuizItem
          key={lastChapterId}
          chapterId={lastChapterId}
          className={classes.item}
        />}
      </ScrollMenu>
    </>
  );
};

export default QuizList;
