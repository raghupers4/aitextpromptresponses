import React, { useEffect, useRef, useState } from "react";
import api from "./api/instance";
import Responses from "./Responses";
import "./styles/userprompt.scss";

// function to fetch api data from AI engine
async function fetchAIResponse(url, promptmsg) {
  try {
    const data = {
      prompt: promptmsg,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAPI_SECRET_KEY}`,
    };
    const response = await api.post(url, data, {
      headers,
    });
    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

// component that takes user input
function UserPrompt() {
  const [textAreaText, setTextAreaText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [promptText, setPromptText] = useState("");
  const [engine, setEngine] = useState("text-curie-001");
  const [responseData, setResponseData] = useState(null);
  const [submitBtnText, setSubmitBtnText] = useState("");
  const textAreaRef = useRef();

  const btnSubmitText = "Submit";
  const loadingText = "Loading...";
  const engines = [
    "text-curie-001",
    "text-davinci-002",
    "text-babbage-001",
    "text-ada-001",
  ];
  const url = `/engines/${engine}/completions`;

  useEffect(() => {
    textAreaRef.current.focus();
    setSubmitBtnText(btnSubmitText);
  }, []);

  const handleTextAreaOnChange = (evt) => {
    if (evt.target.value) {
      setErrorMsg("");
    }
    setTextAreaText(evt.target.value);
  };

  const handleSubmitClick = async () => {
    if (!textAreaText) {
      setErrorMsg("Please enter the prompt");
      return;
    }
    setErrorMsg("");
    setSubmitBtnText(loadingText);
    const aiResponse = await fetchAIResponse(url, textAreaText);
    setResponseData(aiResponse);
    setPromptText(textAreaText);
    setTextAreaText("");
    setSubmitBtnText(btnSubmitText);
  };

  const handleEngineSelectionChange = (evt) => {
    const selectedIndex = evt.target.selectedIndex;
    setEngine(engines[selectedIndex]);
  };
  return (
    <div className="userprompt">
      <div className="maintitle">Fun with AI</div>
      <div className="selectengines">
        <div className="selectaienginetext">Select AI Engine</div>
        <select
          className="enginesdropdown"
          onChange={handleEngineSelectionChange}
        >
          {engines.map((engine, index) => (
            <option key={index}>{engine}</option>
          ))}
        </select>
      </div>
      <div className="enterprompt">Enter prompt</div>
      <textarea
        ref={textAreaRef}
        className="prompttextarea"
        value={textAreaText}
        onChange={handleTextAreaOnChange}
      ></textarea>
      {errorMsg && <div className="errormsg">{errorMsg}</div>}
      <button className="btnsubmit" onClick={handleSubmitClick}>
        {submitBtnText}
      </button>
      {responseData && <div className="responsestext">Responses</div>}
      {responseData && <Responses data={responseData} prompt={promptText} />}
    </div>
  );
}

export default UserPrompt;
