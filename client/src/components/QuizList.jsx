import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import chatImg from "../image/ul-comment-message.png";
import "./QuizList.css";
import { chatServerDomain } from "../../package.json";
import { SUBJECT_CODE_RECORDS } from "../utils/quiz";
import QuizItem from "./QuizItem";

const QuizMenu = (chapters) =>
  chapters.map(({ key }) => <QuizItem key={key} chapterId={key} />);

// quizInfo memorize해서 넘기기
const QuizList = ({ quizInfo }) => {
  const chapters = quizInfo && quizInfo.group_by_chapter.buckets;

  return (
    <>
      <div className="quiz-list-container">
        <h3>{quizInfo.key}</h3>
        <a
          href={`${chatServerDomain}/?room=${
            SUBJECT_CODE_RECORDS[quizInfo.key]
          }`}
          target="_blank"
          rel="noreferrer"
        >
          <img className="chat-img" src={chatImg} alt="" />
        </a>
      </div>

      <ScrollMenu>{QuizMenu(chapters)}</ScrollMenu>
    </>
  );
};

export default QuizList;
