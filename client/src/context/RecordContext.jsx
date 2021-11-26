import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [record, setRecord] = useState(null);  

  axios.defaults.headers.common["Content-Type"] = "application/json";
  useEffect(() => {
    axios
      .get("/score/myscore/raw", { withCredentials: true })
      .then(({ data }) => {
        setName(data.name);
        setRecord(data.quizRecord);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <RecordContext.Provider value={{ name, setName, record, setRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
