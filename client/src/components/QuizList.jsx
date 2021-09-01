import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const useStyles = makeStyles((theme) => ({
  child: {
    padding: theme.spacing(3),
  },
}));

const QuizList = ({ quizInfo }) => {
  const classes = useStyles();
  return (
    <>
      <h3>{quizInfo.key}</h3>
      <Grid container spacing={3}>
        {range(1, Math.floor(quizInfo.doc_count / 2), 1).map(
          (quizChapterId, index) => (
            <Grid item key={index}>
              <Paper className={classes.child}>챕터{quizChapterId}</Paper>
            </Grid>
          )
        )}
      </Grid>
    </>
  );
};

export default QuizList;
