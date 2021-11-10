import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import chatImg from "../image/ul-comment-message.png";
import "./QuizList.css";
import { chatServerDomain } from "../../package.json";
import { chapterIdValueObject } from "../utils/utils";
import QuizItem from "./QuizItem";

// quizInfo memorize해서 넘기기
const QuizList = ({ quizInfo }) => {
  const chapters = quizInfo && quizInfo.group_by_chapter.buckets;

  return (
    <>
      <div className="quiz-list-container">
        <h3>{quizInfo.key}</h3>
        <a
          href={`${chatServerDomain}/?room=${
            chapterIdValueObject[quizInfo.key]
          }`}
          target="_blank"
          rel="noreferrer"
        >
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
