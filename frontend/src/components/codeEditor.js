import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "../styles/codeEditor.css";
import { useLocation } from "react-router-dom";

const CodeEditor = () => {
  const location = useLocation();
  const [code, setCode] = useState(
    location.state?.code ||
      `name = input("Enter your name: ")\nprint("Hello,", name)`
  );
  const [output, setOutput] = useState("");
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.code) {
      setCode(location.state.code);
    }
  }, [location.state]);

  useEffect(() => {
    const loadPyodide = async () => {
      setLoading(true);
      try {
        if (!window.pyodideInstance) {
          console.log("Loading Pyodide...");
          const pyodideInstance = await window.loadPyodide();
          await pyodideInstance.loadPackage(["micropip"]);
          window.pyodideInstance = pyodideInstance;
        }
        setPyodide(window.pyodideInstance);
      } catch (error) {
        console.error("Error loading Pyodide:", error);
        setOutput(
          "⚠️ Failed to load Pyodide. Please check your internet connection."
        );
      }
      setLoading(false);
    };

    if (!window.loadPyodide) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      script.onload = loadPyodide;
      script.onerror = () => {
        console.error("Pyodide failed to load.");
        setOutput(
          "⚠️ Failed to load Pyodide. Please check your internet connection."
        );
        setLoading(false);
      };
      document.body.appendChild(script);
    } else {
      loadPyodide();
    }
  }, []);

  const runCode = async () => {
    if (!pyodide) {
      setOutput("⚠️ Pyodide is still loading. Please wait...");
      return;
    }

    try {
      console.log("Running code:", code);

      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);

      pyodide.globals.set("input", (prompt) =>
        window.prompt(prompt || "Enter input:")
      );

      await pyodide.runPythonAsync(code);

      const result = pyodide.runPython("sys.stdout.getvalue()");
      console.log("Execution Result:", result);

      setOutput(result || "No output generated");
    } catch (error) {
      console.error("Execution Error:", error);
      setOutput(`⚠️ Error: ${error.message}`);
    }
  };

  return (
    <div className="editor-container">
      <h2>🐍 Python Code Editor</h2>
      {loading && <p>Loading Pyodide... Please wait.</p>}
      <Editor
        height="450px"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{ fontSize: 16 }}
      />
      <button onClick={runCode} disabled={loading || !pyodide}>
        Run Code
      </button>

      <div className="output-container">
        <h3>🖥️ Output:</h3>
        <pre>{output || "No output yet"}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
