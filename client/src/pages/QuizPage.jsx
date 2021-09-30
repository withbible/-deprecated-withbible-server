import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { useParams, Prompt } from "react-router-dom";
import axios from "axios";

import { Button, Checkbox, Paper } from "@material-ui/core";

let CANDIDATE = ["answer", "wrong_1", "wrong_2", "wrong_3"];

function fisherYatesShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return [...arr];
}

const QuizPage = memo((_) => {
  const { chapterId } = useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizInstruction, setQuizInstruction] = useState("");
  const [quizNum, setQuizNum] = useState(0);
  const [quizTable, setQuizTable] = useState({});
  const [shuffleAnswerKeys, setShuffleAnswerKeys] = useState({});
  const [shuffleAnswerUI, setShuffleAnswerUI] = useState([]);

  const [selectedValue, setSelectedValue] = useState("");
  const [isNotSubmit, setIsNotSubmit] = useState(true);
  const isFirstRender = useRef(true);

  // Need Map use size
  const quizLength = Object.keys(quizTable).length;
  const minMove = quizNum === 0;
  const maxMove = quizNum + 1 === quizLength;

  useMemo(
    (_) => {
      setShuffleAnswerKeys((_) => {
        let result = {};
        for (let index = 0; index < quizLength; index++) {
          result[index] = fisherYatesShuffle(CANDIDATE);
        }
        return { ...result };
      });
    },
    [quizLength]
  );
  useMemo(
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
      if (!selectedValue) setSelectedValue(quizTable[quizNum]["cache"]);
      setQuizInstruction(quizTable[quizNum]["_source"]["instruction"]);
      setShuffleAnswerUI([
        ...shuffleAnswerKeys[quizNum].map((value, index) => {
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
    [quizTable, quizNum, shuffleAnswerKeys, selectedValue]
  );
  useEffect((_) => {
    if (isNotSubmit) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  });

  const movePrevious = (_) => {
    setQuizNum((quizNum) => quizNum - 1);
    quizTable[quizNum]["cache"] = selectedValue;

    setSelectedValue("");
  };
  const moveNext = (_) => {
    setQuizNum((quizNum) => quizNum + 1);
    quizTable[quizNum]["cache"] = selectedValue;

    if (shuffleAnswerKeys[quizNum][selectedValue] === "answer")
      quizTable[quizNum]["correct"] = true;
    else if (!selectedValue) quizTable[quizNum]["correct"] = null;
    else quizTable[quizNum]["correct"] = false;

    setSelectedValue("");
  };
  const onClick = async (e) => {
    e.preventDefault();
    quizTable[quizNum]["cache"] = selectedValue;

    if (shuffleAnswerKeys[quizNum][selectedValue] === "answer")
      quizTable[quizNum]["correct"] = true;
    else if (!selectedValue) quizTable[quizNum]["correct"] = null;
    else quizTable[quizNum]["correct"] = false;

    const submitSheet = Object.values(quizTable).map((each) => each["correct"]);
    const submitObject = { sheet: {} };
    submitObject["sheet"][`${chapterId}`] = submitSheet;
    console.log(submitObject);
    await axios({
      url: `/user/record/${chapterId}`,
      method: "patch",
      data: submitObject,
    })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(setIsNotSubmit(false));
  };
  return (
    <>
      <Prompt
        when={isNotSubmit}
        message="퀴즈를 제출 하지 않았습니다. 그래도 나가시겠습니까?"
      />
      <div style={{ overflow: "hidden", padding: "20px 0" }}>
        <h2 style={{ float: "left", margin: 0 }}>
          {quizTitle} (챕터 {chapterId.charAt(chapterId.length - 1)})
        </h2>
        <span style={{ float: "right" }}>
          Question # {quizNum + 1} / {Object.keys(quizTable).length}
        </span>
      </div>
      {/* Paper에 패딩값 필요 */}
      <Paper elevation={4}>
        <h3>{quizInstruction}</h3>

        {shuffleAnswerUI}

        <div style={{ marginTop: 20 }}>
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
