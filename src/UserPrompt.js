import React, { useEffect, useRef, useState } from "react";
import api from "./api/instance";
import Responses from "./Responses";
import "./styles/userprompt.scss";

let airesponses;

// function to load previous responses from local storage
(function loadAiResponses() {
  airesponses = JSON.parse(localStorage.getItem("airesponses")) || [];
})();

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
    return err?.response?.data ?? { error: { message: err?.message } };
  }
}

// component that takes user input
function UserPrompt() {
  const [textAreaText, setTextAreaText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [engine, setEngine] = useState("text-curie-001");
  const [responseData, setResponseData] = useState(null);
  const [loadingText, setLoadingText] = useState("");
  const textAreaRef = useRef();

  const textAreaPlaceholdertext =
    "Ask something to receive a automated response from AI";
  const btnSubmitText = "Submit";
  const engines = [
    "text-curie-001",
    "text-davinci-002",
    "text-babbage-001",
    "text-ada-001",
  ];
  const url = `/engines/${engine}/completions`;

  useEffect(() => {
    textAreaRef.current.focus();
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
    setIsLoading(true);
    setLoadingText(`Loading AI response for the prompt: "${textAreaText}"`);
    const aiResponse = await fetchAIResponse(url, textAreaText);
    if (aiResponse.error && aiResponse.error.message) {
      setErrorMsg(aiResponse.error.message);
    } else {
      setResponseData(aiResponse);
    }
    setIsLoading(false);
    setPromptText(textAreaText);
    setTextAreaText("");
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
        placeholder={textAreaPlaceholdertext}
        onChange={handleTextAreaOnChange}
      ></textarea>
      {errorMsg && <div className="errormsg">{errorMsg}</div>}
      <button className="btnsubmit" onClick={handleSubmitClick}>
        {btnSubmitText}
      </button>
      {isLoading && <div className="loadingtext">{loadingText}</div>}
      {(airesponses.length > 0 || responseData) && (
        <div className="responsestext">Responses</div>
      )}
      {(airesponses.length > 0 || responseData) && (
        <Responses
          airesponses={airesponses}
          data={responseData}
          prompt={promptText}
        />
      )}
    </div>
  );
}

export default UserPrompt;
