import React from "react";
import { Switch, Route } from "react-router-dom";

import ToolBar from "./components/ToolBar";

import MainPage from "./pages/MainPage";
import QuizPage from "./pages/QuizPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToolBar />
      <Switch>
        <Route path="/quiz/v2/content/:chapterId" exact component={QuizPage} />
        <Route path="/auth/register" exact component={RegisterPage} />
        <Route path="/auth/login" exact component={LoginPage} />
        <Route path="/" component={MainPage} />
      </Switch>
    </div>
  );
};

export default App;
