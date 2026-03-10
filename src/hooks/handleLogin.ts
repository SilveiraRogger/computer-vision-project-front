import type { LoginFormData } from "@/schemas/loginSchema"
import api from "@/services/api"
import { storage } from "@/services/storage"
import { resolveError } from "@/utils"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export function useLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleLogin(data: LoginFormData) {
    console.log("aaaaaaaaaaa")
    setLoading(true)
    try {
      const { data: response } = await api.post("/login", data)
      storage.setToken(response.access_token)
         toast.success("Usuário logado com sucesso")
      navigate("/home")
    } catch (err: any) {
      console.log(err?.response)
      resolveError(err)
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading }
}