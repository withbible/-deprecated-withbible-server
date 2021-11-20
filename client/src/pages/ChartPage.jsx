import React, { useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import CanvasJSReact from "../lib/canvasjs.react.js";
import { QuizContext } from "../context/QuizContext";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ChartPage = (_) => {
  const { chapterId } = useParams();
  const { quizTitle } = useContext(QuizContext);
  const [dataPoints, setDataPoints] = useState([]);

  useMemo(
    (_) => {
      axios.get(`/user/totalscore/${chapterId}`).then(({ data }) => {
        const records = Object.values(data.data).map(
          (each) => each.quizRecord[`${chapterId}`]
        );
        const dataPoints = Object.values(countQuizRecords(records)).map(
          (point, index) => ({ label: index + 1, y: point })
        );
        setDataPoints(dataPoints);
      });
    },
    [chapterId]
  );
  const countQuizRecords = (records) => {
    return records.reduce((acc, record) => {
      record.forEach(
        (quiz, index) => (acc[index] = (acc[index] || 0) + (1 && quiz))
      );
      return acc;
    }, {});
  };
  const options = {
    title: {
      text: "가장 난이도 있던 문제는?",
    },
    data: [
      {
        type: "column",
        dataPoints: dataPoints,
      },
    ],
  };
  return (
    <>
      <h2>
        {quizTitle} (챕터 {chapterId.charAt(chapterId.length - 1)})
      </h2>
      <CanvasJSChart options={options} />
    </>
  );
};

export default ChartPage;
