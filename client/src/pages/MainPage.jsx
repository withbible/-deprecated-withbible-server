import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { Paper, InputBase, IconButton, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { RecordContext } from "../context/RecordContext";
import QuizList from "../components/QuizList";
import logoImg from "../image/logo.gif";
import "./MainPage.css";

const MainPage = (_) => {
  const { setRecord } = useContext(RecordContext);
  const [subjects, setSubjects] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hashTagData] = useState([
    { key: 0, label: "#디자인패턴" },
    { key: 1, label: "#다이어그램" },
  ]);

  useEffect(
    (_) => {
      axios.get("/quiz").then(({ data }) => {
        setSubjects(data.data.buckets);
        setRecord(data.quizRecord);
      });
    },
    [setRecord]
  );

  const onChange = (e) => setSearchKeyword(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios
      .get(searchKeyword ? `/search/${searchKeyword}` : "/quiz")
      .then(({ data }) => {
        setSubjects(data.quiz.buckets);
        setRecord(data.quizRecord);
      });
  };

  const searchHashTag = (hashTagLabel) => async () => {
    await axios
      .get(`/search/synonym/${hashTagLabel.label.substring(1)}`)
      .then(({ data }) => {
        setSubjects(data.data.buckets);
        setRecord(data.quizRecord);
      });
  };

  return (
    <>
      <h2>재학생들을 위한 기출문제 웹사이트</h2>
      <img className="logo-img" src={logoImg} alt="" />
      <Paper>
        {hashTagData.map((data) => {
          return (
            <Chip
              key={data.key}
              label={data.label}
              variant="outlined"
              onClick={searchHashTag(data)}
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

      {subjects.map((value) => (
        <QuizList key={value.key} quizInfo={value} />
      ))}
    </>
  );
};

export default MainPage;
