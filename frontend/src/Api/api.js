import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('bizToken') ?? "none"}`
  },
})
export default api;