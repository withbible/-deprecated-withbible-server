import React, { useMemo, useState } from "react";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MyScorePage = () => {
  const [scores, setScores] = useState({});
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  useMemo(() => {
    axios
      .get("/score/aggregate/me")
      .then(({ data }) => {
        setScores(data.data);
        setName(data.name);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }, []);

  const boards = Object.entries(scores).map(([subject, chapters], index) => {
    if (!chapters.length) return "";
    return (
      <TableRow key={index}>
        <TableCell align="center" rowSpan={chapters.length}>
          {subject}
        </TableCell>
        {chapters.map((chapter) => (
          <div>
            {/* colSpan 늘어나는 이슈 해결 요함  */}
            <TableCell
              align="center"
              style={
                chapter.detail.state === "proceed"
                  ? { backgroundColor: "#64b5f6" }
                  : { backgroundColor: "#fff176" }
              }
            >
              {chapter.chapterId}장
            </TableCell>
            <TableCell align="center">{chapter.detail.score}</TableCell>
          </div>
        ))}
      </TableRow>
    );
  });
  if (error) return <h3>기록이 존재하지 않습니다.</h3>;
  return (
    <>
      <h2 style={{ margin: "50px 0" }}>{name}님의 점수</h2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">과목</TableCell>
              <TableCell align="center">챕터 및 점수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{boards}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MyScorePage;
