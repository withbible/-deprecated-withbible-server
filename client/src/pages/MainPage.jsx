import React, { useState, useEffect } from "react";
import axios from "axios";

import QuizList from "../components/QuizList";

const MainPage = () => {
  const [subjectUrl, setSubjectUrl] = useState("/quiz/v2");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    let isComplete = false;
    async function get(){
      const { data } = await axios.get(subjectUrl);
      if (!isComplete) 
        setSubjects(data.data.group_by_state.buckets);
    };
    get();
    return () => isComplete = true;
  }, [subjectUrl]);

  console.log(subjects);
  return (
    <div>
      <h2>메인페이지</h2>
      <QuizList subjects={subjects}/>
    </div>
  );
};

export default MainPage;
