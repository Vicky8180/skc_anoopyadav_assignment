import React, { useState } from "react";
import axios from "axios";
import "../styles/HomeWork.css";

const HomeworkFeature = () => {
  const [input, setInput] = useState("");
  const [homework, setHomework] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTutor, setAiTutor] = useState("");
  const [interactive, setInteractive] = useState(false);

  const getHomework = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/ai/chat`,
        {
          message: `You are my Tutor, please provide me Homework based on topic which i am intrested. Topic on which i am interested:${input}`,
        }
      );

      const homeworkData = res.data.response;
      setHomework(homeworkData);

      if (res.data.interactive) {
        setInteractive(true);
      }

      setAiTutor(res.data.aiTutor || "Friendly Tutor");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching homework:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getHomework();
  };

  return (
    <div className="homework-feature">
      <h2>Homework Assignment</h2>
      <div>
        <label htmlFor="homeworkInput">
          What subject or lesson are you working on?
        </label>
        <input
          type="text"
          id="homeworkInput"
          value={input}
          onChange={handleInputChange}
          placeholder="e.g., Math, History, Science"
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Generating Homework..." : "Get Homework"}
        </button>
      </div>

      {homework && (
        <div className="homework-output">
          <h3>Homework Assigned:</h3>

          <p dangerouslySetInnerHTML={{ __html: homework }} />

          {interactive && (
            <div className="interactive-section">
              <h4>Interactive Quiz:</h4>
              <p>Answer the questions below to test your knowledge!</p>
            </div>
          )}

          <div className="tutor-info">
            <p>AI Tutor: {aiTutor}</p>
            <p>
              Tip: {aiTutor} will guide you through this homework in a way that
              suits your learning style!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkFeature;
