import React from "react";
import ResponseComp from "./ResponseComp";
import "./styles/promptresponses.scss";
const airesponses = [];

// component that displays list of responses
function Responses({ data, prompt }) {
  if (data && data.choices.length > 0) {
    const response = data.choices[0];
    if (!airesponses.find((airesponse) => airesponse.id === data.id)) {
      airesponses.unshift({ id: data.id, prompt, response: response.text });
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
