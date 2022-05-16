import React, { useEffect, useRef, useState } from "react";
import Responses from "./Responses";
import { fetchAIResponse } from "../api/requests";
import "../styles/userprompt.scss";

let airesponses;

// function to load previous responses from local storage
(function loadAiResponses() {
  airesponses = JSON.parse(localStorage.getItem("airesponses")) || [];
})();

// component that takes user input
function UserPrompt() {
  const [textAreaText, setTextAreaText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [engine, setEngine] = useState("text-curie-001");
  const [responseData, setResponseData] = useState(null);
  const [loadingText, setLoadingText] = useState("");
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false);
  const textAreaRef = useRef();

  const textAreaPlaceholdertext =
    "Ask a question to receive a automated response from AI";
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
    setIsSubmitBtnDisabled(true);
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
    setIsSubmitBtnDisabled(false);
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
      <button
        disabled={isSubmitBtnDisabled}
        className={
          isSubmitBtnDisabled ? "btnsubmit disabled" : "btnsubmit enabled"
        }
        onClick={handleSubmitClick}
      >
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
