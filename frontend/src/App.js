import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Tutor from "./pages/Tutor";
import CodeEditor from "./components/codeEditor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/codeeditor" element={<CodeEditor/>}/>
      </Routes>
    </Router>
  );
};

export default App;
