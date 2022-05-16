import React from "react";
import ResponseComp from "./ResponseComp";
import "../styles/promptresponses.scss";

// component that displays list of responses
function Responses({ data, prompt, airesponses }) {
  if (airesponses.length > 0 || data?.choices?.length > 0) {
    if (
      data?.choices?.length > 0 &&
      airesponses &&
      !airesponses.find((airesponse) => airesponse.id === data.id)
    ) {
      const response = data.choices[0];
      airesponses.unshift({ id: data.id, prompt, response: response.text });
      // store responses to localstorage so that responses array will remain until the user clears the browser cache
      localStorage.setItem("airesponses", JSON.stringify(airesponses));
    }
    return (
      <div className="responses">
        {airesponses.map((airesponse) => (
          <ResponseComp key={airesponse.id} airesponse={airesponse} />
        ))}
      </div>
    );
  }
  return null;
}

export default React.memo(Responses);
