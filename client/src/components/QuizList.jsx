import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import { Grid, Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { yellow, blue } from "@mui/material/colors";

import { AuthContext } from "../context/AuthContext";

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
    "& .MuiPaper-root": {      
    },
    backgroundColor: yellow[300],
    padding: theme.spacing(3),
  },
  proceedPaper: {
    padding: theme.spacing(3),
    backgroundColor: blue[300],
  },
}));

// quizInfo memorize해서 넘기기
const QuizList = ({ quizInfo }) => {
  const classes = useStyles();
  const { record } = useContext(AuthContext);
  const chapters = quizInfo && quizInfo.group_by_chapter.buckets;

  const QuizItem = ({ chapterId }) => {
    return (
      <Grid className={classes.grid}>
        <Paper
          className={
            record &&
            record[chapterId] &&
            record[chapterId].some((each) => each === null)
              ? classes.proceedPaper
              : record && Object.keys(record).includes(chapterId)
              ? classes.endPaper
              : classes.child
          }
        >
          <Link to={`/quiz/${chapterId}`}>챕터{chapterId.split("_")[1]}</Link>
        </Paper>
      </Grid>
    );
  };
  return (
    <>
      <h3>{quizInfo.key}</h3>
      <ScrollMenu className={classes.root}>
        {chapters.map((chapter) => (
          <QuizItem
            key={chapter.key}
            chapterId={chapter.key}
            className={classes.item}
          />
        ))}
      </ScrollMenu>
    </>
  );
};

export default QuizList;
