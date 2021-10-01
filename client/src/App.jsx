import React from "react";
import { Switch, Route } from "react-router-dom";

import ToolBar from "./components/ToolBar";

import MainPage from "./pages/MainPage";
import QuizPage from "./pages/QuizPage";
import ChartPage from "./pages/ChartPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToolBar />
      <Switch>
        <Route path="/quiz/:chapterId" exact component={QuizPage} />
        <Route path="/quiz/chart/:chapterId" exact component={ChartPage} />
        <Route path="/auth/register" exact component={RegisterPage} />
        <Route path="/auth/login" exact component={LoginPage} />
        <Route path="/" component={MainPage} />
      </Switch>
    </div>
  );
};

export default App;
