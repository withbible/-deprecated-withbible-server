import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

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

  const QuizItem = ({ chapterId }) => {
    return (
      <Grid className={classes.grid}>
        <Paper className={classes.child}>챕터{chapterId}</Paper>
      </Grid>
    );
  };
  return (
    <>
      <h3>{quizInfo.key}</h3>
      <ScrollMenu className={classes.root}>
        {range(1, Math.floor(quizInfo.doc_count / 2), 1).map(
          (quizChapterId) => (
            <QuizItem
              key={quizChapterId}
              chapterId={quizChapterId}
              className={classes.item}
            />
          )
        )}
      </ScrollMenu>
    </>
  );
};

export default QuizList;
