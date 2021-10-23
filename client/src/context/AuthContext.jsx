import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState();
  const [record, setRecord] = useState();
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (me) {
      axios.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("sessionId", me.sessionId);
    } else if (sessionId) {
      axios
        .get("/user/me", { headers: { sessionid: sessionId } })
        .then(({ data }) => {
          setMe({
            userId: data.userId,
            sessionId: data.sessionId,
            name: data.name,
          });
          setRecord({ ...data.quizRecord });
        })
        .catch(() => {
          localStorage.removeItem("sessionId");
          delete axios.defaults.headers.common.sessionid;
        });
    } else delete axios.defaults.headers.common.sessionid;
  }, [me]);
  return (
    <AuthContext.Provider value={{ me, setMe, record }}>
      {" "}
      {children}
    </AuthContext.Provider>
  );
};
