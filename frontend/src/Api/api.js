import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_DB_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('bizToken') ?? "none"}`
  },
})  
export default api;