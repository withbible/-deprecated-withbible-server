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

const QuizList = ({ subjects }) => {
  const classes = useStyles();
  const subjectList = subjects.map((subject, index) => (
    <div>
      <h3 key={index}>{subject.key}</h3>
      <Grid container spacing={3}>
        {range(1, Math.floor(subject.doc_count / 2), 1).map((quizChapterId) => (
          <Grid item>
            <Paper className={classes.child}>{quizChapterId}</Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  ));
  return <div>{subjectList}</div>;
};

export default QuizList;
