import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";

import { Paper, InputBase, IconButton, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { AuthContext } from "../context/AuthContext";
import QuizList from "../components/QuizList";
import logoImg from "../image/logo.gif";
import "./MainPage.css";


const MainPage = (_) => {
  const { setRecord } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hashData,] = useState([
    { key: 0, label: '#공학' },
    { key: 1, label: '#다이어그램' },
  ]);
  

  useEffect(
    (_) => {
      console.log("am i render");
      axios.get("/quiz/v2").then(({ data }) => {
        setSubjects(data.quiz.buckets);
        setRecord(data.quizRecord);
      });
    },
    [setRecord]
  );

  const onChange = (e) => {
    setSearchKeyword(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.get(`/quiz/v2/${searchKeyword}`).then(({ data }) => {
      setSubjects(data.quiz.buckets);
      setRecord(data.quizRecord);
    });
  };

  const handleClick = (hashLabel) => async () => {
    console.info('You clicked the Chip.');
    console.log(hashLabel.label.substring(1));
    await axios.get(`/quiz/v2/hash/${hashLabel.label.substring(1)}`).then(({ data }) => {
      setSubjects(data.quiz.buckets);
      setRecord(data.quizRecord);
    });
  };

  return (
    <div>
      <h2>재학생들을 위한 기출문제 웹사이트</h2>
      <img className="logo-img" src={logoImg} alt="" />
    <Paper>
      {hashData.map((data) => {
        return (
            <Chip
              key={data.key}
              label={data.label}
              variant="outlined"
              onClick={handleClick(data)}
              style={{marginRight:10}}
            />
        );
      })}
    </Paper>
      <Paper component="form" className="search-bar" onSubmit={onSubmit}>
        <InputBase className="search-input" onChange={onChange} />
        <IconButton type="submit">
          <SearchIcon />
        </IconButton>
      </Paper>

      {subjects.map((value) => 
          <QuizList key={value.key} quizInfo={value} />
      )}
    </div>
  );
};

export default MainPage;
