import { useUpload } from "@/hooks"
import { colors } from "@/theme/colors"
import {
  CheckCircle, ChevronLeft, ChevronRight,
  Close, CloudUpload, ErrorOutline, ImageSearch,
} from "@mui/icons-material"
import { Button, Chip, CircularProgress, IconButton, LinearProgress } from "@mui/material"
import { useState } from "react"

interface Props {
  onSuccess?: () => void
}

export default function Upload({ onSuccess }: Props) {
  const {
    inputRef, files, dragging, setDragging, loading,
    results, allDone, hasError, pending,
    addFiles, removeFile, clearAll, handleUpload,
  } = useUpload(onSuccess)

  const [carouselIndex, setCarouselIndex] = useState(0)
  const [showOriginal, setShowOriginal] = useState(false)

  function handleClearAll() {
    clearAll()
    setCarouselIndex(0)
    setShowOriginal(false)
  }

  const current = results[carouselIndex]

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 sm:px-6">

      <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
        Enviar imagens
      </h1>
      <p className="text-sm mb-6 sm:mb-8" style={{ color: colors.textMuted }}>
        Selecione uma ou mais imagens para análise de EPIs
      </p>

     
      {results.length === 0 && (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              addFiles(e.dataTransfer.files)
            }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl p-8 sm:p-12 cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragging ? colors.primary : colors.border}`,
              backgroundColor: dragging ? colors.primarySubtle : colors.bgCard,
            }}
          >
            <CloudUpload sx={{ fontSize: 40, color: dragging ? colors.primary : colors.textMuted }} />
            <p className="text-sm text-center" style={{ color: colors.textMuted }}>
              Arraste imagens aqui ou{" "}
              <span style={{ color: colors.primary }}>clique para selecionar</span>
            </p>
            <p className="text-xs" style={{ color: colors.textFaint }}>
              JPG, PNG, WEBP — múltiplos arquivos permitidos
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </>
      )}

      {files.length > 0 && results.length === 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              {files.length} imagem{files.length > 1 ? "ns" : ""} selecionada{files.length > 1 ? "s" : ""}
            </p>
            {!loading && (
              <button onClick={handleClearAll} className="text-xs" style={{ color: colors.textMuted }}>
                Limpar tudo
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
            {files.map((item, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                <img src={item.preview} alt="" className="w-full h-full object-cover" />

                {item.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <CircularProgress size={20} sx={{ color: colors.primary }} />
                  </div>
                )}
                {item.status === "done" && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                    <CheckCircle sx={{ color: "#22c55e", fontSize: 28 }} />
                  </div>
                )}
                {item.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <ErrorOutline sx={{ color: colors.error, fontSize: 28 }} />
                  </div>
                )}
                {item.status === "pending" && (
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: colors.error }}
                  >
                    <Close sx={{ fontSize: 12, color: "white" }} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {loading && (
            <LinearProgress
              sx={{
                mb: 4,
                borderRadius: 1,
                backgroundColor: colors.bgHover,
                "& .MuiLinearProgress-bar": { backgroundColor: colors.primary },
              }}
            />
          )}

          {hasError && !loading && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm"
              style={{ backgroundColor: colors.errorSubtle, border: `1px solid rgba(239,68,68,0.2)`, color: colors.error }}
            >
              <ErrorOutline fontSize="small" />
              Ocorreu um erro. Tente novamente.
            </div>
          )}

          {!allDone && (
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleUpload}
              disabled={loading || pending === 0}
              startIcon={loading
                ? <CircularProgress size={18} sx={{ color: "white" }} />
                : <CloudUpload />
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                backgroundColor: colors.primary,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontSize: 13,
                "&:hover": { backgroundColor: colors.primaryHover },
                "&:disabled": { backgroundColor: colors.primaryDisabled },
              }}
            >
              {loading ? "Processando..." : `Enviar ${pending} imagem${pending !== 1 ? "ns" : ""}`}
            </Button>
          )}
        </div>
      )}

      {results.length > 0 && current && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Resultados — {carouselIndex + 1} / {results.length}
              </p>
              <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                {current.result.length} objeto{current.result.length !== 1 ? "s" : ""} detectado{current.result.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: colors.textMuted, border: `1px solid ${colors.border}` }}
            >
              Nova análise
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: colors.bgCard }}>
            <img
              src={showOriginal ? current.image_url : current.image_url_result}
              alt="resultado"
              className="w-full object-contain max-h-64 sm:max-h-96"
            />

            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex rounded-full overflow-hidden text-xs font-medium"
              style={{ border: `1px solid ${colors.border}`, backgroundColor: "rgba(0,0,0,0.7)" }}
            >
              <button
                onClick={() => setShowOriginal(false)}
                className="px-3 sm:px-4 py-1.5 transition-all"
                style={{
                  backgroundColor: !showOriginal ? colors.primary : "transparent",
                  color: !showOriginal ? "white" : colors.textMuted,
                }}
              >
                Resultado
              </button>
              <button
                onClick={() => setShowOriginal(true)}
                className="px-3 sm:px-4 py-1.5 transition-all"
                style={{
                  backgroundColor: showOriginal ? colors.primary : "transparent",
                  color: showOriginal ? "white" : colors.textMuted,
                }}
              >
                Original
              </button>
            </div>

            {results.length > 1 && (
              <>
                <IconButton
                  onClick={() => { setCarouselIndex((i) => i - 1); setShowOriginal(false) }}
                  disabled={carouselIndex === 0}
                  size="small"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                    "&:disabled": { opacity: 0.3 },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={() => { setCarouselIndex((i) => i + 1); setShowOriginal(false) }}
                  disabled={carouselIndex === results.length - 1}
                  size="small"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                    "&:disabled": { opacity: 0.3 },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}
          </div>

          {current.result.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {current.result.map((det, i) => (
                <Chip
                  key={i}
                  label={`${det.class === "safety_shoe" ? "🟢" : "🔴"} ${det.class} — ${(det.confidence * 100).toFixed(0)}%`}
                  size="small"
                  sx={{
                    backgroundColor: det.class === "safety_shoe" ? "rgba(34,197,94,0.1)" : colors.errorSubtle,
                    color: det.class === "safety_shoe" ? "#22c55e" : colors.error,
                    border: `1px solid ${det.class === "safety_shoe" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 mb-6 text-sm"
              style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.border}`, color: colors.textMuted }}
            >
              <ImageSearch fontSize="small" />
              Nenhum objeto detectado nesta imagem.
            </div>
          )}

          {results.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {results.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => { setCarouselIndex(i); setShowOriginal(false) }}
                  className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                  style={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${i === carouselIndex ? colors.primary : "transparent"}`,
                    opacity: i === carouselIndex ? 1 : 0.5,
                  }}
                >
                  <img src={r.image_url_result} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}