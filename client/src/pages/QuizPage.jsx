import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuizPage = (_) => {
  const { chapterId } = useParams();
  const [title, setTitle] = useState("");
  const [quizTable, setQuizTable] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState("");
  const [quizNum, setQuizNum] = useState(0);

  useEffect(
    (_) => {
      axios.get(`/quiz/v2/content/${chapterId}`).then(({ data }) => {
        setQuizTable({ ...data.data.hits });
        setTitle(data.data.hits[0]["_source"]["subject_category"]);
        setCurrentQuiz(data.data.hits[0]["_source"]["instruction"]);
      });
    },
    [chapterId]
  );
  useEffect(
    (_) => {
      if (quizTable === {}) return;
      setTimeout((_) => {
        setCurrentQuiz(quizTable[quizNum]["_source"]["instruction"]);
      }, 0);
    },
    [quizTable, quizNum]
  );
  console.log(quizTable);
  // console.log(quizNum);
  return (
    <>
      <h2>{title}</h2>
      <h3>{currentQuiz}</h3>
      <button onClick={(_) => setQuizNum(quizNum + 1)}>next</button>
    </>
  );
};

export default QuizPage;
