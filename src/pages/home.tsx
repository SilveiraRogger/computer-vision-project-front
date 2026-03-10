import Upload from "@/components/upload"
import { useDetections } from "@/hooks/handleDetections"
import { storage } from "@/services/storage"
import { colors } from "@/theme/colors"
import type { Detection } from "@/types/detection.types"
import {
  ChevronLeft, ChevronRight, Close, DeleteOutline,
  DeleteSweep, ImageSearch, Logout, Menu, Security
} from "@mui/icons-material"
import {
  Chip, CircularProgress, Drawer,
  IconButton, Tooltip, useMediaQuery,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)

  const {
    detections, loadingDetections, deletingId, deletingAll,
    fetchDetections, deleteOne, deleteAll,
  } = useDetections()

  useEffect(() => {
    fetchDetections()
  }, [])

  async function handleDeleteOne(id: string) {
    await deleteOne(id)
    if (selectedDetection?.id === id) setSelectedDetection(null)
  }

  async function handleDeleteAll() {
    await deleteAll()
    setSelectedDetection(null)
  }

  function handleLogout() {
    storage.removeToken()
    storage.removeUser()
    navigate("/")
  }

  function openDetection(d: Detection) {
    setSelectedDetection(d)
    setShowOriginal(false)
    if (isMobile) setSidebarOpen(false)
  }

  const currentIndex = detections.findIndex((d) => d.id === selectedDetection?.id)

  function goNext() {
    if (currentIndex < detections.length - 1) {
      setSelectedDetection(detections[currentIndex + 1])
      setShowOriginal(false)
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setSelectedDetection(detections[currentIndex - 1])
      setShowOriginal(false)
    }
  }

  const SidebarContent = (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.bgCard }}>
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Detecções</p>
          <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{detections.length} registros</p>
        </div>
        <div className="flex items-center gap-1">
          {detections.length > 0 && (
            <Tooltip title="Excluir todas">
              <IconButton
                onClick={handleDeleteAll}
                disabled={deletingAll}
                size="small"
                sx={{ color: colors.error + "99", "&:hover": { color: colors.error } }}
              >
                {deletingAll
                  ? <CircularProgress size={16} sx={{ color: colors.error }} />
                  : <DeleteSweep fontSize="small" />
                }
              </IconButton>
            </Tooltip>
          )}
          {isMobile && (
            <IconButton size="small" onClick={() => setSidebarOpen(false)} sx={{ color: colors.textMuted }}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingDetections ? (
          <div className="flex items-center justify-center h-32">
            <CircularProgress size={24} sx={{ color: colors.primary }} />
          </div>
        ) : detections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 px-4">
            <ImageSearch sx={{ color: colors.border, fontSize: 40 }} />
            <p className="text-xs text-center" style={{ color: colors.textFaint }}>
              Nenhuma detecção ainda.<br />Envie imagens para começar.
            </p>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-1">
            {detections.map((d) => (
              <div
                key={d.id}
                onClick={() => openDetection(d)}
                className="group flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer"
                style={{
                  backgroundColor: selectedDetection?.id === d.id ? colors.primarySubtle : "transparent",
                  border: `1px solid ${selectedDetection?.id === d.id ? colors.primary + "40" : "transparent"}`,
                }}
                onMouseEnter={(e) => {
                  if (selectedDetection?.id !== d.id)
                    e.currentTarget.style.backgroundColor = colors.bgHover
                }}
                onMouseLeave={(e) => {
                  if (selectedDetection?.id !== d.id)
                    e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <img
                  src={d.image_url_result || d.image_url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  style={{ backgroundColor: colors.bgHover }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                    {d.id.slice(0, 8)}...
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: colors.textFaint }}>
                    {d.result?.length ?? 0} detecções
                  </p>
                </div>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleDeleteOne(d.id) }}
                  disabled={deletingId === d.id}
                  sx={{
                    flexShrink: 0,
                    color: colors.error + "99",
                    opacity: isMobile ? 1 : 0,
                    transition: "opacity 0.2s",
                    ".group:hover &": { opacity: 1 },
                    "&:hover": { color: colors.error },
                  }}
                >
                  {deletingId === d.id
                    ? <CircularProgress size={14} sx={{ color: colors.error }} />
                    : <DeleteOutline fontSize="small" />
                  }
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg }}>

      <header
        className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10"
        style={{ backgroundColor: colors.bgCard, borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center gap-3">
          {isMobile && (
            <IconButton size="small" onClick={() => setSidebarOpen(true)} sx={{ color: colors.textMuted }}>
              <Menu fontSize="small" />
            </IconButton>
          )}
          <div className="flex items-center gap-2">
            <Security sx={{ color: colors.primary }} fontSize="small" />
            <span className="text-sm font-medium tracking-widest uppercase hidden sm:block" style={{ color: colors.textSecondary }}>
              SafetyVision
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip title="Sair">
            <IconButton onClick={handleLogout} sx={{ color: colors.textMuted }}>
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <aside className="w-72 flex flex-col overflow-hidden" style={{ borderRight: `1px solid ${colors.border}` }}>
            {SidebarContent}
          </aside>
        )}

        {isMobile && (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            PaperProps={{ sx: { width: 300, backgroundColor: colors.bg, border: "none" } }}
          >
            {SidebarContent}
          </Drawer>
        )}

        <main className="flex-1 overflow-y-auto">
          {selectedDetection ? (
            <div className="w-full max-w-3xl mx-auto py-6 px-4 sm:px-6">

              {/* Header do detalhe */}
              <div className="flex items-start justify-between mb-6 gap-2">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    Detalhes da detecção
                  </h1>
                  <p className="text-xs mt-1 break-all" style={{ color: colors.textMuted }}>
                    ID: {selectedDetection.id}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <IconButton
                    size="small"
                    onClick={goPrev}
                    disabled={currentIndex <= 0}
                    sx={{ color: colors.textMuted, "&:disabled": { opacity: 0.3 } }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <span className="text-xs whitespace-nowrap" style={{ color: colors.textMuted }}>
                    {currentIndex + 1} / {detections.length}
                  </span>
                  <IconButton
                    size="small"
                    onClick={goNext}
                    disabled={currentIndex >= detections.length - 1}
                    sx={{ color: colors.textMuted, "&:disabled": { opacity: 0.3 } }}
                  >
                    <ChevronRight />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedDetection(null)}
                    sx={{ color: colors.textMuted }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </div>
              </div>

              {/* Imagem */}
              <div className="relative rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: colors.bgCard }}>
                <img
                  src={showOriginal ? selectedDetection.image_url : selectedDetection.image_url_result}
                  alt="detecção"
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
              </div>

              {/* Chips */}
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>
                Objetos detectados
              </p>
              {selectedDetection.result?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedDetection.result.map((det, i) => (
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
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
                  style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, color: colors.textMuted }}
                >
                  <ImageSearch fontSize="small" />
                  Nenhum objeto detectado nesta imagem.
                </div>
              )}
            </div>
          ) : (
            <Upload onSuccess={fetchDetections} />
          )}
        </main>
      </div>
    </div>
  )
}