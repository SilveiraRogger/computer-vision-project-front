import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff, Security } from "@mui/icons-material"
import { loginSchema, type LoginFormData } from "@/schemas/loginSchema"
import { useLogin } from "@/hooks/handleLogin"
 
import { colors } from "@/theme/colors"
import FormInput from "@/components/formInput"
import FormButton from "@/components/formButton"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { handleLogin, loading } = useLogin()

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-0 { animation: slideIn 0.5s ease forwards; }
        .slide-1 { opacity: 0; animation: slideIn 0.5s ease 0.15s forwards; }
        .slide-2 { opacity: 0; animation: slideIn 0.5s ease 0.3s forwards; }
        .slide-3 { opacity: 0; animation: slideIn 0.5s ease 0.45s forwards; }
      `}</style>

      <div className="min-h-screen flex" style={{ backgroundColor: colors.bg }}>
 
        <div
          className="hidden lg:flex flex-col justify-between w-1/2 p-16"
          style={{
            background: `linear-gradient(135deg, #111827, ${colors.bg})`,
            borderRight: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex items-center gap-2 slide-0">
            <Security sx={{ color: colors.primary }} fontSize="small" />
            <span className="text-sm font-medium tracking-widest uppercase" style={{ color: colors.textSecondary }}>
              SafetyVision
            </span>
          </div>

          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6 slide-1" style={{ color: colors.textPrimary }}>
              Detecção de EPIs<br />
              com{" "}
              <span style={{ color: colors.primary }}>IA</span>
            </h1>
            <p className="text-base leading-relaxed max-w-sm slide-2" style={{ color: colors.textMuted }}>
              Monitore equipamentos de proteção individual com visão computacional.
            </p>
            <div className="flex flex-wrap gap-3 mt-10 slide-3">
              <span
                className="text-xs rounded-full px-4 py-1.5"
                style={{ color: colors.textMuted, border: `1px solid ${colors.border}` }}
              >
                YOLOv11
              </span>
            </div>
          </div>

          <p className="text-xs slide-3" style={{ color: colors.textFaint }}>
            © 2026 SafetyVision
          </p>
        </div>
 
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">

            <div className="flex items-center gap-2 mb-10 lg:hidden">
              <Security sx={{ color: colors.primary }} fontSize="small" />
              <span className="text-sm font-medium tracking-widest uppercase" style={{ color: colors.textSecondary }}>
                SafetyVision
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              Bem-vindo
            </h2>
            <p className="text-sm mb-8" style={{ color: colors.textMuted }}>
              Entre com sua conta para continuar
            </p>

            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
              <FormInput
                name="email"
                control={control}
                label="E-mail"
                type="email"
                error={errors.email}
              />

              <FormInput
                name="password"
                control={control}
                label="Senha"
                type={showPassword ? "text" : "password"}
                error={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: colors.textMuted }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormButton loading={loading} label="Entrar" />
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: colors.textFaint }}>
                ou
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            </div>

            <p className="text-center text-sm" style={{ color: colors.textMuted }}>
              Não tem conta?{" "}
              <Link to="/register" className="font-medium" style={{ color: colors.primary }}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}