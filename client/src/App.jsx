import React from "react";
import { Switch, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import ToolBar from "./components/ToolBar";
import QuizPage from "./pages/QuizPage";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToolBar />
      <Switch>
        <Route path="/quiz/v2/content/:chapterId" exact component={QuizPage} />
        <Route path="/" component={MainPage} />
      </Switch>
    </div>
  );
};

export default App;
