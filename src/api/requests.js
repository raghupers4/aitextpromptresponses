import api from "./instance";

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

export { fetchAIResponse };
