import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [record, setRecord] = useState(null);
  let location = useLocation();

  axios.defaults.headers.post["Content-Type"] = "application/json";
  useEffect(() => {        
    axios
      .get("/user/me", { withCredentials: true })
      .then(({ data }) => {
        setName(data.name);
        setRecord(data.quizRecord);
      })
      .catch((err) => {
        console.log(err);
      });    
  }, [location.pathname]);
  return (
    <AuthContext.Provider value={{ name, setName, record, setRecord }}>
      {children}
    </AuthContext.Provider>
  );
};
