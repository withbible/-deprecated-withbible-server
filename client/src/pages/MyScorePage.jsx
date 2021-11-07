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
  const sessionid = localStorage.getItem("sessionId");

  useMemo(() => {
    axios
      .get("/user/myscore", { headers: { sessionid } })
      .then(({ data }) => {
        setScores(data.data);
        setName(data.name);
      })
      .catch((err) => console.error(err));
  }, [sessionid]);

  const boards = Object.entries(scores).map(([subject, chapters]) => {
    if (!chapters.length) return "";
    return (
      <TableRow>
        <TableCell align="center" rowSpan={chapters.length}>
          {subject}
        </TableCell>
        {chapters.map((chapter) => {
          const [chapterId, detail] = Object.entries(chapter)[0];
          return (
            <TableRow>
              {/* colSpan 늘어나는 이슈 해결 요함  */}
              <TableCell
                align="center"
                style={
                  detail.state === "proceed"
                    ? { backgroundColor: "#64b5f6" }
                    : { backgroundColor: "#fff176" }
                }
              >
                {chapterId}장
              </TableCell>
              <TableCell align="center">{detail.score}</TableCell>
            </TableRow>
          );
        })}
      </TableRow>
    );
  });

  return (
    <>
      <h2 style={{ marginTop: 50, marginBottom: 50 }}>{name}님의 점수</h2>
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
