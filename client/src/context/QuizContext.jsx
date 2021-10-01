import React, { createContext, useState } from "react";

export const QuizContext = createContext();
export const QuizProvider = (prop) => {
  const [quizTitle, setQuizTitle] = useState("");

  return (
    <QuizContext.Provider
      value={{
        quizTitle,
        setQuizTitle,
      }}
    >
      {prop.children}
    </QuizContext.Provider>
  );
};
