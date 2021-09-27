import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Button, Checkbox, Paper } from "@material-ui/core";

function getShuffleAnswerKeys() {
  const candidate = ["answer", "wrong_1", "wrong_2", "wrong_3"];
  const shuffle = [];
  while (candidate.length > 0)
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.legnth), 1)[0]
    );
  return [...shuffle.slice()];
}

const QuizPage = memo((_) => {
  const { chapterId } = useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [currentQuiz, setCurrentQuiz] = useState({});
  const [quizNum, setQuizNum] = useState(0);

  const [quizTable, setQuizTable] = useState({});
  const [currentInstruction, setCurrentInstruction] = useState("");
  const shuffleAnswerKeys = useMemo((_) => getShuffleAnswerKeys(), []);
  const [shuffleAnswer, setShuffleAnswer] = useState(shuffleAnswerKeys);
  const [shuffleAnswerUI, setShuffleAnswerUI] = useState([]);

  const [selectedValue, setSelectedValue] = useState("");
  const isFirstRender = useRef(true);

  const quizLength = Object.keys(quizTable).length;
  const minMove = quizNum === 0;
  const maxMove = quizNum + 1 === quizLength;

  useEffect(
    (_) => {
      axios
        .get(`/quiz/v2/content/${chapterId}`)
        .then(({ data }) => {
          if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
          }
          setQuizTable({ ...data.data.hits });
          setQuizTitle(data.data.hits[0]["_source"]["subject_category"]);
          setCurrentInstruction(data.data.hits[0]["_source"]["instruction"]);
        })
        .catch((err) => console.log(err.message));
    },
    [chapterId]
  );
  useEffect(
    (_) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      console.log("is render");
      if (!selectedValue) setSelectedValue(quizTable[quizNum]["cache"]);

      /**
       * Dev
          setCurrentQuiz((_) => {
            if (!selectedValue) setSelectedValue(quizTable[quizNum]["cache"]);
            return { ...quizTable[quizNum] };
        });
       */
      setShuffleAnswerUI([
        ...shuffleAnswer.map((value, index) => {
          return (
            <div key={index}>
              {/* 체크해제 가능한가 */}
              <Checkbox
                checked={selectedValue === index.toString()}
                value={index.toString()}
                onChange={(e) => {
                  setSelectedValue(e.target.value);
                }}
              />
              {quizTable[quizNum]["_source"][value]}
            </div>
          );
        }),
      ]);
    },
    [quizTable, quizNum, shuffleAnswer, selectedValue]
  );

  const movePrevious = (_) => {
    setQuizNum((quizNum) => quizNum - 1);
    setSelectedValue("");
  };
  const moveNext = (_) => {
    setQuizNum((quizNum) => quizNum + 1);
    quizTable[quizNum]["cache"] = selectedValue;
    setSelectedValue("");
  };
  const onClick = (_) => {
    // cache 집계
  };
  return (
    <>
      <div style={{ overflow: "hidden", padding: "20px 0" }}>
        <h2 style={{ float: "left", margin: 0 }}>
          {quizTitle} (챕터 {chapterId.charAt(chapterId.length - 1)})
        </h2>
        <span style={{ float: "right" }}>
          Question # {quizNum + 1} / {Object.keys(quizTable).length}
        </span>
      </div>
      <Paper elevation={4}>
        <h3>{currentInstruction}</h3>

        {shuffleAnswerUI}

        <div style={{ marginTop: 20 }}>
          {/* 새로고침, 홈으로 갈시 저장 alert 필요 */}
          <Button
            variant="outlined"
            style={{ float: "left" }}
            color="primary"
            disabled={minMove && true}
            onClick={movePrevious}
          >
            Previous
          </Button>
          {maxMove ? (
            <Button
              variant="contained"
              style={{ float: "right" }}
              color="secondary"
              onClick={onClick}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="outlined"
              style={{ float: "right" }}
              color="primary"
              disabled={maxMove && true}
              onClick={moveNext}
            >
              Next
            </Button>
          )}
        </div>
      </Paper>
    </>
  );
});

export default QuizPage;
