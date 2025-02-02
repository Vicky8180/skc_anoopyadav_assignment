

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/Tutor.css";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useNavigate } from "react-router-dom";

const CHAT_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

const Tutor = () => {
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Retrieve messages from sessionStorage
    const storedData = sessionStorage.getItem("chatMessages");
    if (storedData) {
      const { messages: storedMessages, timestamp } = JSON.parse(storedData);
      const now = new Date().getTime();

      if (now - timestamp < CHAT_EXPIRY_TIME) {
        setMessages(storedMessages);
      } else {
        sessionStorage.removeItem("chatMessages"); // Clear expired messages
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(
        "chatMessages",
        JSON.stringify({ messages, timestamp: new Date().getTime() })
      );
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

console.log(process.env.REACT_APP_BASE_URL_PORT)
    try {

      const res = await axios.post(`${process.env.REACT_APP_BASE_URL_PORT}/api/ai/chat`, {
        message: input,
      });


      console.log(res)
      const botMessage = res.data.response;
      setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong. Try again!" },
      ]);
    }

    setInput("");
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });

    // Highlight code blocks
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });

    // Add Copy and Run buttons inside each code block
    document.querySelectorAll("pre").forEach((pre) => {
      if (!pre.querySelector(".copy-btn")) {
        const copyBtn = document.createElement("button");
        copyBtn.innerText = "📋 Copy";
        copyBtn.className = "copy-btn";
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(pre.innerText);
          alert("✅ Code copied!");
        };
        pre.appendChild(copyBtn);
      }

      if (!pre.querySelector(".run-btn")) {
        const runBtn = document.createElement("button");
        runBtn.innerText = "Run";
        runBtn.className = "run-btn";
        runBtn.onclick = () => {
          const code = pre.querySelector("code").innerText;
          navigate("/codeeditor", { state: { code } });
        };
        pre.appendChild(runBtn);
      }
    });
  }, [messages, navigate]);

  return (
    <div className="chat-container">
      <h2>👩‍🏫 AI Python Tutor</h2>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === "bot" && (
              <img
                src="https://png.pngtree.com/png-clipart/20230122/original/pngtree-chatbot-customer-service-clipart-element-png-image_8925859.png"
                style={{ width: "30px", height: "30px" }}
                alt="AI Tutor"
                className="bot-avatar"
              />
            )}
            <div
              className="bot-message"
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a Python question..."
      />
      <button className="chat-container-button" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default Tutor;
