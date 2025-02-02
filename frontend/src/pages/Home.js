import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Tutor from "./Tutor"
import CodeEditor from "../components/codeEditor";
import Homework from "../components/HomeWork";
const Home = () => {
  const navigate = useNavigate();

  return (
    <>
        <div className="home-container">
      <h1>Welcome to AI Python Tutor</h1>
      <p>
        Learn Python in a fun and interactive way! Our AI-powered tutor is here
        to help kids aged 4-10 understand coding basics.
      </p>
      <div style={{display:'flex', gap:'4vh', justifyContent:"center" }}>
      <button onClick={() => navigate("/tutor")}>Start Learning</button>
      <button onClick={() => navigate("/codeeditor")}>Code Editor</button>

      </div>

    </div>

<div style={{display:'flex'}}>
<Homework/>


</div>
    </>

  );
};

export default Home;
