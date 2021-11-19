import React, { useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import { Grid, Paper, Tooltip, Box, Typography, Modal } from "@mui/material";

import { AuthContext } from "../context/AuthContext";
import chatImg from "../image/ul-comment-message.png";
import rankImg from "../image/ranking.png";
import "./QuizList.css";
import { chatServerDomain } from "../../package.json";
import { chapterIdValueObject } from "../utils/utils";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// quizInfo memorize해서 넘기기
const QuizList = ({ quizInfo }) => {
  const { record } = useContext(AuthContext);
  const chapters = quizInfo && quizInfo.group_by_chapter.buckets;
  const [open, setOpen] = useState(false);
  const [rankData, setRankData] = useState([]);


  const handleOpen = async() => {
    await axios.get(`/user/ranking/${chapterIdValueObject[quizInfo.key]}`)
    .then((data)=>{
      setRankData(data.data);
      setOpen(true);
    })
    .catch((err) => console.error(err));
  }
  const handleClose = () => setOpen(false);


  const QuizItem = ({ chapterId }) => {
    return (
      <Grid className="item-grid">
        <Tooltip title={
          record &&
          record[chapterId] &&
          record[chapterId].some((each) => each === null)
            ? "진행중"
            : record && Object.keys(record).includes(chapterId)
            ? "완료"
            : ""
        } followCursor>
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
        </Tooltip>
      </Grid>
    );
  };

  const RankList = () =>{
    return(
                  <Box sx={style}>
                    <Typography  variant="h6" component="h2">
                          💯💯순위💯💯
                      </Typography>
                      <Typography  sx={{ mt: 2 }}>
                            {rankData.data.map((ranking,i)=>(
                              <p>{i+1}등 : {ranking.name}</p>
                            ))}
                    </Typography>
                  </Box>
    );
  }
  return (
      <>
          <div className="quiz-list-container">
              <h3>{quizInfo.key}</h3>

              <img className="chat-img" src={rankImg} onClick={handleOpen} alt="" />
              <Modal open={open} onClose={handleClose} >
              <RankList/>
              </Modal>

              <a href={`${chatServerDomain}/?room=${chapterIdValueObject[quizInfo.key]}`} target="_blank" rel="noreferrer">
                  <img className="chat-img" src={chatImg} alt="" />
              </a>
          </div>

          <ScrollMenu>
              {chapters.map((chapter) => (
                  <QuizItem key={chapter.key} chapterId={chapter.key} className="item" />
              ))}
          </ScrollMenu>
      </>
  );
};

export default QuizList;
