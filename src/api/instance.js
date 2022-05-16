import axios from "axios";

// creating axios api instance
const api = axios.create({
  baseURL: "https://api.openai.com/v1/",
});

export default api;
