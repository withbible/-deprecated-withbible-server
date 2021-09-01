import React from "react";

import MainPage from "./pages/MainPage";
import ToolBar from './components/ToolBar';

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToolBar/>
      <MainPage />
    </div>
  );
};

export default App;
