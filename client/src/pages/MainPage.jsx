import React, { useState, useEffect } from "react";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";

import QuizList from "../components/QuizList";
import logoImg from "../image/logo.gif";

const useStyles = makeStyles((theme) => ({
  headline: {
    textAlign: "center",
  },
  logo: {
    width: 140,
    margin: "auto",
    display: "block",
  },
  paper: {
    display: "flex",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));
const MainPage = () => {
  const classes = useStyles();
  const [subjectUrl, setSubjectUrl] = useState("/quiz/v2");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    let isComplete = false;
    async function get() {
      const { data } = await axios.get(subjectUrl);
      if (!isComplete) setSubjects(data.data.group_by_state.buckets);
    }
    get();
    return () => (isComplete = true);
  }, [subjectUrl]);

  console.log(subjects);
  return (
    <div>
      <h2 className={classes.headline}>재학생들을 위한 기출문제 웹사이트</h2>
      <img className={classes.logo} src={logoImg} alt="" />
      <Paper component="form" className={classes.paper}>
        <InputBase className={classes.input} />
        <IconButton type="submit">
          <SearchIcon />
        </IconButton>
      </Paper>
      {subjects.map((value) => {
        return <QuizList key={value.key} quizInfo={value} />;
      })}
    </div>
  );
};

export default MainPage;
