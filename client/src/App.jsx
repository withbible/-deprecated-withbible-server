import React from "react";
import { Switch, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import ToolBar from "./components/ToolBar";
import MainPage from "./pages/MainPage";
import QuizPage from "./pages/QuizPage";
import ChartPage from "./pages/ChartPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MyScorePage from "./pages/MyScorePage";

const theme = createTheme();

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToolBar />
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/quiz/:chapterId" exact component={QuizPage} />
          <Route path="/quiz/chart/:chapterId" exact component={ChartPage} />
          <Route path="/auth/register" exact component={RegisterPage} />
          <Route path="/auth/login" exact component={LoginPage} />
          <Route path="/mypage/score" component={MyScorePage} />
          <Route path="/" component={MainPage} />
        </Switch>
      </ThemeProvider>
    </div>
  );
};

export default App;
