import axios from "axios";
import { storage } from "./storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
})

  console.log(import.meta.env.VITE_API_URL);
  
  

 api.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeToken()
      storage.removeUser()
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

export default api
