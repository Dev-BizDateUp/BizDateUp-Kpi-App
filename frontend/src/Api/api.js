import axios from "axios"

const api = axios.create({
  baseURL: "https://bizdateup-kpi-app-700705311790.asia-south1.run.app",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('bizToken') ?? "none"}`
  },
})
export default api;