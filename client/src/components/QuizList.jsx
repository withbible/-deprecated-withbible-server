import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import { Grid, Paper } from "@mui/material";

import { AuthContext } from "../context/AuthContext";
import chatImg from "../image/ul-comment-message.png";
import "./QuizList.css";

// quizInfo memorize해서 넘기기
const QuizList = ({ quizInfo }) => {
  const { record } = useContext(AuthContext);
  const chapters = quizInfo && quizInfo.group_by_chapter.buckets;

  const QuizItem = ({ chapterId }) => {
    return (
      <Grid className="item-grid">
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
      </Grid>
    );
  };
  return (
    <>
      <div className="quiz-list-container">
        <h3>{quizInfo.key}</h3>
        <a href="http://localhost:5001">
          <img className="chat-img" src={chatImg} alt="" />
        </a>
      </div>

      <ScrollMenu>
        {chapters.map((chapter) => (
          <QuizItem
            key={chapter.key}
            chapterId={chapter.key}
            className="item"
          />
        ))}
      </ScrollMenu>
    </>
  );
};

export default QuizList;
