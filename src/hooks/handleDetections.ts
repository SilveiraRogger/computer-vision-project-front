import api from "@/services/api"
import type { Detection } from "@/types/detection.types"
import { resolveError } from "@/utils"
import { useState } from "react"

export function useDetections() {
  const [detections, setDetections] = useState<Detection[]>([])
  const [loadingDetections, setLoadingDetections] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingAll, setDeletingAll] = useState(false)

  async function fetchDetections() {
    setLoadingDetections(true)
    try {
      const { data } = await api.get("/detections")
      setDetections(data)
    } catch (err){
      resolveError(err)
    } finally {
      setLoadingDetections(false)
    }
  }

  async function deleteOne(id: string) {
    setDeletingId(id)
    try {
      await api.delete(`/detections/${id}`)
      setDetections((prev) => prev.filter((d) => d.id !== id))
      return true
    } finally {
      setDeletingId(null)
    }
  }

  async function deleteAll() {
    setDeletingAll(true)
    try {
      await api.delete("/detections")
      setDetections([])
    } finally {
      setDeletingAll(false)
    }
  }

  return {
    detections,
    loadingDetections,
    deletingId,
    deletingAll,
    fetchDetections,
    deleteOne,
    deleteAll,
  }
}