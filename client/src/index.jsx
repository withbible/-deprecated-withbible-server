import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { RecordProvider } from "./context/RecordContext";
import { QuizProvider } from "./context/QuizContext";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RecordProvider>
        <QuizProvider>
          <App />
        </QuizProvider>
      </RecordProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
