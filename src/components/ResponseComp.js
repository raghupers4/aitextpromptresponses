import React from "react";

// component that displays each response
const ResponseComp = ({ airesponse }) => {
  const { prompt, response } = airesponse;
  return (
    <div className="promptresponse">
      <div className="prompt">
        <div className="promptlabel">Prompt: </div>
        <div className="promptmsg">{prompt}</div>
      </div>
      <div className="airesponse">
        <div className="airesponselabel">Response: </div>
        <div className="airesponsemsg">{response}</div>
      </div>
    </div>
  );
};

export default ResponseComp;
