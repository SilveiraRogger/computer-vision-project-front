import type { RegisterFormData } from "@/schemas/registerSchema"
import api from "@/services/api"
import { resolveError } from "@/utils"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export function useRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleRegister(data: RegisterFormData) {
    setLoading(true)
    try {
      await api.post("/user", data)
      toast.success("Conta criada com sucesso!")
      navigate("/")
    } catch (err) {
      resolveError(err)
    } finally {
      setLoading(false)
    }
  }

  return { handleRegister, loading }
}