import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>